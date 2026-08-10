from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    bybit_api_key: str = ""
    bybit_api_secret: str = ""

    bybit_testnet: bool = False

    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_role_key: str = ""

    symbol: str = "BTCUSDT"
    category: str = "linear"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()