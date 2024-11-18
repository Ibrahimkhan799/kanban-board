"use client";
import { BoardCard } from "@/components/BoardCard";
import { useEffect, useState } from "react";
import { Board } from "@/lib/types";
import { useBoardStore } from "@/lib/store";
import LoadingBoards from "../loading-boards";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { motion } from "framer-motion";

export default function RecentPage() {
  const { boards, isLoading } = useBoardStore();
  const [recents, setRecents] = useState<Board[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBoards() {
      try {
        const recentBoards = boards
          .slice()
          .sort((a, b) => {
            const aAccessed = a.lastAccessed || 0;
            const bAccessed = b.lastAccessed || 0;
            return bAccessed - aAccessed;
          })
          .slice(0, 6);
        setRecents(recentBoards);
      } catch (err) {
        let description =
          err instanceof Error
            ? err.message
            : "Internal error occurred. Please try again in a minute.";
        toast({
          title: "Error fetching recent boards",
          description,
          variant: "destructive",
          action: (
            <ToastAction altText="Try again" onClick={fetchBoards}>
              Try again
            </ToastAction>
          ),
        });
      }
    }

    fetchBoards();
  }, [boards]);

  if (isLoading) return <LoadingBoards length={6} />;

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Recent Boards</h1>
        <p className="text-muted-foreground mb-8">
          Your recently accessed boards
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recents.map((board,i) => (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3, delay: i * 0.2 }} key={board.id}>
              <BoardCard
                id={board.id}
                name={board.name}
                cardCount={board.cards?.length ?? 0}
                createdDate={board.created_at}
              />
          </motion.div>
          ))}
        </div>

        {recents.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No recent boards found.
          </div>
        )}
      </div>
    </div>
  );
}
