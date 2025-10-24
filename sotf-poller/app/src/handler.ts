import { getUsersPlaylists, getTrackedPlaylists, updatePlaylistTracks } from './dynamo';
import { fetchPlaylistTracks } from './spotify';
import { compareTracks } from './compare';

export const handler = async (): Promise<void> => {
    const usersPlaylistIds = await getUsersPlaylists();
    for (const user of usersPlaylistIds) {
        try {
            const playlists = await getTrackedPlaylists(user);

            for (const playlist of playlists) {
                try {
                    const latestTracks = await fetchPlaylistTracks(playlist.id, user.spotifyAccessToken);
                    const { newTracks, deletedTracks } = await compareTracks(playlist.id, latestTracks);
                    await updatePlaylistTracks(playlist.id, newTracks, deletedTracks);
                } catch (err) {
                    console.error(`Error processing playlist ${playlist.id} for user ${user.userId}:`, err);
                }
            }
        } catch (err) {
            console.error(`Error fetching playlists for user ${user.userId}:`, err);
        }
    }

};
