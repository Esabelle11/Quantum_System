# backend/scripts/view_parquet_app.py
#
# Run:
# streamlit run scripts/view_parquet_app.py

from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq
import streamlit as st


# ============================================================
# Configuration
# ============================================================

ROOT_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = ROOT_DIR / "data"

TOP_LEVEL_DATASETS = {
    "Features": DATA_DIR / "features",
    "Targets": DATA_DIR / "targets",
    "Raw": DATA_DIR / "raw",
    "Train": DATA_DIR / "train",
    "Splits": DATA_DIR / "splits",
    "Experiments 🔬": DATA_DIR / "experiments",
}


# ============================================================
# Page configuration
# ============================================================

st.set_page_config(
    page_title="Parquet Viewer",
    page_icon="📊",
    layout="wide",
)


# ============================================================
# Sidebar - Dataset selection
# ============================================================

st.sidebar.header("Dataset")


# ------------------------------------------------------------
# Dataset type
# ------------------------------------------------------------

dataset_type = st.sidebar.selectbox(
    "Dataset Type",
    options=list(TOP_LEVEL_DATASETS.keys()),
)

dataset_dir = TOP_LEVEL_DATASETS[dataset_type]


# ------------------------------------------------------------
# Find parquet files (Dynamic Handling for Nested Experiments)
# ------------------------------------------------------------
if dataset_type == "Splits":
    exp_dir = TOP_LEVEL_DATASETS["Splits"]

    # 1. Select Horizon / Timeframe folder
    modes = sorted([d.name for d in exp_dir.iterdir() if d.is_dir()])
    if not modes:
        st.error(f"No experiment modes found in `{exp_dir}`")
        st.stop()

    selected_mode = st.sidebar.selectbox("Mode", options=modes)
    mode_dir = exp_dir / selected_mode

    # Active folder where parquet files live
    dataset_dir = mode_dir

if dataset_type == "Experiments 🔬":
    exp_dir = TOP_LEVEL_DATASETS["Experiments 🔬"]

    # 1. Select Horizon / Timeframe folder
    horizons = sorted([d.name for d in exp_dir.iterdir() if d.is_dir()])
    if not horizons:
        st.error(f"No experiment horizons found in `{exp_dir}`")
        st.stop()

    selected_horizon = st.sidebar.selectbox("Horizon", options=horizons)
    horizon_dir = exp_dir / selected_horizon

    # 2. Select Task / Target folder (e.g., direction, return, multitask, etc.)
    tasks = sorted([d.name for d in horizon_dir.iterdir() if d.is_dir()])
    selected_task = st.sidebar.selectbox("Task", options=tasks)
    task_dir = horizon_dir / selected_task

    # 3. Select Split folder (e.g., train, test, validation)
    splits = sorted([d.name for d in task_dir.iterdir() if d.is_dir()])
    selected_split = st.sidebar.selectbox("Split", options=splits)
    split_dir = task_dir / selected_split

    # Active folder where parquet files live
    dataset_dir = split_dir

parquet_files = sorted(dataset_dir.glob("*.parquet"))


if not parquet_files:
    st.error(f"No parquet files found in:\n\n`{dataset_dir}`")
    st.stop()


# ------------------------------------------------------------
# File selection
# ------------------------------------------------------------

selected_file = st.sidebar.selectbox(
    "Data File",
    options=parquet_files,
    format_func=lambda path: path.name,
)

FILE_PATH = selected_file


# ============================================================
# Load Parquet metadata
# ============================================================

@st.cache_resource
def get_parquet_file(path: str):
    return pq.ParquetFile(path)


parquet_file = get_parquet_file(str(FILE_PATH))
metadata = parquet_file.metadata
TOTAL_ROWS = metadata.num_rows
TOTAL_ROW_GROUPS = metadata.num_row_groups
ALL_COLUMNS = parquet_file.schema.names


# ============================================================
# Page title
# ============================================================

st.title("📊 Parquet Data Viewer")

# Show relative path for clearer context
rel_path = FILE_PATH.relative_to(DATA_DIR)
st.caption(f"Path: `data/{rel_path}`")


# ============================================================
# Dataset information
# ============================================================

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Rows", f"{TOTAL_ROWS:,}")

with col2:
    st.metric("Columns", f"{len(ALL_COLUMNS):,}")

with col3:
    st.metric("Row Groups", f"{TOTAL_ROW_GROUPS:,}")

st.divider()


# ============================================================
# Sidebar - Viewer controls
# ============================================================

st.sidebar.header("Viewer Controls")


