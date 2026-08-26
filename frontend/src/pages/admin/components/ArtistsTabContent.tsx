import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users2 } from "lucide-react";
import AddArtistDialog from "@/pages/admin/components/AddArtistDialog";
import ArtistsTable from "@/pages/admin/components/ArtistsTable";

const ArtistsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="size-5 text-orange-500" />
              Artists
            </CardTitle>
            <CardDescription>
              Deleting an artist unlinks their releases; it does not delete the music.
            </CardDescription>
          </div>
          <AddArtistDialog />
        </div>
      </CardHeader>

      <CardContent>
        <ArtistsTable />
      </CardContent>
    </Card>
  );
};
export default ArtistsTabContent;
