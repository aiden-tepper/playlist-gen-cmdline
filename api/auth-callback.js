import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { Buffer } from "buffer";

export default async function (req, res) {
  const code = req.query.code || null;
  const params = new URLSearchParams({
    code: code,
    redirect_uri: "/api/auth-callback",
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
    res.redirect(`/#access_token=${data.access_token}`);
  } catch (error) {
    console.error("Error fetching access token", error);
    res.status(500).send("Internal Server Error");
  }
}
