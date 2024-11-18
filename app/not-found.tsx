'use client';

import { Button } from "@/components/ui/button";
import { NotFoundIcon } from "@/components/icons/NotFoundIcon";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-8 p-4">
      <div className="w-[280px] h-[210px] flex items-center justify-center animate-in fade-in duration-700">
        <NotFoundIcon />
      </div>
      <div className="text-center space-y-3 max-w-[400px] animate-in slide-in-from-bottom duration-700">
        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different location.
        </p>
      </div>
      <div className="flex gap-3 animate-in slide-in-from-bottom duration-700 delay-200">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="min-w-[100px] h-9"
        >
          Go Back
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="min-w-[140px] h-9"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
} 