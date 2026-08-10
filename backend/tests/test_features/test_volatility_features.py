import pandas as pd

from app.features import volatility_features


def test_volatility_feature_module_exists():

    assert volatility_features is not None


def test_price_data_is_valid_for_volatility():

    df = pd.DataFrame({
        "close": [
            100,
            101,
            102,
            101,
            103,
        ]
    })

    returns = df["close"].pct_change()

    assert returns.notna().sum() > 0

    assert returns.iloc[1] > 0