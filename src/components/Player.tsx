/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isPlayingState } from "~/atoms/songAtom";
import { currentTrackIdState } from "~/atoms/songAtom";
import useSongInfo from "~/hooks/useSongInfo";
import useSpotify from "~/hooks/useSpotify";
import { premiumUserState } from "~/atoms/premiumAtom";

import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { SpeakerXMarkIcon, PlayIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState<number>(50);
  const [isPremium, setIsPremium] = useRecoilState(premiumUserState);

  const songInfo: any = useSongInfo();

  const fetchCurrentSong = () => {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            setIsPlaying(data.body?.is_playing);
          })
          .catch((error) => {
            if (error.body.error.reason == "PREMIUM_REQUIRED") {
              setIsPremium(false);
            } else {
              console.log(error.body.error.reason);
            }
          });
      })
      .catch((error) => {
        if (error.body.error.reason == "PREMIUM_REQUIRED") {
          setIsPremium(false);
        } else {
          console.log(error.body.error.reason);
        }
      });
  };

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body != null && data.body.is_playing) {
          void spotifyApi.pause().catch((error) => {
            if (error.body.error.reason == "PREMIUM_REQUIRED") {
              setIsPremium(false);
            } else {
              console.log(error.body.error.reason);
            }
          });
          setIsPlaying(false);
        } else {
          void spotifyApi.play().catch((error) => {
            if (error.body.error.reason == "PREMIUM_REQUIRED") {
              setIsPremium(false);
            } else {
              console.log(error.body.error.reason);
            }
          });
          setIsPlaying(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume: number) => {
      void spotifyApi.setVolume(volume).catch((error) => {
        if (error.body.error.reason == "PREMIUM_REQUIRED") {
          setIsPremium(false);
        } else {
          console.log(error.body.error.reason);
        }
      });
    }, 300),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt="Song image"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <BackwardIcon
          onClick={() => {
            void spotifyApi.skipToPrevious().catch((error) => {
              console.log(error.body.error.reason == "NO_ACTIVE_DEVICE");
            });
            fetchCurrentSong();
          }}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button h-10 w-10" />
        )}
        <ForwardIcon
          onClick={() => {
            void spotifyApi.skipToNext().catch((error) => {
              console.log(error.body.error.reason == "NO_ACTIVE_DEVICE");
            });
            fetchCurrentSong();
          }}
          className="button"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 md:space-x-4">
        <SpeakerXMarkIcon
          onClick={() => {
            volume > 0 && setVolume(volume - 10);
          }}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
          type="range"
          value={volume}
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          onClick={() => {
            volume < 100 && setVolume(volume + 10);
          }}
          className="button"
        />
      </div>
    </div>
  );
}
