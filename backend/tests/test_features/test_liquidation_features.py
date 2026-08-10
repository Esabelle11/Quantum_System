import pandas as pd

from app.features.liquidation_features import (
    add_liquidation_value,
    calculate_liquidation_sides,
    total_liquidations,
    liquidation_imbalance,
    rolling_liquidation_volume,
    liquidation_spike,
)


def test_add_liquidation_value():

    df = pd.DataFrame({
        "price": [100_000],
        "quantity": [2],
    })

    result = add_liquidation_value(df)

    assert (
        result.loc[0, "value"]
        == 200_000
    )


def test_liquidation_sides():

    df = pd.DataFrame({
        "price": [
            100_000,
            100_000,
        ],
        "quantity": [
            1,
            2,
        ],
        "side": [
            "Sell",
            "Buy",
        ],
    })

    result = calculate_liquidation_sides(df)

    assert (
        result.loc[0, "long_liquidation"]
        == 100_000
    )

    assert (
        result.loc[0, "short_liquidation"]
        == 0
    )

    assert (
        result.loc[1, "short_liquidation"]
        == 200_000
    )


def test_total_liquidations():

    df = pd.DataFrame({
        "price": [100_000],
        "quantity": [2],
        "side": ["Sell"],
    })

    result = total_liquidations(df)

    assert (
        result.loc[0, "total_liquidation"]
        == 200_000
    )


def test_liquidation_imbalance():

    df = pd.DataFrame({
        "price": [
            100_000,
            100_000,
        ],
        "quantity": [
            1,
            1,
        ],
        "side": [
            "Sell",
            "Buy",
        ],
    })

    result = liquidation_imbalance(df)

    assert (
        result.loc[0, "liquidation_imbalance"]
        == 1.0
    )

    assert (
        result.loc[1, "liquidation_imbalance"]
        == -1.0
    )


def test_liquidation_spike():

    df = pd.DataFrame({
        "price": [100_000] * 5,
        "quantity": [
            1,
            1,
            1,
            1,
            10,
        ],
        "side": [
            "Sell",
            "Sell",
            "Sell",
            "Sell",
            "Sell",
        ],
    })

    result = liquidation_spike(
        df,
        window=3,
        multiplier=3.0,
    )

    assert (
        "liquidation_spike"
        in result.columns
    )