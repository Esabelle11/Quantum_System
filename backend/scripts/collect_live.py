import asyncio
import logging

from app.collectors.liquidation_collector import (
    LiquidationCollector,
)
from app.collectors.trade_collector import (
    TradeCollector,
)
from app.collectors.orderbook_collector import (
    OrderbookCollector,
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


async def collect_liquidations():
    collector = LiquidationCollector()

    logger.info(
        "Starting liquidation stream..."
    )

    async for record in collector.collect():

        logger.info(
            "Liquidation | %s | %s | price=%s | value=%s",
            record["symbol"],
            record["side"],
            record["price"],
            record["value"],
        )


async def collect_trades():
    collector = TradeCollector()

    logger.info(
        "Starting trade stream..."
    )

    async for record in collector.collect():

        logger.info(
            "Trade | %s | %s | price=%s | quantity=%s",
            record["symbol"],
            record["side"],
            record["price"],
            record["quantity"],
        )


async def collect_orderbook():
    collector = OrderbookCollector()

    logger.info(
        "Starting orderbook stream..."
    )

    async for record in collector.collect():

        logger.info(
            "Orderbook update | %s",
            record["symbol"],
        )


async def main():

    logger.info(
        "Starting live market-data collection..."
    )

    await asyncio.gather(
        collect_liquidations(),
        collect_trades(),
        collect_orderbook(),
    )


if __name__ == "__main__":

    try:
        asyncio.run(main())

    except KeyboardInterrupt:

        logger.info(
            "Live collection stopped."
        )