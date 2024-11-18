import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { memo } from 'react';

interface BoardCardProps {
  id: number;
  name: string;
  cardCount: number;
  createdDate: string;
}

export const BoardCard = memo(function BoardCard({
  id,
  name,
  cardCount,
  createdDate,
}: BoardCardProps) {
  return (
    <Link href={`/board/${id}`}>
      <Card className="hover:bg-muted/50 transition-all duration-300 cursor-pointer group h-full border-2 hover:border-primary/20 hover:shadow-md">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <CardTitle className="text-xl font-semibold">{name}</CardTitle>
              <div className="space-y-1.5">
                <CardDescription className="text-sm font-medium">
                  {cardCount === 0 ? 'No tasks' : `${cardCount} ${cardCount === 1 ? 'task' : 'tasks'}`}
                </CardDescription>
                <CardDescription className="text-xs text-muted-foreground">
                  Created{" "}
                  {createdDate
                    ? formatDistanceToNow(new Date(createdDate)) + " ago"
                    : "recently"}
                </CardDescription>
              </div>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
});
