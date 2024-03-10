import { Buffer } from "buffer";
import { URLSearchParams } from "url";

const generateRandomString = (length) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default function (req, res) {
  const scope = "user-read-recently-played";
  const state = generateRandomString(16);
  const authQueryParameters = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: "http://localhost:3000/api/auth-callback",
    state: state,
  });

  res.redirect("https://accounts.spotify.com/authorize/?" + authQueryParameters.toString());
}
