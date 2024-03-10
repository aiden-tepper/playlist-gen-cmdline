import "./styles.css";
import { useEffect, useState } from "react";
import { Button, Link } from "@nextui-org/react";

function App() {
  //   import dotenv from "dotenv";
  // import express, { Request, Response } from "express";
  // import fetch, { Response as FetchResponse } from "node-fetch";
  // import { URLSearchParams } from "url";

  // dotenv.config();

  // const client_id: string = process.env.SPOTIFY_CLIENT_ID || "";
  // const client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || "";
  // const redirect_uri: string = "http://localhost:3000/callback";
  // const port: number = 3000;

  // const app = express();

  // app.get("/login", (req: Request, res: Response) => {
  //   const state: string = generateRandomString(16);
  //   const scope: string = "user-read-recently-played";

  //   res.redirect(
  //     "https://accounts.spotify.com/authorize?" +
  //       new URLSearchParams({
  //         response_type: "code",
  //         client_id: client_id,
  //         scope: scope,
  //         redirect_uri: redirect_uri,
  //         state: state,
  //       }).toString()
  //   );
  // });

  // app.get("/callback", async (req: Request, res: Response) => {
  //   const code: string | null = req.query.code || null;
  //   const state: string | null = req.query.state || null;

  //   if (state === null) {
  //     res.redirect(
  //       "/#" +
  //         new URLSearchParams({
  //           error: "state_mismatch",
  //         }).toString()
  //     );
  //   } else {
  //     const params = new URLSearchParams({
  //       code: code || "",
  //       redirect_uri: redirect_uri,
  //       grant_type: "authorization_code",
  //     });

  //     const headers = {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Authorization: "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
  //     };

  //     try {
  //       const tokenResponse: FetchResponse = await fetch("https://accounts.spotify.com/api/token", {
  //         method: "POST",
  //         headers: headers,
  //         body: params,
  //       });
  //       const tokenData = await tokenResponse.json();

  //       if (tokenResponse.ok) {
  //         // Use the access token to access the Spotify Web API
  //         const spotifyResponse: FetchResponse = await fetch(
  //           "https://api.spotify.com/v1/me/player/recently-played",
  //           {
  //             headers: { Authorization: `Bearer ${(tokenData as any).access_token}` },
  //           }
  //         );
  //         const playlistsData: { items: any[] } = (await spotifyResponse.json()) as { items: any[] };

  //         // Assuming you want to output the playlist names in a simple text list
  //         let playlistsText: string = playlistsData.items.map((track: any) => track.json).join("\n");
  //         res.send(`<pre>${playlistsText}</pre>`);
  //       } else {
  //         // Handle errors, e.g., invalid token
  //         res.redirect(
  //           "/#" +
  //             new URLSearchParams({
  //               error: "invalid_token",
  //             }).toString()
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error during API request:", error);
  //       res.redirect(
  //         "/#" +
  //           new URLSearchParams({
  //             error: "internal_server_error",
  //           }).toString()
  //       );
  //     }
  //   }
  // });

  // app.listen(port, () => {
  //   console.log(`Example app listening at http://localhost:${port}`);
  // });

  // const generateRandomString = (length: number): string => {
  //   let text: string = "";
  //   const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //   for (let i = 0; i < length; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }
  //   return text;
  // };
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = (
        hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token")) || ""
      ).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token || ""); // Provide a default value of an empty string if token is null
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const authEndpoint = "https://accounts.spotify.com/authorize";
  const redirectUri = "http://localhost:3000";
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  // const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const scopes = ["user-read-recently-played"];

  const loginUrl = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token&show_dialog=true`;

  return (
    <>
      <h1>my app</h1>
      {!token ? (
        <Button href={loginUrl} as={Link} color="primary" showAnchorIcon variant="solid">
          Log in with Spotify
        </Button>
      ) : (
        <Button onClick={logout} color="warning" variant="solid">
          Log out
        </Button>
      )}
    </>
  );
}

export default App;
