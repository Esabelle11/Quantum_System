import pandas as pd


def funding_change(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = df.copy()

    df["funding_change"] = (
        df["funding_rate"].diff()
    )

    return df


def rolling_funding_mean(
    df: pd.DataFrame,
    window: int = 10,
) -> pd.DataFrame:

    df = df.copy()

    df["funding_mean"] = (
        df["funding_rate"]
        .rolling(window)
        .mean()
    )

    return df


def rolling_funding_std(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    df["funding_std"] = (
        df["funding_rate"]
        .rolling(window)
        .std()
    )

    return df


def funding_zscore(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = df.copy()

    mean = (
        df["funding_rate"]
        .rolling(window)
        .mean()
    )

    std = (
        df["funding_rate"]
        .rolling(window)
        .std()
    )

    df["funding_zscore"] = (
        (df["funding_rate"] - mean)
        / std
    )

    return df


def funding_extreme(
    df: pd.DataFrame,
    threshold: float = 2.0,
) -> pd.DataFrame:

    df = df.copy()

    df["funding_extreme"] = (
        df["funding_zscore"].abs()
        >= threshold
    )

    return df