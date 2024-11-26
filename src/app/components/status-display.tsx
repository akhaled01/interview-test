"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AgentUpdate } from "@/lib/types";
import { UpdateRecord } from "./update-record";
import { useEffect, useState } from "react";

interface StatusDisplayProps {
  updates: Map<string, AgentUpdate>;
}

export const StatusDisplay = ({ updates }: StatusDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl max-h-[400px] overflow-scroll">
      <CardContent className="flex flex-col gap-1">
        {[...updates.entries()].map(([key, update]) => {
          const isRunning = update.event_status === "running";
          const duration = isRunning
            ? Math.floor(
                (currentTime - Math.max(update.startTime, currentTime)) / 1000
              )
            : Math.floor(update.duration);

          return (
            <UpdateRecord
              key={key}
              update={{
                ...update,
                duration,
              }}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

