"use client";
import { useUpdateMetadata } from "@/app/board/[id]/useUpdateMetadata";
import { useToast } from "@/hooks/use-toast";
import { DISTANCE_OFFSET } from "@/lib/constants";
import { useBoardStore } from "@/lib/store";
import {
  type Board,
  ColumnType,
  Function,
  type Card,
  type Column,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Loader2, Plus, PlusIcon, Save, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button as Shadcn_Button } from "./ui/button";
import { useRouter } from "next/navigation";

const columns: Column[] = [
  {
    column: "backlog",
    headingColor: "text-neutral-500",
    title: "Backlog",
  },
  {
    title: "TODO",
    column: "todo",
    headingColor: "text-yellow-200",
  },
  {
    title: "In Progress",
    column: "in-progress",
    headingColor: "text-emerald-200",
  },
  {
    title: "Complete",
    column: "complete",
    headingColor: "text-blue-200",
  },
];

interface NotionKanbanProps {
  board: Board;
}

const NotionKanban = ({ board }: NotionKanbanProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { boards, saveBoard, removeBoard, trashedBoards } = useBoardStore();
  const { toast } = useToast();
  const currentBoardName = board?.name;
  const router = useRouter();

  useUpdateMetadata(board.id);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cards =
        boards.find((b) => b.id === board.id)?.cards || board.cards;
      await saveBoard(board.id, cards, board.user_id);
      toast({
        title: "Board saved",
        description: "All changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving board",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      let boardToDelete = trashedBoards.find((b) => b.id === board.id);
      await removeBoard(boardToDelete as Board, board.user_id);
      router.push("/board");
      toast({
        title: "Board deleted",
        description: "The board has been moved to the trash.",
      });
    } catch (error) {
      toast({
        title: "Error deleting board",
        description: "Failed to move board to trash. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col">
      <div className="flex-none px-6 py-4 border-b w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">{currentBoardName}</h1>
        <div className="flex flex-row gap-2">
          <Shadcn_Button
            onClick={handleSave}
            disabled={isSaving}
            variant="default"
            size="default"
          >
            {isSaving ? (
              <>
                Saving...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Save Board
                <Save className="mr-2 h-4 w-4" />
              </>
            )}
          </Shadcn_Button>
          <Shadcn_Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            size="default"
          >
            {isDeleting ? (
              <>
                Moving to Trash...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Move to Trash
                <Trash className="mr-2 h-4 w-4" />
              </>
            )}
          </Shadcn_Button>
        </div>
      </div>
      <Board initialCards={board.cards} boardId={board.id} />
    </div>
  );
};

const Board = ({
  initialCards,
  boardId,
}: {
  initialCards: Card[];
  boardId: number;
}) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const { boards } = useBoardStore();

  useEffect(() => {
    // Update cards when initialCards or the board in the store changes
    const currentBoard = boards.find(b => b.id === boardId);
    setCards(currentBoard?.cards || initialCards);
  }, [initialCards, boardId, boards]);

  return (
    <div className="flex h-full w-full gap-3 p-12 box-border overflow-y-auto scrollbar">
      {columns.map((col) => (
        <Column
          title={col.title}
          cards={cards}
          setCards={setCards}
          column={col.column}
          headingColor={col.headingColor}
          key={col.title}
          boardId={boardId}
        />
      ))}
      <BurnBarrel boardId={boardId} cards={cards} setCards={setCards} />
    </div>
  );
};

const BurnBarrel = ({
  setCards,
  cards,
  boardId,
}: {
  setCards: ColumnProps["setCards"];
  cards: Card[];
  boardId: number;
}) => {
  const [active, setActive] = useState<boolean>(false);
  const { user_id, updateBoardCards } = useBoardStore();

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setActive(false);
  };

  const handleDragEnd: React.DragEventHandler<HTMLDivElement> = async (e) => {
    const cardId = Number(e.dataTransfer.getData("cardId"));
    let copy = [...cards];
    copy = cards.filter((c) => c.id !== cardId);

    setCards(copy);
    setActive(false);

    try {
      await updateBoardCards(boardId, copy, user_id as string);
    } catch (error) {
      console.error("Failed to save card position:", error);
    }
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl border-muted bg-muted/20 text-muted-foreground",
        active && "border-destructive bg-destructive/20 text-destructive"
      )}
    >
      <Trash
        className={cn("pointer-events-none", active && "animate-bounce")}
      />
    </div>
  );
};

interface ColumnProps extends Column {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  boardId: number;
}

