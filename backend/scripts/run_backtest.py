import logging

import pandas as pd

from app.backtest.engine import BacktestEngine
from app.backtest.strategy import (
    FundingOIStrategy,
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


INITIAL_CAPITAL = 10_000.0


def load_data(
    path: str,
) -> pd.DataFrame:

    logger.info(
        "Loading backtest data from %s",
        path,
    )

    df = pd.read_csv(path)

    if df.empty:
        raise ValueError(
            "Backtest dataset is empty."
        )

    return df


def main():

    # --------------------------------
    # Load historical feature dataset
    # --------------------------------

    df = load_data(
        "data/btcusdt_features.csv"
    )

    logger.info(
        "Loaded %d rows",
        len(df),
    )

    # --------------------------------
    # Strategy
    # --------------------------------

    strategy = FundingOIStrategy(
        funding_zscore_threshold=2.0,
        oi_change_threshold=0.001,
    )

    # --------------------------------
    # Backtest engine
    # --------------------------------

    engine = BacktestEngine(
        initial_capital=INITIAL_CAPITAL,
        strategy=strategy,
    )

    # --------------------------------
    # Run
    # --------------------------------

    logger.info(
        "Running backtest..."
    )

    result = engine.run(df)

    # --------------------------------
    # Results
    # --------------------------------

    logger.info(
        "Backtest finished."
    )

    print()
    print("=" * 50)
    print("BACKTEST RESULT")
    print("=" * 50)

    print(
        f"Initial capital: "
        f"${INITIAL_CAPITAL:,.2f}"
    )

    print(
        f"Final value: "
        f"${result.final_value:,.2f}"
    )

    print(
        f"Trades: "
        f"{len(result.trades)}"
    )

    print("=" * 50)


if __name__ == "__main__":
    main()