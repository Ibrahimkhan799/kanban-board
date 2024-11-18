import supabase from "./supabase";
import { Board, Card } from "./types";

let boardsCache: Board[] | null = null;
let trashCache: (Board & { deletedAt: string })[] | null = null;

export async function getAllBoards(userId: string): Promise<Board[]> {
  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  boardsCache = boards;
  return boards;
}

export async function getBoardData(
  id: number,
  userId: string
): Promise<Board | undefined> {
  const { data: board, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return board;
}

export async function addBoard(name: string, userId: string): Promise<Board> {
  const { data: board, error } = await supabase
    .from("boards")
    .insert([
      {
        name,
        user_id: userId,
        cards: [],
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating board:", error);
    throw error;
  }

  boardsCache = null;
  return board;
}
export async function updateBoardCards(
  boardId: number,
  cards: Card[],
  userId: string
): Promise<Board> {
  const { data: board, error } = await supabase
    .from("boards")
    .update({ cards })
    .eq("id", boardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return board;
}

export async function moveToTrash(board: Board, userId: string): Promise<void> {
  const { error: trashError } = await supabase
    .from("trash")
    .insert([
      {
        id: board.id,
        board_data: board,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (trashError) throw trashError;

  const { error: deleteError } = await supabase
    .from("boards")
    .delete()
    .eq("id", board.id)
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  boardsCache = boardsCache?.filter((b) => b.id !== board.id) ?? null;
  trashCache = null;
}

export async function getTrashBoards(
  userId: string
): Promise<(Board & { deletedAt: string })[]> {
  if (trashCache) return trashCache;

  const { data: trash, error } = await supabase
    .from("trash")
    .select("*")
    .eq("user_id", userId)
    .order("deleted_at", { ascending: false });

  if (error) throw error;

  const boards = trash.map((item) => ({
    ...item.board_data,
    deletedAt: item.deleted_at,
  }));

  trashCache = boards;
  return boards;
}

export async function restoreFromTrash(
  boardId: number,
  userId: string
): Promise<void> {
  const { data: trashItem, error: fetchError } = await supabase
    .from("trash")
    .select("board_data")
    .eq("id", boardId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;

  const { error: insertError } = await supabase.from("boards").insert([
    {
      ...trashItem.board_data,
      id: boardId,
      user_id: userId,
    },
  ]);

  if (insertError) throw insertError;

  const { error: deleteError } = await supabase
    .from("trash")
    .delete()
    .eq("id", boardId)
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  trashCache = null;
  boardsCache = null;
}

export async function emptyTrash(userId: string): Promise<void> {
  const { error } = await supabase.from("trash").delete().eq("user_id", userId);

  if (error) throw error;
  trashCache = null;
}

export async function updateBoardName(
  boardId: number,
  name: string,
  userId: string
): Promise<Board> {
  const { data: board, error } = await supabase
    .from("boards")
    .update({ name })
    .eq("id", boardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating board name:", error);
    throw error;
  }

  boardsCache = null;
  return board;
}

export async function deleteBoard(
  boardId: number,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting board:", error);
    throw error;
  }

  boardsCache = boardsCache?.filter((b) => b.id !== boardId) ?? null;
}

export async function updateBoards(
  boards: Board[],
  userId: string
): Promise<void> {
  // First delete all existing boards for this user
  const { error: deleteError } = await supabase
    .from("boards")
    .delete()
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  // Then insert the new boards
  if (boards.length > 0) {
    const { error: insertError } = await supabase.from("boards").insert(
      boards.map((board) => ({
        ...board,
        user_id: userId,
        created_at: new Date().toISOString(),
      }))
    );

    if (insertError) throw insertError;
  }

  boardsCache = boards;
}

export async function permanentlyDeleteBoard(boardId: number, userId: string): Promise<void> {
  const { error } = await supabase.from("trash").delete().eq("id", boardId).eq("user_id", userId);
  if (error) throw error;
  trashCache = trashCache?.filter((b) => b.id !== boardId) ?? null;
}

// Add function to invalidate cache when needed
export async function invalidateBoardsCache() {
  boardsCache = null;
}
