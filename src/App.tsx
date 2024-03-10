import "./styles.css";
import { useEffect, useState } from "react";
import { Button, Link, Image } from "@nextui-org/react";

function App() {
  const [token, setToken] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const getRecentlyPlayed = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  };

  const tracks = async () => {
    const history = await getRecentlyPlayed();

    const entries: string[] = [];
    history.items.forEach((item: any, idx: number) => {
      const track = item.track;
      const artistNames = track.artists.map((artist) => artist.name).join(", ");
      const entry = `${track.name} by ${artistNames}`;
      entries.push(entry);
    });

    const prompt = `Generate 6 adjectives that describe the color, physical texture, taste, smell, vibe, and style of the sum of the following songs: "${entries.join(
      '", "'
    )}." Return only the six adjectives in this form: ["color", "physical texture", "taste", "smell", "vibe", "style"]`;

    console.log("text prompt: " + prompt);
    return prompt;
  };

  const descriptorGen = async () => {
    const prompt = await tracks();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.json();

    const resultString = result[0].generated_text;
    const jsonString = resultString.match(/\[(.*?)\]/g)[1];

    try {
      const adjectivesArray = JSON.parse(jsonString);
      console.log("descriptors: " + adjectivesArray);
      return adjectivesArray;
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  const imageGen = async () => {
    const descriptors = await descriptorGen();
    const prompt =
      "Generate an image of an abstract scene that embodies the following adjectives: " +
      descriptors.join(", ") +
      ".";
    console.log("image prompt: " + prompt);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const blob = await response.blob();
    console.log(blob);

    const imageUrl = URL.createObjectURL(blob);
    setImageUrl(imageUrl);

    return imageUrl;
  };

  return (
    <>
      <h1>my app</h1>
      {!token ? (
        <Button href={loginUrl} as={Link} color="primary" showAnchorIcon variant="solid">
          Log in with Spotify
        </Button>
      ) : (
        <>
          <Button onClick={logout} color="warning" variant="solid">
            Log out
          </Button>
          <Button onClick={imageGen} color="primary" variant="solid">
            Get Recently Played
          </Button>
          <Image src={imageUrl} alt="Generated" style={{ maxWidth: "100%", height: "auto" }} />
        </>
      )}
    </>
  );
}

export default App;
