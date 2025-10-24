"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LogIn() {
  const { data: session } = useSession();
    return (
        <div>
        {session ? (
            <button
            onClick={() =>
                signOut({
                callbackUrl: "/",
                })
            }
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
            Sign Out
            </button>
        ) : (
            <button
            onClick={() =>
                signIn("spotify", {
                callbackUrl: "/playlists",
                redirect: true,
                })
            }
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
            Connect your Spotify
            </button>
        )}
        </div>
    );
  
}
