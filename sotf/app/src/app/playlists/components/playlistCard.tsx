import { SpotifyPlaylistItem } from "@/app/models/spotifyplaylistresponse";
import Image from "next/image";

export default function PlaylistCard(item: SpotifyPlaylistItem, onPlaylistClick: (id: string) => void) {
    return (
        <div
            key={item?.id}
            onClick={() => onPlaylistClick(item.id)}
            className={`flex items-center justify-between w-96 h-24 rounded-xl p-4 mt-4 ${item?.isExisting ? "bg-[#1DB954]" : "bg-white"}`}
        >
            {item?.images && (
                <Image
                    src={item?.images[0]?.url}
                    alt="Playlist Image"
                    width={100}
                    height={100}
                    className="w-16 h-16 rounded-lg"
                />
            )}
            <div className="flex flex-col ml-4">
                <p className="text-black">{item?.name}</p>
            </div>
        </div>
    )
}