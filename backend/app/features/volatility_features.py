import pandas as pd


def rolling_volatility(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    df["volatility"] = (
        df["return"]
        .rolling(window)
        .std()
    )

    return df