/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "~/atoms/playlistAtom";
import { api } from "~/utils/api";

export default function FollowedPlaylists() {
  const { data: session } = useSession();
  const followedPlaylists =
    api.userOnPlaylist.getUserFollowedPlaylistDetails.useQuery({
      userId: session!.user.id,
    });
  const [playlistId, setPlaylistId] = useRecoilState<any>(playlistIdState);

  if (followedPlaylists.isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="flex flex-col space-y-4">
        {followedPlaylists.data.map((playlist) => {
          return (
            <p
              key={playlist.playlist.id}
              onClick={() => setPlaylistId(playlist.playlist.id)}
              className="cursor-pointer hover:text-white"
            >
              {playlist.playlist.name}
            </p>
          );
        })}
      </div>
    );
  }
}
