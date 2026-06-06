import TopBar from "@/components/TopBar.tsx";
import { useMusicStore } from "@/stores/useMusicStore.ts";
import {useEffect} from "react";
import FeaturedSection from "@/pages/home/components/FeaturedSection";
import {ScrollArea} from "@/components/ui/scroll-area";
import SectionGrid from "@/pages/home/components/SectionGrid.tsx";
import {usePlayerStore} from "@/stores/usePlayerStore.ts";


const HomePage = ()=> {


    const {
        fetchFeaturedSongs,
        fetchMadeForYouSongs,
        fetchTrendingSongs,
        isLoading,
        madeForYouSongs,
        featuredSongs,
        trendingSongs
    } = useMusicStore();

    const { initializeQueue } = usePlayerStore();

    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
    }, [ fetchFeaturedSongs, fetchMadeForYouSongs, fetchMadeForYouSongs ]);


    useEffect(() => {
        if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...featuredSongs, ...trendingSongs, ...madeForYouSongs];
            initializeQueue(allSongs);
        }
    }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs])


    console.log({ isLoading, madeForYouSongs, featuredSongs, trendingSongs });


    return (
        <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
            <TopBar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                        Good Afternoon
                    </h1>
                    <FeaturedSection />


                    <div className="space-y-8">
                        <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
                        <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
                    </div>
                </div>
            </ScrollArea>


        </div>
    );
}

export default HomePage;