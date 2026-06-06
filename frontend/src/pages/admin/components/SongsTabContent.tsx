import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import SongsTable from "@/pages/admin/components/SongsTable.tsx";

const SongsTabContent = () => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Music className="size-5 text-emerald-500" />
                            Songs Library
                        </CardTitle>
                        <CardDescription>Manage your music Tracks</CardDescription>
                    </div>
                    <Button className="bg-emerald-400 rounded-md">+ Add Songs</Button>
                </div>
            </CardHeader>
            <CardContent>
                <SongsTable />
            </CardContent>
        </Card>
    )
}
export default SongsTabContent
