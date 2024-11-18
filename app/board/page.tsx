"use client"
import { BoardCard } from "@/components/BoardCard";
import { useBoardStore } from "@/lib/store";
import { useEffect } from "react";
import LoadingBoards from "./loading-boards";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function BoardsPage() {
  useAuth();
  const { boards, isLoading, syncState, user_id } = useBoardStore();

  useEffect(() => {
    syncState(user_id as string);
  }, [syncState, user_id]);

  if (isLoading) return <LoadingBoards length={6} />;

  return (
    <div className="flex-1 h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Boards</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your tasks across different boards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {boards?.map((board,i) => (
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
        
        {(!boards || boards.length === 0) && (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No boards found</h3>
            <p className="text-muted-foreground">
              Create your first board to get started organizing your tasks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}