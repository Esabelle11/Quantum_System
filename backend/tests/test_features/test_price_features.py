import pandas as pd

from app.features import price_features


def test_price_feature_module_exists():

    assert price_features is not None


def test_price_features_preserve_dataframe():

    df = pd.DataFrame({
        "open": [100, 101, 102],
        "high": [102, 103, 104],
        "low": [99, 100, 101],
        "close": [101, 102, 103],
        "volume": [1000, 1100, 1200],
    })

    assert not df.empty

    assert "close" in df.columns