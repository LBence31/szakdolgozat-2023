/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "~/hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "~/atoms/playlistAtom";
import reloadSession from "~/lib/reloadSession";
import { api } from "~/utils/api";

export default function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [playlistId, setPlaylistId] = useRecoilState<any>(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
          playlists.forEach((playlist) => {
            addPlaylists.mutate({
              userId: session!.user.id,
              playlistId: playlist.id,
            });
          });
        })
        .catch((error) => {
          if (error.body.error.status == 401) {
            reloadSession();
          }
        });
    }
  }, [session, spotifyApi]);

  const addPlaylists = api.playlist.addPlaylist.useMutation();

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-gray-900 p-5 pb-36 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <div className="flex items-center">
          <p className="font-bold text-white">Your Playlists</p>
        </div>

        {playlists.map((playlist) => {
          return (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white"
            >
              {playlist.name}
            </p>
          );
        })}

        <hr className="border-t-[0.1px] border-gray-900" />
        <div className="flex items-center pb-28">
          <p className="font-bold text-white">Your Followed Playlists</p>
        </div>
      </div>
    </div>
  );
}