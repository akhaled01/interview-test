"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AgentUpdate } from "@/lib/types";
import { UpdateRecord } from "./update-record";
import { useEffect, useState } from "react";

interface StatusDisplayProps {
  updates: Map<string, AgentUpdate>;
  startTime: number | null;
}

export const StatusDisplay = ({ updates, startTime }: StatusDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100); // Update every 100ms to make the timer smoother

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl max-h-[400px] overflow-scroll">
      <CardContent className="flex flex-col gap-1">
        {[...updates.entries()].map(([key, update]) => {
          const isRunning = update.event_status === "running";
          let duration;

          if (isRunning && startTime) {
            duration = (currentTime - startTime - update.startTime) / 1000;
          } else {
            duration = update.duration / 1000;
          }

          return (
            <UpdateRecord
              key={key}
              update={{
                ...update,
                duration: Math.max(0, duration), // Ensure duration is never negative
              }}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
