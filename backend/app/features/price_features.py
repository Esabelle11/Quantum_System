import pandas as pd


def calculate_returns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["return"] = df["close"].pct_change()

    return df


def calculate_log_returns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["log_return"] = (
        df["close"]
        .apply(float)
        .pipe(lambda x: __import__("numpy").log(x / x.shift(1)))
    )

    return df