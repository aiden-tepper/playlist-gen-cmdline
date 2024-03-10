import "./styles.css";
import { useEffect, useState } from "react";
import { Button, Link, Image, Divider, CircularProgress } from "@nextui-org/react";

function App() {
  const [token, setToken] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [recents, setRecents] = useState(null);

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
    setRecents(null);
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

  useEffect(() => {
    if (token) {
      getRecentlyPlayed().then((data) => {
        const entries: string[] = [];
        data.items.forEach((item: any, idx: number) => {
          const track = item.track;
          const artistNames = track.artists.map((artist) => artist.name).join(", ");
          const entry = `${track.name} by ${artistNames}`;
          entries.push(entry);
        });
        setRecents(entries);
      });
    }
  }, [token]);

  return (
    <>
      {!token ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
              gap: "2rem", // Add vertical space between elements
            }}
          >
            <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "3rem" }}>
              Spotify Visuals Generator!
            </h1>
            <div className="flex h-5 items-center space-x-4 text-small">
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "2rem",
                  marginBottom: "2rem",
                  marginTop: "1rem",
                  lineHeight: "2rem",
                }}
              >
                <i>Generate cool visualizations based on your recent listening history</i>
              </h2>
              <Divider orientation="vertical" style={{ height: "8vh" }} />
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "2rem",
                  marginBottom: "2rem",
                  marginTop: "1rem",
                  lineHeight: "2rem",
                }}
              >
                <i>Log in with your Spotify account and let me handle the rest!</i>
              </h2>
            </div>
            <p style={{ textAlign: "justify", fontSize: "1rem", marginBottom: "1rem", marginTop: "1rem" }}>
              Abstract images are created from your recently played songs on a rolling basis. Variations are
              generated on each image, then frame interpolation is used to create a smooth transition between
              each variation. This visualization is looped for a period of time, then your recently played
              music is reassessed and we seamlessly transition to the next visualization. The result is a
              neverending, captivating visual experience that reflects the energy and essence of your music
              choices, acting as a stunning computer screensaver, background visuals casted to your TV, or the
              backdrop for any scenario you can think of that could use a vibe boost!
            </p>
            <Button href={loginUrl} as={Link} color="primary" showAnchorIcon variant="solid">
              Log in with Spotify
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col h-full">
            <header className="flex justify-between items-center p-4">
              <Button
                onClick={logout}
                color="warning"
                variant="solid"
                className="py-2 px-4 font-bold rounded"
              >
                Log out
              </Button>
              <Button
                onClick={imageGen}
                color="primary"
                variant="solid"
                className="py-2 px-4 font-bold rounded"
              >
                Refresh
              </Button>
            </header>

            <main className="flex-grow">
              <div className="flex divide-x divide-gray-300 h-full">
                <div className="w-1/3 flex flex-col">
                  <h2 className="text-lg font-semibold text-center mt-4">Recently played songs</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <ol className="text-left">
                      {recents ? (
                        recents.map((item: string) => <li>{item}</li>)
                      ) : (
                        <CircularProgress aria-label="Loading..." />
                      )}
                    </ol>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col">
                  <h2 className="text-lg font-semibold text-center mt-4">Generated descriptors</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <p>descriptors</p>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col">
                  <h2 className="text-lg font-semibold text-center mt-4">Generated image</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <Image src={imageUrl} alt="Generated" className="max-w-full h-auto" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
      <footer
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, textAlign: "center", fontSize: "1.5rem" }}
      >
        made by aiden tepper
      </footer>
    </>
  );
}

export default App;
