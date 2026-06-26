import { useState, type ReactNode } from "react";
import { Users, Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";
import NowPlaying from "./NowPlaying";
import FriendsActivity from "@/layout/components/FriendsActivity.tsx";

type View = "now" | "friends";

const RightSidebar = () => {
  const [view, setView] = useState<View>("now");

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Segmented toggle between the now-playing panel and friends activity */}
      <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 shrink-0">
        <ToggleButton active={view === "now"} onClick={() => setView("now")}>
          <Disc3 className="size-4 shrink-0" />
          Now Playing
        </ToggleButton>
        <ToggleButton
          active={view === "friends"}
          onClick={() => setView("friends")}
        >
          <Users className="size-4 shrink-0" />
          Friends
        </ToggleButton>
      </div>

      <div className="flex-1 min-h-0">
        {view === "now" ? <NowPlaying /> : <FriendsActivity />}
      </div>
    </div>
  );
};

export default RightSidebar;

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ToggleButton = ({ active, onClick, children }: ToggleButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
      active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white",
    )}
  >
    {children}
  </button>
);
