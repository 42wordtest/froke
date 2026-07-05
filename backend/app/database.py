from motor.motor_asyncio import AsyncIOMotorClient

from .config import settings


client = AsyncIOMotorClient(settings.mongo_url)
database = client[settings.database_name]


def get_database():
    return database


async def close_database_connection():
    client.close()
