"use client";
import { PlaylistDetails } from "../page";

export default function PlaylistDetailsSection(playlist: PlaylistDetails | undefined) {
  
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Album</th>
            <th>Added By</th>
          </tr>
        </thead>
        <tbody>
          {playlist?.items.map((item, index) => (
            <tr key={index}>
              <td>
                <a href={item.track.href}>{item.track.name}</a>
              </td>
              <td>
                <a href={item.track.album.href}>{item.track.album.name}</a>
              </td>
              <td>{item.added_by.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
