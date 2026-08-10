import pandas as pd

from app.features.funding_features import (
    funding_change,
    rolling_funding_mean,
    rolling_funding_std,
    funding_zscore,
    funding_extreme,
)


def test_funding_change():

    df = pd.DataFrame({
        "funding_rate": [
            0.001,
            0.002,
            0.0015,
        ]
    })

    result = funding_change(df)

    assert pd.isna(
        result.loc[0, "funding_change"]
    )

    assert (
        result.loc[1, "funding_change"]
        == 0.001
    )

    assert (
        result.loc[2, "funding_change"]
        == -0.0005
    )


def test_rolling_funding_mean():

    df = pd.DataFrame({
        "funding_rate": [
            0.001,
            0.002,
            0.003,
        ]
    })

    result = rolling_funding_mean(
        df,
        window=2,
    )

    assert pd.isna(
        result.loc[0, "funding_mean"]
    )

    assert (
        result.loc[1, "funding_mean"]
        == 0.0015
    )

    assert (
        result.loc[2, "funding_mean"]
        == 0.0025
    )


def test_funding_zscore():

    df = pd.DataFrame({
        "funding_rate": [
            0.001,
            0.002,
            0.003,
            0.004,
        ]
    })

    result = funding_zscore(
        df,
        window=3,
    )

    assert "funding_zscore" in result.columns

    assert pd.isna(
        result.loc[0, "funding_zscore"]
    )


def test_funding_extreme():

    df = pd.DataFrame({
        "funding_zscore": [
            0.5,
            1.5,
            2.1,
            -2.5,
        ]
    })

    result = funding_extreme(
        df,
        threshold=2.0,
    )

    assert result["funding_extreme"].tolist() == [
        False,
        False,
        True,
        True,
    ]