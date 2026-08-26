import { useAuthStore } from "@/stores/useAuthStore";
import Header from "@/pages/admin/components/Header";
import DashboardStats from "@/pages/admin/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, Music, Users2 } from "lucide-react";
import ReleasesTabContent from "@/pages/admin/components/ReleasesTabContent";
import ArtistsTabContent from "@/pages/admin/components/ArtistsTabContent";
import SongsTabContent from "@/pages/admin/components/SongsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { useArtistStore } from "@/stores/useArtistStore";

// The tabs mirror how the app itself is organised: artists publish releases
// (albums and singles), and releases are made of tracks.
const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();

  const { fetchAlbums, fetchSongs, fetchSingles, fetchStats } = useMusicStore();
  const { fetchArtists } = useArtistStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchSingles();
    fetchStats();
    fetchArtists();
  }, [fetchAlbums, fetchSongs, fetchSingles, fetchStats, fetchArtists]);

  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

  return (
    <div
      className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900
        to-black text-zinc-100 p-8"
    >
      <Header />

      <DashboardStats />

      <Tabs defaultValue="releases" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="releases" className="data-[state=active]:bg-zinc-700">
            <Library className="mr-2 size-4" />
            Releases
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-zinc-700">
            <Users2 className="mr-2 size-4" />
            Artists
          </TabsTrigger>
          <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
            <Music className="mr-2 size-4" />
            Tracks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="releases">
          <ReleasesTabContent />
        </TabsContent>

        <TabsContent value="artists">
          <ArtistsTabContent />
        </TabsContent>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
