from dataclasses import dataclass

import pandas as pd

from app.backtest.portfolio import Portfolio
from app.backtest.strategy import (
    FundingOIStrategy,
)


@dataclass
class BacktestResult:
    equity_curve: list[float]
    trades: list[dict]
    final_value: float


class BacktestEngine:

    def __init__(
        self,
        initial_capital: float = 10_000.0,
        strategy=None,
    ):

        self.initial_capital = initial_capital

        self.strategy = (
            strategy
            if strategy is not None
            else FundingOIStrategy()
        )

    def run(
        self,
        df: pd.DataFrame,
    ) -> BacktestResult:

        if df.empty:
            raise ValueError(
                "Backtest dataset is empty"
            )

        required_columns = {
            "close",
        }

        missing = (
            required_columns
            - set(df.columns)
        )

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        df = df.copy()

        # Very important:
        # historical data must be ordered
        # chronologically.

        if "timestamp" in df.columns:
            df = df.sort_values(
                "timestamp"
            )

        portfolio = Portfolio(
            initial_capital=self.initial_capital
        )

        equity_curve = []

        for _, row in df.iterrows():

            price = float(row["close"])

            signal = (
                self.strategy.generate_signal(row)
            )

            # --------------------------------
            # BUY
            # --------------------------------

            if signal.action == "BUY":

                # Example:
                # use 10% of available cash

                quantity = (
                    portfolio.cash * 0.10
                ) / price

                portfolio.buy(
                    quantity=quantity,
                    price=price,
                )

            # --------------------------------
            # SELL
            # --------------------------------

            elif signal.action == "SELL":

                # Close current position

                if portfolio.position > 0:

                    portfolio.sell(
                        quantity=portfolio.position,
                        price=price,
                    )

            # --------------------------------
            # Calculate portfolio value
            # --------------------------------

            portfolio_value = (
                portfolio.cash
                + portfolio.position * price
            )

            equity_curve.append(
                portfolio_value
            )

        # Final mark-to-market value

        final_price = float(
            df.iloc[-1]["close"]
        )

        final_value = (
            portfolio.cash
            + portfolio.position * final_price
        )

        return BacktestResult(
            equity_curve=equity_curve,
            trades=portfolio.trades,
            final_value=final_value,
        )