import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSideBar from "@/layout/components/LeftSideBar.tsx";
import FriendsActivity from "@/layout/components/FriendsActivity.tsx";
import AudioPlayer from "@/layout/components/AudioPlayer";
import { PlaybackControls } from "@/layout/components/PlaybackControls.tsx";


export const MainLayout = () => {
    const isMobile = false;
    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden p-2">

                <AudioPlayer />

                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                    <LeftSideBar />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <Outlet />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

                <ResizablePanel
                    defaultSize={20}
                    minSize={0}
                    maxSize={25}
                    collapsible
                    collapsedSize={0}
                >
                    <FriendsActivity />
                </ResizablePanel>
            </ResizablePanelGroup>

            <PlaybackControls />
        </div>
    );
};

export default MainLayout;