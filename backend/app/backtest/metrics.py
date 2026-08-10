import numpy as np


def total_return(
    initial_value: float,
    final_value: float,
) -> float:

    return (
        final_value / initial_value
    ) - 1


def max_drawdown(equity_curve):

    equity = np.asarray(equity_curve)

    peak = np.maximum.accumulate(equity)

    drawdown = (
        equity - peak
    ) / peak

    return drawdown.min()