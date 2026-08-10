import pytest

from app.exchange.bybit_rest import BybitREST


class MockResponse:

    def __init__(self, data):
        self._data = data

    def raise_for_status(self):
        pass

    def json(self):
        return self._data


@pytest.mark.asyncio
async def test_get_ticker(monkeypatch):

    expected = {
        "retCode": 0,
        "result": {
            "list": [
                {
                    "symbol": "BTCUSDT",
                    "lastPrice": "100000",
                }
            ]
        },
    }

    async def mock_get(
        self,
        url,
        params=None,
    ):
        return MockResponse(expected)

    import httpx

    monkeypatch.setattr(
        httpx.AsyncClient,
        "get",
        mock_get,
    )

    client = BybitREST()

    response = await client.get_ticker(
        symbol="BTCUSDT"
    )

    assert response["retCode"] == 0

    assert (
        response["result"]["list"][0]["symbol"]
        == "BTCUSDT"
    )


@pytest.mark.asyncio
async def test_get_funding_history(
    monkeypatch,
):

    expected = {
        "retCode": 0,
        "result": {
            "list": [
                {
                    "fundingRateTimestamp": "1750000000000",
                    "fundingRate": "0.0001",
                }
            ]
        },
    }

    async def mock_get(
        self,
        url,
        params=None,
    ):
        return MockResponse(expected)

    import httpx

    monkeypatch.setattr(
        httpx.AsyncClient,
        "get",
        mock_get,
    )

    client = BybitREST()

    response = (
        await client.get_funding_history(
            symbol="BTCUSDT"
        )
    )

    assert response["retCode"] == 0

    funding = (
        response["result"]["list"][0]
    )

    assert float(
        funding["fundingRate"]
    ) == 0.0001