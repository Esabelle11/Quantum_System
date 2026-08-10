from supabase import Client, create_client

from app.config.settings import settings


def get_supabase_client() -> Client:
    if not settings.supabase_url:
        raise ValueError("SUPABASE_URL is not configured")

    if not settings.supabase_service_role_key:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY is not configured")

    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )


supabase = get_supabase_client()