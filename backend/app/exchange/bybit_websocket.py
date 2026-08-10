import json
import websockets

from app.config.settings import settings


class BybitWebSocket:

    def __init__(self):

        if settings.bybit_testnet:
            self.url = (
                "wss://stream-testnet.bybit.com/"
                "v5/public/linear"
            )
        else:
            self.url = (
                "wss://stream.bybit.com/"
                "v5/public/linear"
            )

    async def _subscribe(self, topic: str):
        # print("url: ", self.url)

        async with websockets.connect(
            self.url,
            ping_interval=20,
            ping_timeout=10,
        ) as ws:

            message = {
                "op": "subscribe",
                "args": [topic],
            }

            await ws.send(
                json.dumps(message)
            )

            async for response in ws:
                message = json.loads(response)
                print(f"[{topic}] {message}")
                yield message

    async def subscribe_trades(
        self,
        symbol: str = "BTCUSDT",
    ):

        topic = f"publicTrade.{symbol}"

        async for message in self._subscribe(topic):
            yield message

    async def subscribe_orderbook(
        self,
        symbol: str = "BTCUSDT",
        depth: int = 50,
    ):

        topic = f"orderbook.{depth}.{symbol}"

        async for message in self._subscribe(topic):
            yield message

    async def subscribe_liquidations(
        self,
        symbol: str = "BTCUSDT",
    ):

        topic = f"allLiquidation.{symbol}"

        async for message in self._subscribe(topic):
            yield message