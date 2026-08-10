from app.exchange.bybit_client import BybitClient


def test_bybit_client_can_initialize():

    client = BybitClient()

    assert client is not None