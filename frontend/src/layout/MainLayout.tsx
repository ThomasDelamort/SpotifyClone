import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSideBar from "@/layout/components/LeftSideBar.tsx";
import RightSidebar from "@/layout/components/RightSidebar.tsx";
import AudioPlayer from "@/layout/components/AudioPlayer";
import { PlaybackControls } from "@/layout/components/PlaybackControls.tsx";
import { useEffect, useState } from "react";

export const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 overflow-hidden p-2"
      >
        <AudioPlayer />

        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
          collapsible
          collapsedSize={0}
        >
          <LeftSideBar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsible
              collapsedSize={0}
            >
              <RightSidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
