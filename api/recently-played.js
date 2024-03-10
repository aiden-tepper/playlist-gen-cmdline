import fetch from "node-fetch";

export default async function (req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: { Authorization: token },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch recently played tracks:", error);
    res.status(500).json({ error: "Failed to fetch recently played tracks" });
  }
}
