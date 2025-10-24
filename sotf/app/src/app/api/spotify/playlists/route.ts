import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface SpotifyPlaylistItem {
  id: string;
  // You can add additional properties from the Spotify playlist object as needed.
  [key: string]: unknown;
}

interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylistItem[];
  // Other properties from the response can be defined here.
  [key: string]: unknown;
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch existing playlists from your API.
    const existingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/user/${token.name}`
    );
    // Assuming the response is an array of playlist IDs.
    const existingPlaylists: string[] = await existingResponse.json();

    // Fetch Spotify playlists.
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/users/${token.sub}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    const allUserPlaylists: SpotifyPlaylistsResponse = await spotifyResponse.json();
    const existingIds = new Set(existingPlaylists);

    // Map over the Spotify playlists and add an "isExisting" flag.
    const modifiedPlaylists: SpotifyPlaylistsResponse = {
      ...allUserPlaylists,
      items: allUserPlaylists.items.map((playlist: SpotifyPlaylistItem) => ({
        ...playlist,
        isExisting: existingIds.has(playlist.id),
      })),
    };
    return NextResponse.json(modifiedPlaylists);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch Spotify user data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Expecting the payload to have a "playlistId" property.
    const { playlistId }: { playlistId: string } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: token.name, // Use the token's "name" as the user ID.
        playlistId,         // The playlist ID from the request payload.
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error calling API:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        message: "Error calling API",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { playlistId }: { playlistId: string } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: token.name,
        playlistId,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error calling API:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        message: "Error calling API",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
