/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { playlistIdState } from "~/atoms/playlistAtom";
import { api } from "~/utils/api";

export default function FollowButton() {
  const session = useSession();
  const [content, setContent] = useState("Follow");
  const [clicked, setClicked] = useState(false);
  const playlistId = useRecoilValue<string>(playlistIdState);

  const getUserPlaylists = api.playlist.getUserPlaylists.useQuery({
    userId: session.data!.user.id,
  });
  const addRelationship = api.userOnPlaylist.followPlaylist.useMutation({
    onSuccess() {
      void utils.userOnPlaylist.invalidate();
    },
  });
  const removeRelationship = api.userOnPlaylist.unFollowPlaylist.useMutation({
    onSuccess() {
      void utils.userOnPlaylist.invalidate();
    },
  });
  const getFollowPlaylistID = api.userOnPlaylist.findPlaylist.useQuery({
    userId: session.data!.user.id,
    playlistId: playlistId,
  });

  useEffect(() => {
    if (getFollowPlaylistID.isSuccess) {
      if (getFollowPlaylistID.data?.length != 0) {
        setContent("Followed");
      } else {
        setContent("Follow");
      }
    }
  }, [getFollowPlaylistID.data]);

  const utils = api.useContext();

  if (getFollowPlaylistID.isLoading) {
    return <img src="/loading-gif.gif" className="h-8 w-8" alt="loading" />;
  }

  if (getUserPlaylists.isLoading) {
    return <img src="/loading-gif.gif" className="h-8 w-8" alt="loading" />;
  }

  const handleMouseEnter = () => {
    if (content == "Followed") {
      setContent("Unfollow");
    }
  };

  const handleMouseLeave = () => {
    if (content == "Unfollow") {
      setContent("Followed");
    }
    setClicked(false);
  };

  const handleClick = () => {
    if (content == "Follow" && !clicked) {
      setContent("Followed");
      addRelationship.mutate({
        playlistId: playlistId,
        userId: session.data!.user.id,
      });
      setClicked(true);
    } else if (content == "Unfollow" && !clicked) {
      setContent("Follow");
      removeRelationship.mutate({
        playlistId: playlistId,
        userId: session.data!.user.id,
      });
      setClicked(true);
    }
  };

  if (
    getUserPlaylists.data
      ?.map((data) => {
        return data.id;
      })
      .includes(playlistId)
  ) {
    return <div></div>;
  } else {
    return (
      <div
        className="flex w-32 cursor-pointer select-none items-center justify-center space-x-1 rounded-md bg-slate-800 px-1.5 py-1 text-gray-500 hover:font-bold hover:text-white"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        onClick={() => handleClick()}
      >
        {content == "Follow" ? (
          <PlusIcon className="h-5 w-5" />
        ) : content == "Followed" ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <XMarkIcon className="h-5 w-5" />
        )}

        <span>{content}</span>
      </div>
    );
  }
}
