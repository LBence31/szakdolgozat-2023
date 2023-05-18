import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useRecoilState } from "recoil";
import { infoBoxUpState } from "~/atoms/infoBoxAtom";
import { premiumUserState } from "~/atoms/premiumAtom";

export default function PlayerErrorBox() {
  const [infoBoxVisible, setInfoBoxVisible] = useRecoilState(infoBoxUpState);
  const [isPremium] = useRecoilState(premiumUserState);

  return (
    <div className="absolute top-20 z-50 w-full text-slate-300 opacity-90">
      <div className="flex items-center justify-center space-x-2">
        <div className="fixed">
          <div className="flex max-w-md justify-center space-x-2 rounded-xl bg-slate-800 px-5 py-3 lg:max-w-full">
            <InformationCircleIcon className="w-6" />
            <div className="">
              {isPremium
                ? "You Need to Have an Active Spotify Player to Remotely Play Tracks"
                : "To Use the Player Functionality, You Need to Have a Premium Spotify Account"}
            </div>
            <XMarkIcon
              className="w-6"
              onClick={() => setInfoBoxVisible(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
