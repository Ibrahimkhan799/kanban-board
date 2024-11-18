import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    length : number;
}

function LoadingBoards({length} : Props) {
  return <div className="flex-1 p-8">
  <div className="max-w-7xl mx-auto">
    <Skeleton className="h-10 w-48 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(length)].map((_, i) => (
        <div key={i} className="p-6 rounded-lg border space-y-3">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
</div>;
}

export default LoadingBoards;