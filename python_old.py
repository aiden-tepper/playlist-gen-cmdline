import aiohttp
import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')

async def get_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=data) as response:
            res_json = await response.json()
            return res_json.get('access_token')

async def query_api_test(access_token):
    url = "https://api.spotify.com/v1/me/playlists"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            res_json = await response.json()
            print(res_json)
        
async def query_api(access_token):
    url = "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            res_json = await response.json()
            print(res_json)

async def main():
    access_token = await get_access_token()
    print(access_token)
    await query_api(access_token)

# Run the main coroutine
asyncio.run(main())
