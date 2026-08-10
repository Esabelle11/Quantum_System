from app.exchange.bybit_rest import BybitREST


class BybitClient:
    def __init__(self):
        self.rest = BybitREST()

    async def get_btc_price(self):
        data = await self.rest.get_ticker("BTCUSDT")

        result = data["result"]["list"]

        if not result:
            return None

        return float(result[0]["lastPrice"])