import pandas as pd

from app.strategy.regime import (
    RegimeDetector,
)


def test_crowded_long_regime():

    detector = RegimeDetector()

    row = pd.Series({
        "return": 0.01,
        "volatility": 0.01,
        "oi_pct_change": 0.02,
        "funding_zscore": 2.5,
    })

    result = detector.detect(row)

    assert result.trend == "BULLISH"

    assert (
        result.positioning
        == "OI_INCREASING"
    )

    assert (
        result.funding
        == "EXTREME_POSITIVE"
    )

    assert (
        result.regime
        == "CROWDED_LONG"
    )


def test_crowded_short_regime():

    detector = RegimeDetector()

    row = pd.Series({
        "return": -0.01,
        "volatility": 0.01,
        "oi_pct_change": 0.02,
        "funding_zscore": -2.5,
    })

    result = detector.detect(row)

    assert result.trend == "BEARISH"

    assert (
        result.positioning
        == "OI_INCREASING"
    )

    assert (
        result.funding
        == "EXTREME_NEGATIVE"
    )

    assert (
        result.regime
        == "CROWDED_SHORT"
    )


def test_neutral_regime():

    detector = RegimeDetector()

    row = pd.Series({
        "return": 0.001,
        "volatility": 0.005,
        "oi_pct_change": 0.001,
        "funding_zscore": 0.2,
    })

    result = detector.detect(row)

    assert result.regime == "NEUTRAL"