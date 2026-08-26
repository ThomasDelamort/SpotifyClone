import { useMusicStore } from "@/stores/useMusicStore";
import { Disc3, Library, ListMusic, Music2, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
    const { stats } = useMusicStore();

    const statsData = [
        {
            icon: Library,
            label: "Albums",
            value: stats.totalAlbums.toString(),
            bgColor: "bg-violet-500/10",
            iconColor: "text-violet-500",
        },
        {
            icon: Music2,
            label: "Singles",
            value: stats.totalSingles.toString(),
            bgColor: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
        },
        {
            icon: ListMusic,
            label: "Total Tracks",
            value: stats.totalSongs.toString(),
            bgColor: "bg-sky-500/10",
            iconColor: "text-sky-500",
        },
        {
            icon: Users2,
            label: "Artists",
            value: stats.totalArtists.toString(),
            bgColor: "bg-orange-500/10",
            iconColor: "text-orange-500",
        },
        {
            icon: Disc3,
            label: "Listeners",
            value: stats.totalUsers.toLocaleString(),
            bgColor: "bg-pink-500/10",
            iconColor: "text-pink-500",
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 '>
            {statsData.map((stat) => (
                <StatsCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    bgColor={stat.bgColor}
                    iconColor={stat.iconColor}
                />
            ))}
        </div>
    );
};
export default DashboardStats;
