"use client";

import { useBoardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Layout, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface BoardNameProps {
  boardId: number;
  initialName: string;
  isCollapsed: boolean;
}

export function BoardName({
  boardId,
  initialName,
  isCollapsed,
}: BoardNameProps) {
  const [name, setName] = useState(initialName);
  const [text, setText] = useState(name);
  const [isOpen, setIsOpen] = useState(false);
  const { user_id } = useBoardStore();
  const [isLoading, setIsLoading] = useState(false);
  const renameBoard = useBoardStore((state) => state.renameBoard);
  const boards = useBoardStore((state) => state.boards);
  const pathname = usePathname();
  const router = useRouter();
  const setBoardToDelete = useBoardStore((state) => state.setBoardToDelete);

  // Update local state when board name changes in store
  useEffect(() => {
    const board = boards.find((b) => b.id === boardId);
    if (board && board.name !== name && !isOpen) {
      setName(board.name);
      setText(board.name);
    }
  }, [boards, boardId, isOpen, name]);

  const handleBoardClick = (id: number) => {
    router.push(`/board/${id}`);
  };

  const handleRename = async () => {
    if (!text || text === initialName) {
      setIsOpen(false);
      setName(initialName);
      return;
    }

    setIsLoading(true);
    try {
      await renameBoard(boardId, text, user_id as string);
      setIsOpen(false);
    } catch (error) {
      setName(initialName);
      console.error("Failed to rename board:", error);
    } finally {
      setName(text);
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData("boardId", boardId.toString());
  };

  return (
    <>
      <div className="relative group flex flex-row justify-between items-center">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 cursor-pointer",
            isCollapsed && "flex flex-row gap-3 justify-center p-2",
            pathname === `/board/${boardId}` && "bg-accent"
          )}
          draggable={!isCollapsed}
          onDragStart={handleDragStart}
          onClick={() => handleBoardClick(boardId)}
        >
          <>
            <Layout className="h-4 w-4 shrink-0" />
            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden whitespace-nowrap text-sm"
                    >
                    {name}
                  </motion.span>
                )}
            </AnimatePresence>
          </>
        </Button>

        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dropdown-menu" align="end">
              <DropdownMenuItem
                onSelect={() => {
                  setIsOpen(true);
                  setName(initialName);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  setBoardToDelete(boardId);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            placeholder="Enter board name"
            disabled={isLoading}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setName(initialName);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isLoading || !text || text === initialName}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
