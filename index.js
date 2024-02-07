import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';
const port = 3000;

const app = express();

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }).toString());
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            new URLSearchParams({
                error: 'state_mismatch'
            }).toString());
    } else {
        const params = new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
        };

        try {
            const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: headers,
                body: params
            });
            const tokenData = await tokenResponse.json();

            if (tokenResponse.ok) {
                // Use the access token to access the Spotify Web API
                const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
                    headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
                });
                const playlistsData = await playlistsResponse.json();

                // Assuming you want to output the playlist names in a simple text list
                let playlistsText = playlistsData.items.map(playlist => playlist.name).join('\n');
                res.send(`<pre>${playlistsText}</pre>`);
            } else {
                // Handle errors, e.g., invalid token
                res.redirect('/#' +
                    new URLSearchParams({
                        error: 'invalid_token'
                    }).toString());
            }
        } catch (error) {
            console.error('Error during API request:', error);
            res.redirect('/#' +
                new URLSearchParams({
                    error: 'internal_server_error'
                }).toString());
        }
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


// async function getAccessToken() {
//     const url = "https://accounts.spotify.com/api/token";
//     const headers = {
//         "Content-Type": "application/x-www-form-urlencoded"
//     };
//     const params = new URLSearchParams({
//         "grant_type": "client_credentials",
//         "client_id": client_id,
//         "client_secret": client_secret
//     });

//     const response = await fetch(url, { method: 'POST', headers: headers, body: params });
//     const resJson = await response.json();
//     return resJson.access_token;
// }

// async function queryApi(access_token) {
//     const url = "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb";
//     const headers = {
//         "Authorization": `Bearer ${access_token}`
//     };

//     const response = await fetch(url, { method: 'GET', headers: headers });
//     const resJson = await response.json();
//     console.log(resJson);
// }

// async function main() {
//     const access_token = await getAccessToken();
//     console.log(access_token);
//     await queryApi(access_token);
// }

// main();
