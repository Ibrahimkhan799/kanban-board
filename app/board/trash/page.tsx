"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { permanentlyDeleteBoard, restoreFromTrash } from "@/lib/api";
import { useBoardStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Trash2, Undo2 } from "lucide-react";
import LoadingBoards from "../loading-boards";
import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Board } from "@/lib/types";
import { motion } from "framer-motion";

export default function TrashPage() {
  const { trashedBoards, setTrashedBoards, user_id,setBoards, boards, isLoading, emptyTrash } =
    useBoardStore();
  const [error, setError] = useState<string | null>(null);
  const [handler, setHandler] = useState<() => void>(() => () => {});
  const { toast } = useToast();
  const [boardToDelete, setBoardToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState(false);

  const handlePermanentDelete = async (boardId: number) => {
    try {
      setIsPermanentlyDeleting(true);
      setTrashedBoards(trashedBoards.filter((b) => b.id !== boardId));
      setBoardToDelete(null);
      toast({
        title: "Board deleted",
        description: "Board has been permanently deleted",
      });
      await permanentlyDeleteBoard(boardId, user_id as string);
    } catch (err) {
      const description =
        err instanceof Error
          ? err.message
          : "Internal error occurred. Please try again in a minute.";
      setError(description);
      setHandler(() => () => handlePermanentDelete(boardId));
    } finally {
      setIsPermanentlyDeleting(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error deleting board",
        description: error,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={handler}>
            Try again
          </ToastAction>
        ),
      });
    }
  }, [error]);

  const handleRestore = async (boardId: number) => {
    try {
      const board = trashedBoards.find((b) => b.id === boardId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { deletedAt: _ignored, ...rest } = board as Board & {deletedAt : string};
      const newBoards = [...boards, rest];
      setTrashedBoards(trashedBoards.filter((b) => b.id !== boardId));
      setBoards(newBoards);
      await restoreFromTrash(boardId, user_id as string);
      toast({
        title: "Board restored",
        description: "Board has been restored",
      });
    } catch (err) {
      const description =
        err instanceof Error
          ? err.message
          : "Internal error occurred. Please try again in a minute.";
      setError(description);
      setHandler(() => () => handleRestore(boardId));
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setIsDeleting(true);
      await emptyTrash(user_id as string);
      toast({
        title: "Trash emptied",
        description: "Trash has been emptied",
      });
    } catch (err) {
      const description =
        err instanceof Error
          ? err.message
          : "Internal error occurred. Please try again in a minute.";
      setError(description);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingBoards length={6} />;

  return (
    <div className="h-full overflow-y-auto scrollbar flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold mb-2">Trash</h1>
            <p className="text-muted-foreground mb-8">
              Deleted boards are stored here for 30 days before being
              permanently removed
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleEmptyTrash}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Emptying Trash...
              </>
            ) : (
              "Empty Trash"
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trashedBoards.map((board,i) => (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3, delay: i * 0.2 }} key={i}>
              <TrashCard board={board} handleRestore={handleRestore} handlePermanentDelete={handlePermanentDelete} isPermanentlyDeleting={isPermanentlyDeleting} boardToDelete={boardToDelete} setBoardToDelete={setBoardToDelete} />
            </motion.div>
          ))}
        </div>

        {trashedBoards.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Trash is empty
          </div>
        )}
      </div>
    </div>
  );
}

const TrashCard = memo(function TrashCard({
  board, 
  handleRestore, 
  handlePermanentDelete, 
  isPermanentlyDeleting, 
  boardToDelete, 
  setBoardToDelete
}: {
  board: Board & {deletedAt: string}, 
  handleRestore: (boardId: number) => void, 
  handlePermanentDelete: (boardId: number) => void, 
  isPermanentlyDeleting: boolean, 
  boardToDelete: number | null, 
  setBoardToDelete: (boardId: number | null) => void
}) {
  return (
    <Card key={board.id} className="group">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
                <CardDescription>
                  Deleted{" "}
                  {board.deletedAt
                    ? formatDistanceToNow(new Date(board.deletedAt)) + " ago"
                    : "recently"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleRestore(board.id)}
                >
                  <Undo2 className="h-4 w-4" />
                  Restore
                </Button>
                <Dialog
                  open={boardToDelete === board.id}
                  onOpenChange={(open) => !open && setBoardToDelete(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => setBoardToDelete(board.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Permanently Delete Board</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to permanently delete &quot;{board.name}&quot;? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setBoardToDelete(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handlePermanentDelete(board.id)}
                      >
                        {isPermanentlyDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : "Confirm"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
  )
})
