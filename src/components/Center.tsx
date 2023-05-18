/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "~/atoms/playlistAtom";
import useSpotify from "~/hooks/useSpotify";
import Songs from "./Songs";
import reloadSession from "~/lib/reloadSession";
import { api } from "~/utils/api";
import { UserCircleIcon } from "@heroicons/react/20/solid";

const colors: string[] = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

export default function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState<string>("");
  const playlistId = useRecoilValue<string>(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState);
  const getUserPlaylistIDs = api.playlist.getUsePlaylists.useQuery({
    userId: session!.user.id,
  });

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((error) => {
        if (error.body.error.status == 401) {
          reloadSession();
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyApi, playlistId]);

  return (
    <div className="relative h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute right-8 top-5">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={() => void signOut()}
        >
          {session?.user.image ? (
            <img
              className="h-10 w-10 rounded-full"
              src={session?.user.image}
              alt="profile picture"
            />
          ) : (
            <UserCircleIcon className="h-10 w-10 rounded-full" />
          )}

          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0].url}
          alt="Playlist logo"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}
