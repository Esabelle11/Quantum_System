from app.backtest.portfolio import Portfolio


def test_portfolio_initial_capital():

    portfolio = Portfolio(
        initial_capital=10_000
    )

    assert portfolio.cash == 10_000
    assert portfolio.position == 0


def test_buy_reduces_cash():

    portfolio = Portfolio(
        initial_capital=10_000
    )

    portfolio.buy(
        quantity=0.05,
        price=100_000,
    )

    assert portfolio.position == 0.05

    assert portfolio.cash == 5_000


def test_sell_increases_cash():

    portfolio = Portfolio(
        initial_capital=10_000
    )

    portfolio.buy(
        quantity=0.05,
        price=100_000,
    )

    portfolio.sell(
        quantity=0.05,
        price=110_000,
    )

    assert portfolio.position == 0

    assert portfolio.cash == 10_500