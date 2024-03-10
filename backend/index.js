import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Buffer } from "buffer";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001; // Backend runs on a different port

app.get("/auth/login", (req, res) => {
  const scope = "user-read-recently-played";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI,
    state: state,
  });

  res.redirect("https://accounts.spotify.com/authorize/?" + auth_query_parameters.toString());
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code || null;

  const params = new URLSearchParams({
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Redirecting to the frontend with the access token
    res.redirect(`${process.env.FRONTEND_URI}/#access_token=${data.access_token}`);
  } catch (error) {
    console.error("Error fetching access token", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/recently-played", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: { Authorization: token },
    });
    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch recently played tracks:", error);
    res.status(500).json({ error: "Failed to fetch recently played tracks" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

var generateRandomString = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
