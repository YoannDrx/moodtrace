import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[150px] w-full" />
      </div>
    </div>
  );
}
