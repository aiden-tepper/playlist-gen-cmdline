import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
    const url = "https://accounts.spotify.com/api/token";
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const params = new URLSearchParams({
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    });

    const response = await fetch(url, { method: 'POST', headers: headers, body: params });
    const resJson = await response.json();
    return resJson.access_token;
}

async function queryApi(access_token) {
    const url = "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb";
    const headers = {
        "Authorization": `Bearer ${access_token}`
    };

    const response = await fetch(url, { method: 'GET', headers: headers });
    const resJson = await response.json();
    console.log(resJson);
}

async function main() {
    const access_token = await getAccessToken();
    console.log(access_token);
    await queryApi(access_token);
}

main();
