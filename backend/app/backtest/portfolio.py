class Portfolio:

    def __init__(self, initial_capital: float):
        self.initial_capital = initial_capital
        self.cash = initial_capital
        self.position = 0.0
        self.trades = []

    def buy(self, quantity: float, price: float):

        cost = quantity * price

        if cost > self.cash:
            return False

        self.cash -= cost
        self.position += quantity

        self.trades.append({
            "side": "BUY",
            "quantity": quantity,
            "price": price,
        })

        return True

    def sell(self, quantity: float, price: float):

        if quantity > self.position:
            return False

        self.cash += quantity * price
        self.position -= quantity

        self.trades.append({
            "side": "SELL",
            "quantity": quantity,
            "price": price,
        })

        return True