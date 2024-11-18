import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsLoading() {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <Separator />

      {/* Appearance Card */}
      <Card className="p-6">
        <Skeleton className="h-6 w-[120px] mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
      </Card>

      {/* Notifications Card */}
      <Card className="p-6">
        <Skeleton className="h-6 w-[120px] mb-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <Skeleton className="h-6 w-[42px]" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <Skeleton className="h-6 w-[42px]" />
          </div>
        </div>
      </Card>

      {/* Data Management Card */}
      <Card className="p-6">
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[300px] mb-4" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
      </Card>

      {/* Account Card */}
      <Card className="p-6">
        <Skeleton className="h-6 w-[100px] mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-[80px] mb-2" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
          <Separator />
          <div>
            <Skeleton className="h-5 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </Card>
    </div>
  );
} 