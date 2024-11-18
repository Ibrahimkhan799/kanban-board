'use client';

import NotionKanban from "@/components/NotionKanban";
import { useBoardStore } from "@/lib/store";
import { Board } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BoardNotFoundIcon } from "@/components/icons/BoardNotFoundIcon";

export default function BoardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const {boards,fetchBoards,user_id} = useBoardStore();
  const boardId = parseInt(params.id);

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true);
      
      // First check if board exists in current store state
      let foundBoard = boards.find(b => b.id === boardId);
      
      if (!foundBoard) {
        // If not found, fetch fresh data
        await fetchBoards(user_id as string);
        // Get updated boards after fetch
        foundBoard = useBoardStore.getState().boards.find(b => b.id === boardId);
      }
      
      setBoard(foundBoard || null);
      setLoading(false);
    };

    loadBoard();
  }, [boardId]);

  if (loading) {
    return (
      <div className="flex flex-col w-full h-full gap-8 p-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        
        {/* Kanban columns skeleton */}
        <div className="flex gap-6">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="flex-1">
              <Skeleton className="h-8 w-[120px] mb-4" />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((card) => (
                  <Skeleton key={card} className="h-[100px] w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-8 p-4">
        <div className="w-[280px] h-[210px] flex items-center justify-center animate-in fade-in duration-700">
          <BoardNotFoundIcon />
        </div>
        <div className="text-center space-y-3 max-w-[400px] animate-in slide-in-from-bottom duration-700">
          <h1 className="text-3xl font-semibold tracking-tight">
            Board not found
          </h1>
          <p className="text-muted-foreground text-sm">
            The board you're looking for doesn't exist or has been deleted.
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

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <NotionKanban 
        board={board}
      />
    </div>
  );
} 