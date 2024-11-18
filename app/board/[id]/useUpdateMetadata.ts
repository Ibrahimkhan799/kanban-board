'use client';

import { useEffect } from 'react';
import { useBoardStore } from '@/lib/store';

export function useUpdateMetadata(boardId: number) {
  const boards = useBoardStore(state => state.boards);

  useEffect(() => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      // Update just the title tag without causing a full page reload
      const titleElement = document.querySelector('title');
      if (titleElement) {
        titleElement.textContent = `${board.name} - Notion Kanban`;
      }
    }
  }, [boards, boardId]);
} 