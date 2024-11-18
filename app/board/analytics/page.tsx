"use client";
import { StatsCard } from "@/components/analytics/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_COLUMNS } from "@/lib/constants";
import { useBoardStore } from "@/lib/store";
import { BarChart, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { useEffect, useMemo } from "react";

export default function AnalyticsPage() {
  const { boards, trashedBoards, isLoading } = useBoardStore();
  
  useEffect(() => {
    document.title = "Analytics | Task Board";
  }, []);

  const stats = useMemo(() => {
  // Updated statistics calculations
  const totalBoards = boards.length;
  const totalTrashedBoards = trashedBoards.length;
  const totalTasks = boards.reduce((acc, board) => acc + board.cards.length, 0);
  const trashedTasks = trashedBoards.reduce((acc, board) => acc + board.cards.length, 0);
  const completedTasks = boards.reduce(
    (acc, board) => acc + board.cards.filter(card => card.column === 'complete').length,
    0
  );
  const completionRate = totalTasks 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Add new task distribution calculations
  const taskDistribution = boards.reduce((acc, board) => {
    board.cards.forEach(card => {
      acc[card.column] = (acc[card.column] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalActiveTasks = Object.values(taskDistribution).reduce((a, b) => a + b, 0);
  
  // Calculate percentages for each column
  const columnPercentages = Object.entries(taskDistribution).map(([column, count]) => ({
    column,
    count,
    percentage: totalActiveTasks ? Math.round((count / totalActiveTasks) * 100) : 0
  }));

    return {
      totalBoards,
      totalTrashedBoards,
      totalTasks,
      trashedTasks,
      completedTasks,
      completionRate,
      columnPercentages,
    };
  }, [boards, trashedBoards]);


  const { totalBoards, totalTrashedBoards, totalTasks, trashedTasks, completedTasks, completionRate, columnPercentages } = stats;

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 rounded-lg border">
                <Skeleton className="h-8 w-8 mb-4" />
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Board Statistics Skeleton */}
            <div className="p-6 rounded-lg border">
              <Skeleton className="h-6 w-40 mb-6" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center mb-4">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            {/* Task Distribution Skeleton */}
            <div className="p-6 rounded-lg border">
              <Skeleton className="h-6 w-40 mb-6" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center mb-4">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 scrollbar overflow-y-auto h-screen">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and task management metrics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Boards"
            value={`${totalBoards} / ${totalBoards + totalTrashedBoards}`}
            icon={BarChart}
            description="Active / Total boards"
          />
          <StatsCard
            title="Total Tasks"
            value={`${totalTasks} / ${totalTasks + trashedTasks}`}
            icon={ListTodo}
            description="Active / Total tasks"
          />
          <StatsCard
            title="Completed Tasks"
            value={completedTasks}
            icon={CheckCircle2}
            description="Tasks in 'Complete' status"
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={Clock}
            description="Tasks completed vs total"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Board Details */}
          <Card>
            <CardHeader>
              <CardTitle>Board Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {boards.map(board => (
                  <div key={board.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{board.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {board.cards.length} tasks
                      </p>
                    </div>
                    <div className="text-sm">
                      {board.cards.filter(card => card.column === 'complete').length} completed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Trash Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trash Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trashedBoards.map(board => (
                  <div key={board.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{board.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {board.cards.length} tasks
                      </p>
                    </div>
                    <div className="text-sm">
                      {board.cards.filter(card => card.column === 'complete').length} completed
                    </div>
                  </div>
                ))}
                {trashedBoards.length === 0 && (
                  <p className="text-sm text-muted-foreground">No boards in trash</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* New Task Distribution Card */}
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEFAULT_COLUMNS.map((column) => {
                  const stats = columnPercentages.find(col => col.column === column.value) || {
                    count: 0,
                    percentage: 0
                  };
                  
                  return (
                    <div key={column.value} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{column.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.count} tasks
                        </p>
                      </div>
                      <div className="text-sm">
                        {stats.percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 