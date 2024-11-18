// Column types
export type ColumnType = "backlog" | "todo" | "in-progress" | "complete";

export interface Column {
  title: string;
  headingColor: string;
  column: ColumnType;
}

// Card types
export interface Card {
  id: number;
  title: string;
  column: ColumnType;
}

// Board type
export interface Board {
  id: number;
  name: string;
  cards: Card[];
  user_id : string;
  lastAccessed?: number;
  created_at : string;
}

// Store types
export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  isCollapsed: boolean;
  isPopoverOpen: boolean;
  boardToDelete: number | null;
  newBoardName: string;
  trashedBoards: (Board & { deletedAt: string })[];
  user_id : string|null;
}

export interface BoardActions {
  setBoards: (boards: Board[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean | ((prev: boolean) => boolean)) => void;
  setIsPopoverOpen: (isOpen: boolean) => void;
  setBoardToDelete: (boardId: number | null) => void;
  setNewBoardName: (name: string) => void;
  setTrashedBoards: (boards: (Board & { deletedAt: string })[]) => void;
  setUserId: (id : string | null) => void;
}

export interface BoardAsyncActions {
  fetchBoards: (user_id : string) => Promise<void>;
  createBoard: (name: string,user_id : string) => Promise<Board>;
  removeBoard: (board: Board,user_id : string) => Promise<void>;
  renameBoard: (boardId: number, newName: string,user_id : string) => Promise<void>;
  updateBoardCards: (boardId: number, cards: Card[],user_id : string) => Promise<void>;
  clearBoards: () => Promise<boolean>;
  syncState: (user_id : string) => Promise<void>;
  saveBoard: (boardId: number, cards: Card[],user_id : string) => Promise<void>;
  updateBoards: (boards: Board[],user_id : string) => Promise<void>;
  emptyTrash: (user_id : string) => Promise<void>;
}

export type BoardStore = BoardState & BoardActions & BoardAsyncActions;

// Utility types
export type Function<TArgs extends unknown[], TReturn = void> = (...args: TArgs) => TReturn;

export type User = {
    id :string;
    name : string;
    password : string;
    email : string;
    created_at: number;
}