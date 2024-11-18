"use client";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { sidebarConfig } from "@/lib/sidebar-config";
import { useBoardStore } from "@/lib/store";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface commandProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CommandBar({ open, setOpen }: commandProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { boards } = useBoardStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput onValueChange={(e)=> setSearch(e)} placeholder="Type a command or search..." />
      <CommandList className="scrollbar">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.keys(sidebarConfig).map((key,i) => (
          <CommandGroup key={Math.random() * i} heading={key.charAt(0).toUpperCase() + key.slice(1)}>
            {sidebarConfig[key as keyof typeof sidebarConfig].map((item) => (
              <>
                {!item.isCommand && (
                  <CommandItem
                  key={item.title}
                  onSelect={() => handleSelect(item.href)}
                  value={item.title}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  </CommandItem>
                )}
              </>
            ))}
          </CommandGroup>
        ))}
        <CommandGroup heading="Boards">
          {boards.map((board) => (
            <CommandItem
              key={Math.random() * board.id}
              onSelect={() => handleSelect(`/board/${board.id}`)}
              value={board.name}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>{board.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {search && (
          <CommandGroup heading="Columns">
            {boards.map((board) => (
              <>
                {board.cards.map((card) => (
                  <>
                    {card.title.toLowerCase().includes(search.toLowerCase()) && (
                      <CommandItem
                        key={card.id}
                        onSelect={() => handleSelect(`/board/${board.id}`)}
                        value={card.title}
                      >
                        <FileIcon className="mr-2 h-4 w-4" />
                        <span>{card.title}</span>
                      </CommandItem>
                    )}
                  </>
                ))}
              </>
            ))}
          </CommandGroup>  
        )}
      </CommandList>
    </CommandDialog>
  );
}
