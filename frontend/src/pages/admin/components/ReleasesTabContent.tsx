import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library } from "lucide-react";
import AddReleaseDialog from "@/pages/admin/components/AddReleaseDialog";
import ReleasesTable from "@/pages/admin/components/ReleasesTable";

const ReleasesTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="size-5 text-violet-500" />
              Releases
            </CardTitle>
            <CardDescription>
              Albums and singles. One track publishes a single, several publish an album.
            </CardDescription>
          </div>
          <AddReleaseDialog />
        </div>
      </CardHeader>

      <CardContent>
        <ReleasesTable />
      </CardContent>
    </Card>
  );
};
export default ReleasesTabContent;
