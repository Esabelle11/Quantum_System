import pandas as pd

from app.features.oi_features import (
    oi_change,
    oi_pct_change,
    rolling_oi_mean,
    rolling_oi_std,
    oi_zscore,
    oi_momentum,
)


def test_oi_change():

    df = pd.DataFrame({
        "open_interest": [
            100,
            110,
            105,
        ]
    })

    result = oi_change(df)

    assert pd.isna(
        result.loc[0, "oi_change"]
    )

    assert result.loc[1, "oi_change"] == 10

    assert result.loc[2, "oi_change"] == -5


def test_oi_pct_change():

    df = pd.DataFrame({
        "open_interest": [
            100,
            110,
        ]
    })

    result = oi_pct_change(df)

    assert pd.isna(
        result.loc[0, "oi_pct_change"]
    )

    assert (
        result.loc[1, "oi_pct_change"]
        == 0.10
    )


def test_rolling_oi_mean():

    df = pd.DataFrame({
        "open_interest": [
            100,
            110,
            120,
        ]
    })

    result = rolling_oi_mean(
        df,
        window=2,
    )

    assert (
        result.loc[1, "oi_mean"]
        == 105
    )

    assert (
        result.loc[2, "oi_mean"]
        == 115
    )


def test_oi_zscore():

    df = pd.DataFrame({
        "open_interest": [
            100,
            110,
            120,
            130,
        ]
    })

    result = oi_zscore(
        df,
        window=3,
    )

    assert "oi_zscore" in result.columns


def test_oi_momentum():

    df = pd.DataFrame({
        "open_interest": [
            100,
            110,
            121,
        ]
    })

    result = oi_momentum(
        df,
        window=1,
    )

    assert (
        result.loc[1, "oi_momentum"]
        == 0.10
    )