# ------------------------------------------------------------
# Percentage position
# ------------------------------------------------------------

percentage = st.sidebar.slider(
    "Dataset Position",
    min_value=0,
    max_value=100,
    value=0,
    step=1,
    format="%d%%",
)


# ------------------------------------------------------------
# Rows to display
# ------------------------------------------------------------

rows_to_display = st.sidebar.selectbox(
    "Rows to display",
    options=[10, 20, 50, 100, 200],
    index=1,
)


# ------------------------------------------------------------
# Column selection
# ------------------------------------------------------------

selected_columns = st.sidebar.multiselect(
    "Columns",
    options=ALL_COLUMNS,
    default=ALL_COLUMNS,
)

if not selected_columns:
    st.warning("Please select at least one column.")
    st.stop()


# ============================================================
# Calculate target row
# ============================================================

if TOTAL_ROWS == 0:
    st.warning("This Parquet file contains no rows.")
    st.stop()

target_row = int(TOTAL_ROWS * percentage / 100)
target_row = min(target_row, TOTAL_ROWS - 1)


# ============================================================
# Find row group
# ============================================================

def find_row_group(parquet_file, target_row):
    cumulative = 0
    for row_group_index in range(parquet_file.metadata.num_row_groups):
        row_count = parquet_file.metadata.row_group(row_group_index).num_rows
        if cumulative <= target_row < cumulative + row_count:
            offset = target_row - cumulative
            return row_group_index, offset
        cumulative += row_count
    raise IndexError("Target row is outside the dataset.")


row_group_index, row_offset = find_row_group(parquet_file, target_row)


# ============================================================
# Read only required row group
# ============================================================

@st.cache_data
def load_row_group(path: str, row_group_index: int, columns: tuple):
    pf = pq.ParquetFile(path)
    df = pf.read_row_group(row_group_index, columns=list(columns)).to_pandas()
    return df


df = load_row_group(str(FILE_PATH), row_group_index, tuple(selected_columns))


# ============================================================
# Calculate local position
# ============================================================

start = row_offset
end = min(start + rows_to_display, len(df))
display_df = df.iloc[start:end]


# ============================================================
# Position information
# ============================================================

st.subheader(f"Rows around {percentage}% of dataset")

info1, info2, info3 = st.columns(3)

with info1:
    st.write(f"**Target row:** {target_row:,}")

with info2:
    st.write(f"**Row group:** {row_group_index:,}")

with info3:
    if len(display_df) > 0:
        last_row = target_row + len(display_df) - 1
        st.write(f"**Showing:** {target_row:,} → {last_row:,}")
    else:
        st.write("**Showing:** No rows")


# ============================================================
# Display table
# ============================================================

st.dataframe(
    display_df,
    use_container_width=True,
    height=650,
)


# ============================================================
# Navigation
# ============================================================

st.divider()
st.subheader("Navigation")

nav1, nav2, nav3, nav4, nav5 = st.columns(5)

with nav1:
    if st.button("⏮ Start", use_container_width=True):
        st.query_params["position"] = "0"
        st.rerun()

with nav2:
    if st.button("◀ 25%", use_container_width=True):
        st.query_params["position"] = "25"
        st.rerun()

with nav3:
    if st.button("● 50%", use_container_width=True):
        st.query_params["position"] = "50"
        st.rerun()

with nav4:
    if st.button("75% ▶", use_container_width=True):
        st.query_params["position"] = "75"
        st.rerun()

with nav5:
    if st.button("End ⏭", use_container_width=True):
        st.query_params["position"] = "100"
        st.rerun()


# ============================================================
# Dataset schema
# ============================================================

with st.expander("Show dataset schema"):
    schema_data = []
    for i, column in enumerate(parquet_file.schema.names):
        schema_data.append(
            {
                "Index": i,
                "Column": column,
                "Type": str(parquet_file.schema_arrow.field(i).type),
            }
        )

    schema_df = pd.DataFrame(schema_data)

    st.dataframe(
        schema_df,
        use_container_width=True,
        hide_index=True,
    )


# ============================================================
# Dataset Summary Stats (df.describe)
# ============================================================

with st.expander("Show dataset statistics (df.describe)"):
    st.caption(
        f"Calculated on current Row Group ({row_group_index:,}) for selected columns."
    )

    include_all = st.checkbox(
        "Include categorical / non-numeric columns",
        value=False,
    )

    include_arg = "all" if include_all else None

    summary_df = df.describe(include=include_arg)

    st.dataframe(
        summary_df,
        use_container_width=True,
    )