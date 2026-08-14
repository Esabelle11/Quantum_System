import numpy as np
import pandas as pd


# ============================================================
# Returns
# ============================================================

def calculate_returns(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "return" not in config:
        return df

    for key, periods in config["return"].items():
        df[f"return_{key}"] = (df["close"].pct_change(periods))

    return df


# ============================================================
# Log Returns
# ============================================================

def calculate_log_returns(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "log_return" not in config:
        return df

    for key, periods in config["log_return"].items():
        df[f"log_return_{key}"] = np.log(df["close"] / df["close"].shift(periods))

    return df


# ============================================================
# Momentum
# ============================================================
def calculate_momentum(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:
    df = df.copy()

    if "momentum" not in config:
        return df

    for key, periods in config["momentum"].items():
        current_return = (df["close"] / df["close"].shift(periods) - 1)
        previous_return = (df["close"].shift(periods) / df["close"].shift(periods * 2) - 1)
        df[f"momentum_{key}"] = (current_return - previous_return)

    return df


# ============================================================
# Volatility
# ============================================================
def calculate_volatility(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "volatility" not in config:
        return df

    for key, window in config["volatility"].items():

        returns = df["close"].pct_change()

        df[f"volatility_{key}"] = (returns.rolling(window).std())

    return df


# ============================================================
# ATR
# ============================================================

def calculate_atr(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "atr" not in config:
        return df

    high_low = df["high"] - df["low"]

    high_close = (df["high"] - df["close"].shift(1)).abs()

    low_close = (df["low"] - df["close"].shift(1)).abs()

    true_range = pd.concat(
        [
            high_low,
            high_close,
            low_close,
        ],
        axis=1,
    ).max(axis=1)

    for key, window in config["atr"].items():
        atr = true_range.rolling(window).mean()
        # Normalize ATR by current close
        df[f"atr_{key}"] = (atr / df["close"])


    return df


# ============================================================
# RSI
# ============================================================

def calculate_rsi(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "rsi" not in config:
        return df

    delta = df["close"].diff()  # delta:  +2   -1   +4   -2 
    gain = delta.clip(lower=0)  # gain:   +2    0   +4    0
    loss = -delta.clip(upper=0) # loss:   0   +1    0   +2

    for key, window in config["rsi"].items():
        avg_gain = gain.rolling(window).mean()
        avg_loss = loss.rolling(window).mean()
        rs = avg_gain / avg_loss

        df[f"rsi_{key}"] = ((100 - (100 / (1 + rs)))/100) 

    return df


# ============================================================
# EMA
# ============================================================

def calculate_ema(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "ema" not in config:
        return df

    ema_columns = {}

    # --------------------------------------------------------
    # Calculate EMA
    # --------------------------------------------------------
    for key, span in config["ema"].items():
        ema = (df["close"].ewm(span=span,adjust=False,).mean())
        ema_columns[key] = ema

    # --------------------------------------------------------
    # Calculate EMA spreads
    # --------------------------------------------------------

    keys = sorted(ema_columns.keys(),key=lambda key: config["ema"][key],)
    
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
            short_key = keys[i]
            long_key = keys[j]
            df[f"ema_spread_{short_key}_{long_key}"] = (ema_columns[short_key]/ ema_columns[long_key]- 1)
    return df


# ============================================================
# MACD
# ============================================================

def calculate_macd(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "macd" not in config:
        return df

    macd_config = config["macd"]

    fast = macd_config["fast"]
    slow = macd_config["slow"]
    signal = macd_config["signal"]

    ema_fast = (df["close"].ewm(span=fast,adjust=False,).mean())
    ema_slow = (df["close"].ewm(span=slow,adjust=False,).mean())

    macd = ema_fast - ema_slow

    macd_signal = (macd.ewm(span=signal,adjust=False,).mean())

    df["macd"] = macd / df["close"]
    df["macd_signal"] = macd_signal / df["close"]
    df["macd_histogram"] = (macd - macd_signal) / df["close"]

    return df


# ============================================================
# Volume Features
# ============================================================

def calculate_volume_features(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if "volume_ratio" in config:

        for key, window in config["volume_ratio"].items():
            volume_ma = (df["volume"].rolling(window).mean())
            df[f"volume_ratio_{key}"] = (df["volume"] / volume_ma)
        
    if "volume_change" in config:
        for key, periods in config["volume_change"].items():
            df[f"volume_change_{key}"] = (df["volume"] / df["volume"].shift(periods) - 1)

    return df


# ============================================================
# Candle Structure
# ============================================================

def calculate_candle_structure(
    df: pd.DataFrame,
    config: dict,
) -> pd.DataFrame:

    df = df.copy()

    if not config.get("candle_structure", False):
        return df

    candle_range = (df["high"] - df["low"])
    body = (df["close"] - df["open"]).abs()
    upper_wick = (df["high"]- df[["open", "close"]].max(axis=1))
    lower_wick = (df[["open", "close"]].min(axis=1)- df["low"])

    # df["candle_body"] = body
    # df["candle_range"] = candle_range
    # df["upper_wick"] = upper_wick
    # df["lower_wick"] = lower_wick
    # df["body_ratio"] = (body / candle_range)

    # --------------------------------------------------------
    # Normalize by current close
    # --------------------------------------------------------

    close = df["close"]

    df["candle_body"] = body / close
    df["candle_range"] = candle_range / close
    df["upper_wick"] = upper_wick / close
    df["lower_wick"] = lower_wick / close

    # --------------------------------------------------------
    # Candle body / range
    # --------------------------------------------------------

    df["body_ratio"] = ( body / candle_range.replace(0, np.nan) )

    return df



def calculate_price_features(
    df: pd.DataFrame,
    feature_config: dict,
) -> pd.DataFrame:

    df = df.copy()

    df = calculate_returns(df,feature_config,)

    df = calculate_log_returns(df,feature_config,)

    df = calculate_momentum(df,feature_config,)

    df = calculate_volatility(df,feature_config,)

    df = calculate_atr(df,feature_config,)

    df = calculate_rsi(df,feature_config,)

    df = calculate_ema(df,feature_config,)

    df = calculate_macd(df,feature_config,)

    df = calculate_volume_features(df,feature_config,)

    df = calculate_candle_structure(df,feature_config,)

    return df