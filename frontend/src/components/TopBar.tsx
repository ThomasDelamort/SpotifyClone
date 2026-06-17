import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import SignInOAuthButtons from "./SignInOAuthButtons.tsx";
import { useAuthStore } from "@/stores/useAuthStore.ts";
import { useSearchStore } from "@/stores/useSearchStore.ts";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

const TopBar = () => {
    const { isAdmin } = useAuthStore();
    const { query, setQuery } = useSearchStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (value: string) => {
        setQuery(value);
        // typing anywhere takes you to the results page
        if (location.pathname !== "/search") navigate("/search");
    };

    return (
        <div
            className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
            backdrop-blur-md z-10
        '>
            <div className='flex gap-2 items-center'>
                <img src="/spotify.png" className='size-8' alt='spotify logo' />
                Spotify
            </div>

            {/* search */}
            <div className='flex-1 max-w-xl mx-4'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400' />
                    <Input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        autoFocus={location.pathname === "/search"}
                        placeholder='What do you want to play?'
                        className='h-10 pl-10 rounded-full bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-white/40'
                    />
                </div>
            </div>

            <div className='flex items-center gap-4'>
                {isAdmin && (
                    <Link to={"/admin"}
                          className={
                              cn(
                                  buttonVariants({ variant:"outline" })
                              )}
                    >
                        <LayoutDashboardIcon className='size-4 mr-2'/>
                        Admin Dashboard
                    </Link>
                )}

                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    );
};

export default TopBar;