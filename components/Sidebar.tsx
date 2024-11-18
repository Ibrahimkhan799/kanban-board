"use client";
import { BoardName } from "@/components/board-name";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarConfig } from "@/lib/sidebar-config";
import { useBoardStore } from "@/lib/store";
import { Board } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layout, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CommandBar } from "./CommandBar";

const Sidebar = () => {
  const {
    boards,
    isLoading,
    newBoardName,
    isPopoverOpen,
    boardToDelete,
    fetchBoards,
    createBoard,
    removeBoard,
    setIsPopoverOpen,
    setNewBoardName,
    setBoardToDelete,
    isCollapsed,
    setIsCollapsed,
    user_id,
    setBoards,
    updateBoards,
  } = useBoardStore();
  const [addBoardLoading, setAddBoardLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false)

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (boards.length === 0) {
      fetchBoards(user_id as string);
    } else {
      useBoardStore.getState().setIsLoading(false);
    }
  }, [boards.length, fetchBoards]);

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setAddBoardLoading(true);
    try {
      const newBoard = await createBoard(
        newBoardName.trim(),
        user_id as string
      );
      router.push(`/board/${newBoard.id}`);
    } catch (error) {
      console.error("Failed to add board:", error);
    } finally {
      setAddBoardLoading(false);
    }
  };

  const handleDelete = async (boardId: number) => {
    try {
      let board = boards.find((b) => b.id === boardId);
      if (!board) return;
      
      setIsDeleting(true);
      await removeBoard(board, user_id as string);
      
      if (pathname === `/board/${boardId}`) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete board:", error);
    } finally {
      setIsDeleting(false);
      setBoardToDelete(null);
    }
  };

  const addBoardButton = (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3"
        side={isCollapsed ? "right" : "bottom"}
      >
        <form onSubmit={handleAddBoard} className="flex flex-col gap-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">New Board</h4>
            <p className="text-sm text-muted-foreground">
              Enter a name for your new board.
            </p>
          </div>
          <Input
            id="name"
            placeholder="Board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="col-span-3"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPopoverOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {addBoardLoading ? (
                <>
                  Creating...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );

  const renderNavItems = (items: typeof sidebarConfig.main) => {
    if (isLoading) {
      return Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center py-1">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        ));
    }

    return items.map((item) => {
      const button = (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 h-8",
            isCollapsed && "justify-center p-2",
            pathname === item.href && "bg-accent"
          )}
          onClick={() => item.isCommand && setCommandOpen(true)}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4 shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </Button>
      );

      if (isCollapsed) {
        return (
          <TooltipProvider key={item.title}>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return button;
    });
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll("[data-before]"));
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || (getIndicators() as HTMLElement[]);
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicators = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ) => {
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + 50);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators() as HTMLElement[];
    clearHighlights(indicators);
    const el = getNearestIndicators(e, indicators);
    el.element.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
    clearHighlights();
    const boardId = parseInt(e.dataTransfer.getData("boardId"));
    const { element } = getNearestIndicators(
      e,
      getIndicators() as HTMLElement[]
    );
    const before = parseInt(element.dataset.before || "-1");
    if (before !== boardId) {
      let copy = [...boards];
      const boardToTransfer = copy.find((b) => b.id === boardId);
      copy = copy.filter((c) => c.id !== boardId);
      if (!boardToTransfer) return;
      let moveToEnd = before === -1;
      if (moveToEnd) {
        copy.push(boardToTransfer as Board);
      } else {
        const insertIndex = copy.findIndex((el) => el.id === before);
        copy.splice(insertIndex, 0, boardToTransfer as Board);
      }

      setBoards(copy);

      try {
        await updateBoards(copy, user_id as string);
      } catch (error) {
        console.error("Failed to save card:", error);
      }
    }
  };

  const renderBoardsList = () => {
    if (isLoading) {
      return Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center py-1">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        ));
    }

    return boards.map((board) => (
      <React.Fragment key={board.id}>
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="py-1">
                  <BoardName
                    isCollapsed={isCollapsed}
                    boardId={board.id}
                    initialName={board.name}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{board.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <motion.div layout className="" layoutId={`${board.id}`}>
            <DropIndicator beforeId={board.id} />
            <BoardName
              isCollapsed={isCollapsed}
              boardId={board.id}
              initialName={board.name}
            />
          </motion.div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="relative h-screen">
      <motion.div
        animate={{ width: isCollapsed ? "4rem" : "16rem" }}
        className="h-full border-r border-border flex flex-col p-4"
      >
        {/* Main Container - with proper height constraints */}
        <div className="flex flex-col h-full gap-3">
          {/* Logo Section - fixed height */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isCollapsed && "justify-center"
              )}
            >
              <Layout className="h-5 w-5 text-primary shrink-0" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-semibold text-base overflow-hidden whitespace-nowrap"
                  >
                    Notion Kanban
                  </motion.h1>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation Section - fixed height */}
          <nav className="flex flex-col gap-1.5 flex-shrink-0">
            {renderNavItems(sidebarConfig.main)}
          </nav>

          {/* Tools Section - fixed height */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "flex items-center mb-4",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              {!isCollapsed && (
                <span className="text-xs font-medium text-muted-foreground">
                  TOOLS
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {renderNavItems(sidebarConfig.tools)}
            </div>
          </div>

          {/* Boards Section - scrollable */}
          <div className="flex flex-col min-h-0 flex-1">
            <div
              className={cn(
                "flex items-center mb-2",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              {!isCollapsed && (
                <span className="text-xs font-medium text-muted-foreground">
                  BOARDS
                </span>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{addBoardButton}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Add New Board</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <motion.div
              layout
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDragEnd}
              className={cn(
                "flex-1 overflow-hidden",
                isCollapsed
                  ? "hover:overflow-y-auto scrollbar-overlay"
                  : "hover:overflow-y-auto scrollbar"
              )}
            >
              {renderBoardsList()}
              <DropIndicator />
            </motion.div>
          </div>

          {/* Settings Section - fixed height */}
          <div className="flex-shrink-0 mt-auto pt-3">
            {renderNavItems(sidebarConfig.settings)}
            <ThemeToggle
              className="mt-1.5"
              variant="button-dropdown"
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </motion.div>

      {/* Collapse Toggle Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsCollapsed((prev) => !prev)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute -right-4 top-6 rounded-full bg-background border border-border"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? "Expand" : "Collapse"} Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={boardToDelete !== null}
        onOpenChange={() => setBoardToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              board and all of its cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => boardToDelete && handleDelete(boardToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <>Deleting...<Loader2 className="h-4 w-4 animate-spin"/></> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CommandBar open={commandOpen} setOpen={setCommandOpen} />
    </div>
  );
};

const DropIndicator = ({ beforeId }: { beforeId?: number | string }) => {
  return (
    <div
      data-before={beforeId || -1}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

export default Sidebar;
