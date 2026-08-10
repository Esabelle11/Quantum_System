import pandas as pd


def add_liquidation_value(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = df.copy()

    if "value" not in df.columns:

        df["value"] = (
            df["price"]
            * df["quantity"]
        )

    return df


def calculate_liquidation_sides(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = add_liquidation_value(df)

    df = df.copy()

    # Bybit liquidation side:
    # Sell liquidation = long position liquidated
    # Buy liquidation = short position liquidated

    df["long_liquidation"] = (
        df["value"]
        .where(df["side"] == "Sell", 0)
    )

    df["short_liquidation"] = (
        df["value"]
        .where(df["side"] == "Buy", 0)
    )

    return df


def total_liquidations(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = calculate_liquidation_sides(df)

    df["total_liquidation"] = (
        df["long_liquidation"]
        + df["short_liquidation"]
    )

    return df


def liquidation_imbalance(
    df: pd.DataFrame,
) -> pd.DataFrame:

    df = total_liquidations(df)

    denominator = (
        df["total_liquidation"]
        .replace(0, float("nan"))
    )

    df["liquidation_imbalance"] = (
        (
            df["long_liquidation"]
            - df["short_liquidation"]
        )
        / denominator
    )

    return df


def rolling_liquidation_volume(
    df: pd.DataFrame,
    window: int = 20,
) -> pd.DataFrame:

    df = total_liquidations(df)

    df["liquidation_rolling_volume"] = (
        df["total_liquidation"]
        .rolling(window)
        .sum()
    )

    return df


def liquidation_spike(
    df: pd.DataFrame,
    window: int = 20,
    multiplier: float = 3.0,
) -> pd.DataFrame:

    df = total_liquidations(df)

    rolling_mean = (
        df["total_liquidation"]
        .rolling(window)
        .mean()
    )

    df["liquidation_spike"] = (
        df["total_liquidation"]
        > rolling_mean * multiplier
    )

    return df