from app.execution import risk_manager


def test_risk_manager_module_exists():

    assert risk_manager is not None



# Once we know your exact risk manager interface, I'd add tests for:
# Maximum position size
# Maximum leverage
# Stop loss
# Maximum drawdown
# Risk per trade
# Insufficient balance
# Invalid quantity
# These should eventually be some of your most heavily tested components.