const Column: React.FC<ColumnProps> = ({
  headingColor,
  title,
  cards,
  column,
  setCards,
  boardId,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const { user_id, updateBoardCards } = useBoardStore();
  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart: Function<
    [MouseEvent | TouchEvent | PointerEvent, Card],
    void
  > = (e, card) => {
    // @ts-ignore
    e.dataTransfer.setData("cardId", card.id.toString());
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicators(e, indicators);
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicators: Function<
    [React.DragEvent<HTMLDivElement>, HTMLElement[]],
    {
      offset: number;
      element: HTMLElement;
    }
  > = (e, indicators) => {
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
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

  const getIndicators: () => HTMLElement[] = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd: React.DragEventHandler<HTMLDivElement> = async (e) => {
    setActive(false);
    clearHighlights();

    const cardId = parseInt(e.dataTransfer.getData("cardId"));
    const indicators = getIndicators();
    const { element } = getNearestIndicators(e, indicators);
    const before = parseInt(element.dataset.beforeCard || "-1");

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToEnd = before === -1;

      if (moveToEnd) {
        copy.push(cardToTransfer);
      } else {
        const insertIndex = copy.findIndex((el) => el.id === before);
        copy.splice(insertIndex, 0, cardToTransfer);
      }

      setCards(copy);

      try {
        await updateBoardCards(boardId, copy, user_id as string);
      } catch (error) {
        console.error("Failed to save card position:", error);
      }
    }
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={cn("font-medium", headingColor)}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <motion.div
        layout
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={cn(
          "h-full w-full transition-colors bg-neutral-800/0",
          active && "bg-neutral-800/50"
        )}
      >
        {filteredCards.map((c) => (
          <Card
            boardId={boardId}
            key={c.id}
            {...c}
            setCards={setCards}
            cards={cards}
            handleDragStart={handleDragStart}
          />
        ))}
        <DropIndicator beforeId={-1} column={column} />
        <AddCard
          setCards={setCards}
          cards={cards}
          column={column}
          boardId={boardId}
        />
      </motion.div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "icon" | "default";
  variant?: "default" | "link";
  layout?: boolean | "size" | "position" | "preserve-aspect" | undefined;
}

const Button = ({
  className,
  size = "default",
  variant = "default",
  ...props
}: ButtonProps) => {
  return (
    // @ts-expect-error
    <motion.button
      className={cn(
        "px-3 py-1.5 w-fit rounded text-xs text-primary-foreground transition-colors bg-primary hover:bg-primary/90",
        size === "icon" && "flex items-center gap-1.5",
        variant === "link" &&
          "text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent",
        className
      )}
      {...props}
    />
  );
};

type AddCard = {
  column: ColumnType;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  cards: Card[];
  boardId: number;
};

const AddCard = ({ column, setCards, cards, boardId }: AddCard) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const { user_id, updateBoardCards } = useBoardStore();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Generate a random ID between 0 and 1000000
    const randomId = Math.floor(Math.random() * 1000000);

    const newCard: Card = {
      column,
      id: randomId,
      title: trimmedText,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);

    setText("");
    setAdding(false);

    try {
      await updateBoardCards(boardId, updatedCards, user_id as string);
    } catch (error) {
      console.error("Failed to save new card:", error);
    }
  };

  return (
    <motion.div layout layoutId={column}>
      <AnimatePresence>
        {!adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Button size="icon" variant="link" onClick={() => setAdding(true)}>
              <span>Add card</span>
              <PlusIcon size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
          >
            <textarea
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="Add new task..."
              className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
            />
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <Button variant="link" onClick={() => setAdding(false)}>
                Close
              </Button>
              <Button type="submit" size="icon">
                <span>Add</span>
                <Plus size={16} />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface CardProps extends Card {
  handleDragStart: Function<
    [MouseEvent | TouchEvent | PointerEvent, Card],
    void
  >;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  boardId: number;
}

function Card({
  column,
  id,
  title,
  handleDragStart,
  cards,
  setCards,
  boardId,
}: CardProps) {
  const [isEditing, setisEditing] = useState(false);
  const { user_id, updateBoardCards } = useBoardStore();
  const [text, setText] = useState(title);

  const handleEdit = () => {
    setisEditing(true);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setText(title);
      setisEditing(false);
      return;
    }

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, title: trimmedText } : card
    );

    setCards(updatedCards);
    try {
      await updateBoardCards(boardId, updatedCards, user_id as string);
    } catch (error) {
      console.error("Failed to save card:", error);
    }
    setisEditing(false);
  };

  return (
    <motion.div layout layoutId={`${id}`}>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        draggable={!isEditing}
        onDragStart={(e) => handleDragStart(e, { column, id, title })}
        className={cn(
          "rounded border border-border bg-card p-3 flex flex-row justify-between items-center",
          !isEditing && "cursor-grab active:cursor-grabbing"
        )}
      >
        {!isEditing && (
          <>
            <motion.p layout className="text-sm text-card-foreground">
              {title}
            </motion.p>
            <Button
              layout
              onClick={handleEdit}
              variant="link"
              className="p-1 hover:bg-accent h-fit"
            >
              <Edit2 size={14} />
            </Button>
          </>
        )}
        {isEditing && (
          <motion.div layout className="w-full flex flex-col gap-2">
            <motion.input
              autoFocus
              layout
              onKeyDown={handleKeyDown}
              onChange={(e) => setText(e.currentTarget.value)}
              className="text-sm text-foreground border-none bg-transparent outline-none"
              placeholder="Change title"
              value={text}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              exit={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              layout
              style={{ originY: 0 }}
              className="flex flex-row gap-1"
            >
              <Button
                onClick={() => setisEditing(false)}
                variant="link"
                className="p-1 hover:bg-foreground/5 h-fit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="default"
                className="p-1 h-fit"
              >
                Save
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

const DropIndicator = ({
  beforeId,
  column,
}: {
  beforeId: number | string;
  column: Card["column"];
}) => {
  return (
    <div
      data-before-card={beforeId || -1}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

export default NotionKanban;