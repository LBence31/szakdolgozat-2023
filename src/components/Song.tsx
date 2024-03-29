/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import { useRecoilState, useRecoilValue } from "recoil";
import { infoBoxUpState } from "~/atoms/infoBoxAtom";
import { playlistIdState } from "~/atoms/playlistAtom";
import { premiumUserState } from "~/atoms/premiumAtom";
import { currentTrackIdState, isPlayingState } from "~/atoms/songAtom";
import useSpotify from "~/hooks/useSpotify";
import { milisTiMinutesAndSecods } from "~/lib/time";

interface Props {
  order: number;
  track: any;
}

export default function Song({ order, track }: Props) {
  const spotifyApi = useSpotify();
  const playlistID = useRecoilValue(playlistIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState<any>(isPlayingState);
  const [isPremium, setIsPremium] = useRecoilState(premiumUserState);
  const [infoBoxVisible, setInfoBoxVisible] = useRecoilState(infoBoxUpState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    const context_uri = "spotify:playlist:" + playlistID;
    void spotifyApi
      .play({
        context_uri: context_uri,
        offset: {
          position: order,
        },
      })
      .then(() => {
        setIsPremium(true);
        setInfoBoxVisible(false);
      })
      .catch((error) => {
        if (error.body.error.reason == "PREMIUM_REQUIRED") {
          setIsPremium(false);
          setInfoBoxVisible(true);
        } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
          setIsPremium(true);
          setInfoBoxVisible(true);
        } else {
          console.log(error.body.error.reason);
        }
      });
  };

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg px-5 py-4 text-gray-500 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0]?.url}
          alt="track logo"
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{track.track.album.name}</p>
        <p>{milisTiMinutesAndSecods(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}
