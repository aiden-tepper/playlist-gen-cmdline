export interface Artist {
  name: string;
  // Include other properties of the artist you need, e.g., id, href, etc.
}

export interface Track {
  name: string;
  artists: Artist[];
  // Include other properties of the track you need, e.g., album, duration_ms, etc.
}

export interface Item {
  track: Track;
  // Include other properties of the item you need, e.g., played_at, context, etc.
}

export interface RecentlyPlayedResponse {
  items: Item[];
  // Include other top-level properties of the response you need, e.g., next, previous, etc.
}
