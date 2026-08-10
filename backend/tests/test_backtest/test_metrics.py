from app.backtest import metrics


def test_metrics_module_exists():

    assert metrics is not None



# If your metrics file contains functions like:
# calculate_return()
# calculate_sharpe()
# calculate_max_drawdown()
# calculate_win_rate()
# then we should add exact numerical tests for each.