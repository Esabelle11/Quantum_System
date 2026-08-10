import pandas as pd


def oi_change(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = df.copy()

    df["oi_change"] = (
        df["open_interest"].diff()
    )

    return df


def oi_pct_change(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = df.copy()

    df["oi_pct_change"] = (
        df["open_interest"].pct_change()
    )

    return df


def rolling_oi_mean(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    df["oi_mean"] = (
        df["open_interest"]
        .rolling(window)
        .mean()
    )

    return df


def rolling_oi_std(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    df["oi_std"] = (
        df["open_interest"]
        .rolling(window)
        .std()
    )

    return df


def oi_zscore(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    mean = (
        df["open_interest"]
        .rolling(window)
        .mean()
    )

    std = (
        df["open_interest"]
        .rolling(window)
        .std()
    )

    df["oi_zscore"] = (
        (df["open_interest"] - mean)
        / std
    )

    return df


def oi_momentum(
    df: pd.DataFrame,
    window: int = 5,
) -> pd.DataFrame:

    df = df.copy()

    df["oi_momentum"] = (
        df["open_interest"]
        .pct_change(window)
    )

    return df