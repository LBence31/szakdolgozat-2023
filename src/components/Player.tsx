/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { TbRepeat, TbRepeatOff, TbRepeatOnce } from "react-icons/tb";
import { MdShuffle, MdShuffleOn } from "react-icons/md";

import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import {
  SpeakerXMarkIcon,
  PlayIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { infoBoxUpState } from "~/atoms/infoBoxAtom";

export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState<number>(50);
  const [isPremium, setIsPremium] = useRecoilState(premiumUserState);
  const [infoBoxVisible, setInfoBoxVisible] = useRecoilState(infoBoxUpState);
  const [shuffleState, setShuffleState] = useState<boolean>(false);
  const [repeatState, setRepeatState] = useState<"off" | "track" | "context">(
    "off"
  );

  const songInfo: any = useSongInfo();

  const fetchCurrentSong = () => {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then(() => {
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            if (data.body != null) {
              setCurrentTrackId(data.body.item!.id);
              setIsPlaying(data.body?.is_playing);
              setInfoBoxVisible(false);
              setShuffleState(data.body?.shuffle_state);
              setRepeatState(data.body?.repeat_state);
            }
          })
          .catch((error) => {
            if (error.body.error.reason == "PREMIUM_REQUIRED") {
              setIsPremium(false);
            } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
              setIsPremium(true);
              setInfoBoxVisible(true);
            } else {
              console.log(error.body.error.reason);
            }
          });
      })
      .catch((error) => {
        if (error.body.error.reason == "PREMIUM_REQUIRED") {
          setIsPremium(false);
        } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
          setIsPremium(true);
          setInfoBoxVisible(true);
        } else {
          console.log(error.body.error.reason);
        }
      });
  };

  const handleRepeat = () => {
    if (repeatState == "off") {
      setRepeatState("context");
    } else if (repeatState == "context") {
      setRepeatState("track");
    } else {
      setRepeatState("off");
    }
  };

  const handleShuffle = () => {
    if (shuffleState) {
      setShuffleState(false);
    } else {
      setShuffleState(true);
    }
  };

  useEffect(() => {
    if (repeatState != undefined) {
      spotifyApi.setRepeat(repeatState).catch((error) => {
        if (error.body.error.reason == "PREMIUM_REQUIRED") {
          setIsPremium(false);
        } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
          setIsPremium(true);
          setInfoBoxVisible(true);
        } else {
          console.log(error.body.error.reason);
        }
      });
    }
  }, [repeatState]);

  useEffect(() => {
    spotifyApi.setShuffle(shuffleState).catch((error) => {
      if (error.body.error.reason == "PREMIUM_REQUIRED") {
        setIsPremium(false);
      } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
        setIsPremium(true);
        setInfoBoxVisible(true);
      } else {
        console.log(error.body.error.reason);
      }
    });
  }, [shuffleState]);

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body != null && data.body.is_playing) {
          void spotifyApi
            .pause()
            .then(() => {
              setInfoBoxVisible(false);
            })
            .catch((error) => {
              if (error.body.error.reason == "PREMIUM_REQUIRED") {
                setIsPremium(false);
              } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
                setIsPremium(true);
                setInfoBoxVisible(true);
              } else {
                console.log(error.body.error.reason);
              }
            });
          setIsPlaying(false);
        } else {
          void spotifyApi
            .play()
            .then(() => {
              setInfoBoxVisible(false);
            })
            .catch((error) => {
              if (error.body.error.reason == "PREMIUM_REQUIRED") {
                setIsPremium(false);
              } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
                setIsPremium(true);
                setInfoBoxVisible(true);
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
      void spotifyApi
        .setVolume(volume)
        .then(() => {
          setInfoBoxVisible(false);
        })
        .catch((error) => {
          if (error.body.error.reason == "PREMIUM_REQUIRED") {
            setIsPremium(false);
          } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
            setIsPremium(true);
            setInfoBoxVisible(true);
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
        {songInfo == null ? (
          <MusicalNoteIcon className="hidden h-10 w-10 md:inline" />
        ) : (
          <img
            className="hidden h-10 w-10 md:inline"
            src={songInfo?.album.images?.[0]?.url}
            alt="Song image"
          />
        )}

        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        {shuffleState ? (
          <MdShuffleOn className="h-5 w-5" onClick={handleShuffle} />
        ) : (
          <MdShuffle className="h-5 w-5" onClick={handleShuffle} />
        )}
        <BackwardIcon
          onClick={() => {
            spotifyApi
              .skipToPrevious()
              .then(() => {
                setTimeout(fetchCurrentSong, 500);
              })
              .catch((error) => {
                if (error.body.error.reason == "PREMIUM_REQUIRED") {
                  setIsPremium(false);
                } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
                  setIsPremium(true);
                  setInfoBoxVisible(true);
                } else if (error.body.error.reason == "UNKNOWN") {
                  console.log("There is no previous track");
                } else {
                  console.log(error.body.error.reason);
                }
              });
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
            spotifyApi
              .skipToNext()
              .then(() => {
                setTimeout(fetchCurrentSong, 500);
              })
              .catch((error) => {
                if (error.body.error.reason == "PREMIUM_REQUIRED") {
                  setIsPremium(false);
                } else if (error.body.error.reason == "NO_ACTIVE_DEVICE") {
                  setIsPremium(true);
                  setInfoBoxVisible(true);
                } else if (error.body.error.reason == "UNKNOWN") {
                  console.log("There is no previous track");
                } else {
                  console.log(error.body.error.reason);
                }
              });
          }}
          className="button"
        />
        {repeatState == "off" ? (
          <TbRepeatOff className="h-5 w-5" onClick={handleRepeat} />
        ) : repeatState == "track" ? (
          <TbRepeatOnce className="h-5 w-5" onClick={handleRepeat} />
        ) : (
          <TbRepeat className="h-5 w-5" onClick={handleRepeat} />
        )}
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
