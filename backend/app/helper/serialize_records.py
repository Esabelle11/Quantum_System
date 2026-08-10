from datetime import datetime
from typing import Any

def serialize_record(record: dict[str, Any]) -> dict[str, Any]:
    row = record.copy()

    for key, value in row.items():
        if isinstance(value, datetime):
            row[key] = value.isoformat()

    return row

def serialize_records(records):
    result = []
    seen = set()

    for record in records:
        row = record.copy()

        for key, value in row.items():
            if isinstance(value, datetime):
                row[key] = value.isoformat()

        key = (
            row.get("symbol"),
            row.get("timestamp"),
        )

        if key in seen:
            continue

        seen.add(key)
        result.append(row)

    return result