"use client";
import { useSession } from "next-auth/react";
import { SpotifyPlaylistResponse } from "../models/spotifyplaylistresponse";
import { useEffect, useState, useRef } from "react";
import PlaylistCard from "./components/playlistCard";
import PlaylistDetails from "./components/playlistDetails";
import PlaylistDetailsSection from "./components/playlistDetails";

interface ErrorResponse {
  status: number;
  message: string;
}
export interface PlaylistDetails {
  items: Array<{
    track: {
      album: {
        href: string;
        name: string;
      };
      href: string; 
      name: string;
    };
    added_by: {
      id: string; 
    };
  }>;
}

export default function Playlists() {
  const { data: session } = useSession();
  const [playlistArray, setPlaylistArray] = useState<SpotifyPlaylistResponse>();
  const [playlistId, setPlaylistId] = useState<string>();
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails>();
  const [error, setError] = useState<ErrorResponse>();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    if (!session || playlistArray || error) {
      return;
    }

    fetch("/api/spotify/playlists")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        console.log(data);
        setPlaylistArray(data);
      });
  }, [session]);

  useEffect(() => { 
    if (!playlistId) {
      return;
    }
    fetch(`/api/spotify/playlist?id=${playlistId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setPlaylistDetails(data);
      });
  }, [playlistId]);

  if (session?.error) {
    return <div>{session.error}</div>;
  }

  const onPlaylistClick = async (item: string) => {
    try {
      const existing = playlistArray?.items.find((p) => p?.isExisting);
      if (existing && existing.id !== item) {
        const delRes = await fetch('/api/spotify/playlists', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playlistId: existing.id }),
        });

        if (!delRes.ok) {
          throw new Error('Delete request failed');
        }
      }

      const response = await fetch('/api/spotify/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId: item }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // todo have the post return so don’t need to double call from front end
      fetch('/api/spotify/playlists')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setPlaylistArray(data);
        });
    } catch (error) {
      console.error('Error calling API:', error);
    }
    setPlaylistId(item);
  };

  return (
    <div className="p-6">
      {error && <div>{error.message}</div>}
      {playlistArray?.items && (
        <div>
          <p className="text-white font-normal text-xl mt-5 mb-2">Your Playlists</p>
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
              &lt;
            </button>
            <div
              ref={carouselRef}
              className="flex overflow-x-auto no-scrollbar space-x-4 py-2 px-8"
            >
              {playlistArray?.items
                .filter((item) => item !== null)
                .map((item) => PlaylistCard(item, onPlaylistClick))}
            </div>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded-full"
            >
              &gt;
            </button>
          </div>
          <div className="mt-6">
            {playlistDetails && PlaylistDetailsSection(playlistDetails)}
          </div>
        </div>
      )}
    </div>
  );
}
