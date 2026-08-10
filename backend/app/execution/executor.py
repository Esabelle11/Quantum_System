from dataclasses import dataclass


@dataclass
class Order:
    symbol: str
    side: str
    quantity: float
    price: float


class PaperExecutor:

    def __init__(self):
        self.orders: list[Order] = []

    async def execute(
        self,
        symbol: str,
        side: str,
        quantity: float,
        price: float,
    ):

        order = Order(
            symbol=symbol,
            side=side,
            quantity=quantity,
            price=price,
        )

        self.orders.append(order)

        return {
            "status": "FILLED",
            "mode": "PAPER",
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "price": price,
        }