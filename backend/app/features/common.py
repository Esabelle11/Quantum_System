import pandas as pd


def timestamp_convert(
    df: pd.DataFrame,
    timeframe: str,
    aggregation: dict,
) -> pd.DataFrame:

    df = df.copy()

    df["timestamp"] = pd.to_datetime(
        df["timestamp"],
        utc=True
    )

    df = (
        df
        .sort_values("timestamp")
        .set_index("timestamp")
    )

    result = df.resample(timeframe).agg(aggregation)

    return result.reset_index()


# kline = timestamp_convert(
#     df,
#     "15min",
#     {
#         "open": "first",
#         "high": "max",
#         "low": "min",
#         "close": "last",
#         "volume": "sum",
#         "turnover": "sum",
#     }
# )

# kline["return"] = kline["close"].pct_change()

# oi = timestamp_convert(
#     df,
#     "15min",
#     {
#         "open_interest": "last",
#         "open_interest_value": "last",
#     }
# )

# funding = timestamp_convert(
#     df,
#     "1h",
#     {
#         "funding_rate": "mean",
#     }
# )