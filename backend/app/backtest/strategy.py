from dataclasses import dataclass

import pandas as pd


@dataclass
class BacktestSignal:
    action: str
    confidence: float
    reason: str


class FundingOIStrategy:
    """
    Simple research strategy using:

    - funding rate
    - funding z-score
    - OI percentage change

    This is a research example, not a production strategy.
    """

    def __init__(
        self,
        funding_zscore_threshold: float = 2.0,
        oi_change_threshold: float = 0.001,
    ):
        self.funding_zscore_threshold = (
            funding_zscore_threshold
        )

        self.oi_change_threshold = (
            oi_change_threshold
        )

    def generate_signal(
        self,
        row: pd.Series,
    ) -> BacktestSignal:

        funding_zscore = row.get(
            "funding_zscore",
            0.0,
        )

        oi_pct_change = row.get(
            "oi_pct_change",
            0.0,
        )

        # Extremely positive funding
        # + increasing OI
        #
        # Research hypothesis:
        # crowded long positioning
        #
        # We test whether this creates
        # future downside.

        if (
            funding_zscore
            >= self.funding_zscore_threshold
            and oi_pct_change
            >= self.oi_change_threshold
        ):

            return BacktestSignal(
                action="SELL",
                confidence=0.70,
                reason=(
                    "Extreme positive funding "
                    "+ rising open interest"
                ),
            )

        # Extremely negative funding
        # + increasing OI
        #
        # Research hypothesis:
        # crowded short positioning
        #
        # We test whether this creates
        # future upside.

        if (
            funding_zscore
            <= -self.funding_zscore_threshold
            and oi_pct_change
            >= self.oi_change_threshold
        ):

            return BacktestSignal(
                action="BUY",
                confidence=0.70,
                reason=(
                    "Extreme negative funding "
                    "+ rising open interest"
                ),
            )

        return BacktestSignal(
            action="HOLD",
            confidence=0.50,
            reason="No strong funding/OI signal",
        )