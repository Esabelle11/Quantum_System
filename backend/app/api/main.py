from fastapi import FastAPI

from app.exchange.bybit_client import BybitClient
from app.collectors.kline_collector import KlineCollector


app = FastAPI(
    title="BTCUSDT Autonomous Quant System",
    version="0.1.0",
)


bybit = BybitClient()
kline_collector = KlineCollector()


@app.get("/")
async def root():

    return {
        "system": "BTCUSDT Autonomous Quant System",
        "status": "running",
    }


@app.get("/api/market/btcusdt")
async def btc_market():

    price = await bybit.get_btc_price()

    return {
        "symbol": "BTCUSDT",
        "price": price,
    }


@app.get("/api/market/btcusdt/klines")
async def btc_klines():

    klines = await kline_collector.collect()

    return {
        "symbol": "BTCUSDT",
        "count": len(klines),
        "data": klines,
    }