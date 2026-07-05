from datetime import date, datetime
from typing import Any

from bson import ObjectId


def serialize_document(document: dict[str, Any]) -> dict[str, Any]:
    output = dict(document)
    if "_id" in output and isinstance(output["_id"], ObjectId):
        output["_id"] = str(output["_id"])

    for key, value in list(output.items()):
        if isinstance(value, (datetime, date)):
            output[key] = value.isoformat()

    return output
