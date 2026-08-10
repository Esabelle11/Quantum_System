from app.exchange.bybit_websocket import BybitWebSocket
from datetime import datetime, timezone
from app.storage.respiratories.orderbook_repository import OrderbookRepository



class OrderbookCollector:

    def __init__(self):
        self.exchange = BybitWebSocket()
        self.repository = OrderbookRepository()

    async def collect(self):

        async for message in self.exchange.subscribe_orderbook(symbol="BTCUSDT"):
            if message.get("topic", "").startswith("orderbook"):
                
                record={
                    "symbol": "BTCUSDT",
                    "timestamp":  datetime.fromtimestamp(
                            int(message.get("ts")) / 1000,
                            tz=timezone.utc,
                        ),
                    "data": message.get("data", {}),
                }

                self.repository.insert(record)

                yield record