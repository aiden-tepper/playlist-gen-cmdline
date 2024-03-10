export default async function (req, res) {
  const token = window.localStorage.getItem("token");
  if (!token) {
    console.log("No Spotify token found in getRecents()");
    return;
  }

  try {
    const response = await fetch("/api/recently-played", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch recently played: ${response.statusText}`);
    }
    const responseJson: RecentlyPlayedResponse = await response.json();

    const entries = responseJson.items.map((item) => {
      const track = item.track;
      const artistNames = track.artists.map((artist) => artist.name).join(", ");
      return `${track.name} by ${artistNames}`;
    });

    return entries;
  } catch (e) {
    console.error("Error in getRecents:", e);
    return null;
  }
}
