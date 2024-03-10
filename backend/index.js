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
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${
      process.env.SPOTIFY_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_URI
    )}&scope=${encodeURIComponent(scope)}&show_dialog=true`
  );
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: new URLSearchParams({
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", authOptions);
    const data = await response.json();
    if (response.ok) {
      // Redirecting to the frontend with the access token
      res.redirect(`${process.env.FRONTEND_URI}/#${data.access_token}`);
    } else {
      throw new Error(`Failed to fetch token: ${data.error}`);
    }
  } catch (error) {
    console.error("Error fetching access token", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
