from app.exchange.bybit_websocket import BybitWebSocket
from datetime import datetime, timezone
from app.storage.respiratories.trade_repository import TradeRepository


class TradeCollector:

    def __init__(self):
        self.exchange = BybitWebSocket()
        self.repository = TradeRepository()

    async def collect(self):

        async for message in self.exchange.subscribe_trades(
            symbol="BTCUSDT"
        ):

            if message.get("topic", "").startswith("publicTrade"):

                for item in message.get("data", []):
                    price = float(item["p"])
                    quantity = float(item["v"])
                    liquidation_side = ("long" if item["S"] == "Buy" else "short")

                    record= {
                        "symbol": item["s"],
                        "timestamp": datetime.fromtimestamp(
                            int(item["T"]) / 1000,
                            tz=timezone.utc,
                        ),
                        "side": liquidation_side, # item["S"],
                        "price": price,
                        "quantity": quantity,
                        "value": price * quantity,
                    }

                    self.repository.insert(record)

                    yield record