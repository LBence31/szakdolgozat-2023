/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import useSpotify from "~/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "~/atoms/playlistAtom";
import { api } from "~/utils/api";
import { shuffle } from "lodash";

export default function Recommend() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [recommendedPlaylistsUS, setRecommendedPlaylistsUS] = useState<any[]>(
    []
  );
  const [recommendedPlaylistsHU, setRecommendedPlaylistsHU] = useState<any[]>(
    []
  );
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);

  const addPlaylists = api.playlist.addPlaylist.useMutation();
  const getSpotifyUser = api.user.getSpotifyUserID.useQuery();
  const getOtherUsersPlaylist = api.playlist.getOtherUsersPlaylists.useQuery({
    userId: session!.user.id,
  });

  const [playlistId, setPlaylistId] = useRecoilState<any>(playlistIdState);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getFeaturedPlaylists({ limit: 20, country: "US" })
        .then((data) => {
          setRecommendedPlaylistsUS(data.body.playlists.items);
          const playlistIds: string[] = [];
          const playlistNames: string[] = [];

          recommendedPlaylistsUS.forEach((playlist) => {
            if (playlist != null && getSpotifyUser.data != undefined) {
              playlistIds.push(playlist.id);
              playlistNames.push(playlist.name);
            }
          });
          if (playlistIds.length != 0 && playlistNames.length != 0) {
            addPlaylists.mutate({
              userId: getSpotifyUser.data!.id,
              playlistIds: playlistIds,
              playlistNames: playlistNames,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      spotifyApi
        .getFeaturedPlaylists({ limit: 20, country: "HU" })
        .then((data) => {
          setRecommendedPlaylistsHU(data.body.playlists.items);
          const playlistIds: string[] = [];
          const playlistNames: string[] = [];

          recommendedPlaylistsUS.forEach((playlist) => {
            if (playlist != null && getSpotifyUser.data != undefined) {
              playlistIds.push(playlist.id);
              playlistNames.push(playlist.name);
            }
          });
          if (playlistIds.length != 0 && playlistNames.length != 0) {
            addPlaylists.mutate({
              userId: getSpotifyUser.data!.id,
              playlistIds: playlistIds,
              playlistNames: playlistNames,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [session, spotifyApi, getSpotifyUser.data]);

  useEffect(() => {
    if (getOtherUsersPlaylist.data != undefined) {
      const tempArr: any[] = [];
      getOtherUsersPlaylist.data.map((data) => {
        tempArr.push(data);
      });
      const shuffledArray = shuffle(tempArr);
      setUserPlaylists(shuffledArray.slice(0, 6));
    }
  }, [getOtherUsersPlaylist.data]);

  return (
    <div className="hidden h-screen overflow-y-scroll border-l border-gray-900 p-5 pb-36 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex md:flex-col lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <div className="flex items-center">
          <p className="font-bold text-white">Featured Playlists</p>
        </div>
        {recommendedPlaylistsUS.map((playlist) => {
          if (playlist != null) {
            return (
              <p
                key={playlist.id}
                onClick={() => setPlaylistId(playlist.id)}
                className="cursor-pointer hover:text-white"
              >
                {playlist.name}
              </p>
            );
          }
        })}

        {recommendedPlaylistsHU.map((playlist) => {
          if (playlist != null) {
            return (
              <p
                key={playlist.id}
                onClick={() => setPlaylistId(playlist.id)}
                className="cursor-pointer hover:text-white"
              >
                {playlist.name}
              </p>
            );
          }
        })}

        {userPlaylists.map((playlist) => {
          if (playlist != null) {
            return (
              <p
                key={playlist.id}
                onClick={() => setPlaylistId(playlist.id)}
                className="cursor-pointer hover:text-white"
              >
                {playlist.name}
              </p>
            );
          }
        })}
      </div>
    </div>
  );
}
