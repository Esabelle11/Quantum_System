import asyncio
import logging

from app.collectors.funding_collector import FundingCollector
from app.collectors.kline_collector import KlineCollector
from app.collectors.oi_collector import OICollector


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)

SYMBOL = "BTCUSDT"


async def main():
    logger.info( "Starting historical data collection..." )

    kline_collector = KlineCollector()
    funding_collector = FundingCollector()
    oi_collector = OICollector()

    # # -----------------------------
    # # Klines
    # # -----------------------------

    # logger.info("Collecting klines for %s...", SYMBOL)

    # try:
    #     klines = await kline_collector.collect_store(symbol=SYMBOL, end=1652203980000)
    #     logger.info("Collected %d kline records",klines)

    # except Exception:
    #     logger.exception("Kline collection failed")

    # # -----------------------------
    # # Funding
    # # -----------------------------
    # logger.info( "Collecting funding history...")

    # try:
    #     funding = await funding_collector.collect_store(symbol=SYMBOL, end=1599148800000)
    #     logger.info("Collected %d funding records",funding)

    # except Exception:
    #     logger.exception("Funding collection failed")

    # -----------------------------
    # Open Interest
    # -----------------------------
    logger.info("Collecting open interest...")

    try:
        oi = await oi_collector.collect_store(symbol=SYMBOL, end=1626283200000)
        logger.info("Collected %d OI records", oi)

    except Exception:
        logger.exception("OI collection failed")

    logger.info("Historical collection finished.")


if __name__ == "__main__":
    asyncio.run(main())