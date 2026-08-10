from dataclasses import dataclass

import pandas as pd


@dataclass
class MarketRegime:
    trend: str
    volatility: str
    positioning: str
    funding: str
    regime: str
    confidence: float
    reason: str


class RegimeDetector:
    """
    Detect the current BTCUSDT market regime.

    The detector uses:
    - price trend
    - volatility
    - open interest
    - funding rate
    """

    def __init__(
        self,
        high_volatility_threshold: float = 0.02,
        strong_trend_threshold: float = 0.005,
        oi_change_threshold: float = 0.01,
        funding_extreme_threshold: float = 2.0,
    ):
        self.high_volatility_threshold = (
            high_volatility_threshold
        )

        self.strong_trend_threshold = (
            strong_trend_threshold
        )

        self.oi_change_threshold = (
            oi_change_threshold
        )

        self.funding_extreme_threshold = (
            funding_extreme_threshold
        )

    def detect(
        self,
        row: pd.Series,
    ) -> MarketRegime:

        price_return = float(
            row.get("return", 0.0)
        )

        volatility = float(
            row.get("volatility", 0.0)
        )

        oi_pct_change = float(
            row.get("oi_pct_change", 0.0)
        )

        funding_zscore = float(
            row.get("funding_zscore", 0.0)
        )

        # --------------------------------
        # 1. Determine trend
        # --------------------------------

        if (
            price_return
            >= self.strong_trend_threshold
        ):
            trend = "BULLISH"

        elif (
            price_return
            <= -self.strong_trend_threshold
        ):
            trend = "BEARISH"

        else:
            trend = "SIDEWAYS"

        # --------------------------------
        # 2. Determine volatility
        # --------------------------------

        if (
            volatility
            >= self.high_volatility_threshold
        ):
            volatility_state = "HIGH"

        else:
            volatility_state = "LOW"

        # --------------------------------
        # 3. Determine positioning
        # --------------------------------

        if (
            oi_pct_change
            >= self.oi_change_threshold
        ):
            positioning = "OI_INCREASING"

        elif (
            oi_pct_change
            <= -self.oi_change_threshold
        ):
            positioning = "OI_DECREASING"

        else:
            positioning = "OI_STABLE"

        # --------------------------------
        # 4. Determine funding state
        # --------------------------------

        if (
            funding_zscore
            >= self.funding_extreme_threshold
        ):
            funding_state = "EXTREME_POSITIVE"

        elif (
            funding_zscore
            <= -self.funding_extreme_threshold
        ):
            funding_state = "EXTREME_NEGATIVE"

        else:
            funding_state = "NORMAL"

        # --------------------------------
        # 5. Determine overall regime
        # --------------------------------

        regime = self._classify_regime(
            trend=trend,
            volatility=volatility_state,
            positioning=positioning,
            funding=funding_state,
        )

        confidence = self._calculate_confidence(
            trend=trend,
            volatility=volatility_state,
            positioning=positioning,
            funding=funding_state,
        )

        reason = self._build_reason(
            trend=trend,
            volatility=volatility_state,
            positioning=positioning,
            funding=funding_state,
        )

        return MarketRegime(
            trend=trend,
            volatility=volatility_state,
            positioning=positioning,
            funding=funding_state,
            regime=regime,
            confidence=confidence,
            reason=reason,
        )

    def _classify_regime(
        self,
        trend: str,
        volatility: str,
        positioning: str,
        funding: str,
    ) -> str:

        # --------------------------------
        # Strong bullish environment
        # --------------------------------

        if (
            trend == "BULLISH"
            and positioning == "OI_INCREASING"
            and funding == "NORMAL"
        ):
            return "BULLISH_TREND"

        # --------------------------------
        # Potential crowded long
        # --------------------------------

        if (
            trend == "BULLISH"
            and positioning == "OI_INCREASING"
            and funding == "EXTREME_POSITIVE"
        ):
            return "CROWDED_LONG"

        # --------------------------------
        # Strong bearish environment
        # --------------------------------

        if (
            trend == "BEARISH"
            and positioning == "OI_INCREASING"
            and funding == "NORMAL"
        ):
            return "BEARISH_TREND"

        # --------------------------------
        # Potential crowded short
        # --------------------------------

        if (
            trend == "BEARISH"
            and positioning == "OI_INCREASING"
            and funding == "EXTREME_NEGATIVE"
        ):
            return "CROWDED_SHORT"

        # --------------------------------
        # High volatility environment
        # --------------------------------

        if volatility == "HIGH":
            return "HIGH_VOLATILITY"

        # --------------------------------
        # OI decreasing
        # --------------------------------

        if positioning == "OI_DECREASING":
            return "DELEVERAGING"

        # --------------------------------
        # No strong structure
        # --------------------------------

        return "NEUTRAL"

    def _calculate_confidence(
        self,
        trend: str,
        volatility: str,
        positioning: str,
        funding: str,
    ) -> float:

        score = 0.50

        if trend != "SIDEWAYS":
            score += 0.10

        if positioning != "OI_STABLE":
            score += 0.10

        if funding != "NORMAL":
            score += 0.10

        if volatility == "HIGH":
            score += 0.05

        return min(score, 0.95)

    def _build_reason(
        self,
        trend: str,
        volatility: str,
        positioning: str,
        funding: str,
    ) -> str:

        return (
            f"Trend={trend}, "
            f"Volatility={volatility}, "
            f"Positioning={positioning}, "
            f"Funding={funding}"
        )



# import pandas as pd
# from app.strategy.regime import RegimeDetector

# row = pd.Series({
#     "return": 0.008,
#     "volatility": 0.012,
#     "oi_pct_change": 0.018,
#     "funding_zscore": 2.7,
# })

# detector = RegimeDetector()
# regime = detector.detect(row)
# print(regime)