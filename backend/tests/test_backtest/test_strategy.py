import pandas as pd

from app.backtest.strategy import (
    FundingOIStrategy,
)


def test_extreme_positive_funding_signal():

    strategy = FundingOIStrategy(
        funding_zscore_threshold=2.0,
        oi_change_threshold=0.001,
    )

    row = pd.Series({
        "funding_zscore": 2.5,
        "oi_pct_change": 0.01,
    })

    signal = strategy.generate_signal(row)

    assert signal.action == "SELL"


def test_extreme_negative_funding_signal():

    strategy = FundingOIStrategy(
        funding_zscore_threshold=2.0,
        oi_change_threshold=0.001,
    )

    row = pd.Series({
        "funding_zscore": -2.5,
        "oi_pct_change": 0.01,
    })

    signal = strategy.generate_signal(row)

    assert signal.action == "BUY"


def test_normal_market_is_hold():

    strategy = FundingOIStrategy()

    row = pd.Series({
        "funding_zscore": 0.5,
        "oi_pct_change": 0.001,
    })

    signal = strategy.generate_signal(row)

    assert signal.action == "HOLD"