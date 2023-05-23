/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useRecoilValue } from "recoil";
import { playlistState } from "~/atoms/playlistAtom";
import Song from "./Song";

interface PlaylistTrackObject {
  filler: string;
}

interface Track {
  items: PlaylistTrackObject[];
}

interface Playlist {
  tracks: Track;
}

export default function Songs() {
  const playlist = useRecoilValue<Playlist | null>(playlistState);
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks.items.map((track: PlaylistTrackObject, i: any) => {
        return <Song key={i} track={track} order={i} />;
      })}
    </div>
  );
}
