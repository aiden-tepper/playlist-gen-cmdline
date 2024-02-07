import requests
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.environ.get('SPOTIFY_CLIENT_ID')
print(client_id)
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
access_token = os.environ.get('SPOTIFY_ACCESS_TOKEN')

def get_access_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    response = requests.post(url, headers=headers, data=data)
    print(response.json())

get_access_token()