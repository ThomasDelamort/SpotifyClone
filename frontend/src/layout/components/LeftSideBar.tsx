import { Link } from "react-router-dom";
import {HomeIcon, Library, MessageCircle} from "lucide-react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import {SignedIn} from "@clerk/clerk-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import PlaylistSkeleton from "@/components/skeleton/PlaylistSkeleton.tsx";


export const LeftSideBar = () => {
    const isLoading = true;
    return <div className="h-full flex flex-col gap-2">


        <div className="rounded-lg bg-zinc-900 p-4">
            <div className="space-y-2">
                <Link to={"/"}
                  className={cn(buttonVariants(
                      {
                          variant: "ghost",
                          className:"w-full justify-start text-white hover:bg-zinc-800 rounded-sm",
                      }
                  ))}
                >
                <HomeIcon className="mr-2 size-5" />
                <span className="hidden md:inline">Home</span>
                </Link>

                <SignedIn>
                    <Link to={"/chat"}
                          className={cn(buttonVariants(
                              {
                                  variant: "ghost",
                                  className:"w-full justify-start text-white hover:bg-zinc-800 rounded-sm",
                              }
                          ))}
                    >
                        <MessageCircle className="mr-2 size-5" />
                        <span className="hidden md:inline">Messages</span>
                    </Link>
                </SignedIn>
            </div>
        </div>

        <div className="flex-1 rounded-lg bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-white px-2">
                    <Library className='size-5 mr-2' />
                    <span className='hidden md:inline'>Playlists</span>
                </div>
            </div>


            <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2"></div>
                    {isLoading ? (
                        <PlaylistSkeleton />
                    ) : (
                        "some music"
                    )}
            </ScrollArea>
        </div>
    </div>
}
export default LeftSideBar
