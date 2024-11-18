import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';
import * as api from './api';
import { BoardStore } from './types';
import { addBoard, getAllBoards, getTrashBoards } from './api';

const getInitialUserId = () => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('supabase.auth.token');
  if (session) {
    try {
      const { user } = JSON.parse(session);
      return user?.id || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      boards: [],
      currentBoard: null,
      isLoading: true,
      isCollapsed: false,
      isPopoverOpen: false,
      boardToDelete: null,
      newBoardName: "",
      user_id: getInitialUserId(),

      // Add trash state
      trashedBoards: [],
      
      // Simple actions
      setBoards: (boards) => set({ boards }),
      setCurrentBoard: (board) => set({ currentBoard: board }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsCollapsed: (isCollapsed) => set((state) => ({ 
        isCollapsed: typeof isCollapsed === 'function' ? isCollapsed(state.isCollapsed) : isCollapsed 
      })),
      setIsPopoverOpen: (isOpen) => set({ isPopoverOpen: isOpen }),
      setBoardToDelete: (boardId) => set({ boardToDelete: boardId }),
      setNewBoardName: (name) => set({ newBoardName: name }),
      setUserId : (id)=> set({user_id : id}),

      // Add trash actions
      setTrashedBoards: (boards) => set({ trashedBoards: boards }),

      // Add new sync action
      syncState: async (user_id) => {
        try {
          const boards = await getAllBoards(user_id);
          const trashedBoards = await getTrashBoards(user_id);
          set({ boards,trashedBoards, isLoading: false });
        } catch (error) {
          console.error('Failed to sync state:', error);
          set({ isLoading: false });
        }
      },

      emptyTrash: async (user_id) => {
        await api.emptyTrash(user_id);
        await get().syncState(user_id);
      },

      // Modify existing actions to use syncState
      fetchBoards: async (user_id) => {
        await get().syncState(user_id);
      },

      createBoard: async (name,user_id) => {
        try {
          const newBoard = await addBoard(name, user_id);
          await get().syncState(user_id);
          set({ newBoardName: "", isPopoverOpen: false });
          return newBoard;
        } catch (error) {
          console.error('Failed to create board:', error);
          throw error;
        }
      },

      // Modify removeBoard to handle trash sync
      removeBoard: async (board, user_id) => {
        try {
          if (!board) return;
          const trashedBoard = {...board,deletedAt : new Date().toISOString()};
          
          // Then update the backend
          
          await api.moveToTrash(board, user_id);
          
          set(state => ({
            boards: state.boards.filter(b => b.id !== board.id),
            trashedBoards: [...state.trashedBoards, trashedBoard]
          }));
          // Update local state immediately
          
          set({
            boardToDelete: null,
            isLoading: false
          });
        } catch (error) {
          // Revert the state if the backend update fails
          await get().syncState(user_id);
          console.error('Failed to delete board:', error);
          throw error;
        }
      },

      renameBoard: async (boardId, newName,user_id) => {
        const originalBoard = get().boards.find(b => b.id === boardId);
        
        // Immediate optimistic update
        set((state) => ({
          boards: state.boards.map(board =>
            board.id === boardId ? { ...board, name: newName } : board
          ),
          currentBoard: state.currentBoard?.id === boardId 
            ? { ...state.currentBoard, name: newName }
            : state.currentBoard
        }));

        try {
          await api.updateBoardName(boardId, newName,user_id);
        } catch (error) {
          // Revert on error
          if (originalBoard) {
            set((state) => ({
              boards: state.boards.map(board =>
                board.id === boardId ? originalBoard : board
              ),
              currentBoard: state.currentBoard?.id === boardId 
                ? originalBoard 
                : state.currentBoard
            }));
          }
          throw error;
        }
      },
      clearBoards: async () => {
        try {
          // Clear local state
          set({ boards: [] });
          
          await api.invalidateBoardsCache()
          
          return true;
        } catch (error) {
          console.error('Failed to clear boards:', error);
          throw error;
        }
      },

      updateBoardCards: async (boardId, cards,user_id) => {
        const originalBoard = get().boards.find(b => b.id === boardId);
        
        // Optimistic update
        set((state) => ({
          boards: state.boards.map(board =>
            board.id === boardId ? { ...board, cards } : board
          ),
          currentBoard: state.currentBoard?.id === boardId 
            ? { ...state.currentBoard, cards }
            : state.currentBoard
        }));

        try {
          await api.updateBoardCards(boardId, cards,user_id);
        } catch (error) {
          // Revert on error
          if (originalBoard) {
            set((state) => ({
              boards: state.boards.map(board =>
                board.id === boardId ? originalBoard : board
              ),
              currentBoard: state.currentBoard?.id === boardId 
                ? originalBoard 
                : state.currentBoard
            }));
          }
          throw error;
        }
      },

      updateBoards : async(boards,user_id)=>{
        try{
          await api.updateBoards(boards,user_id);
        }catch(error){
          console.error('Failed to update boards:', error);
          throw error;
        }
      },

      saveBoard: async (boardId, cards,user_id) => {
        try {
          await api.updateBoardCards(boardId, cards,user_id);
          set((state) => ({
            boards: state.boards.map(board => 
              board.id === boardId ? { ...board, cards } : board
            )
          }));
        } catch (error) {
          console.error('Failed to save board:', error);
          throw error;
        }
      }
    }),
    {
      name: 'board-storage',
      storage : createJSONStorage(()=> localStorage),
      partialize: (state) => ({
        isCollapsed: state.isCollapsed
      })
    }
  )
); 