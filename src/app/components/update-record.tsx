import { AgentUpdate } from "@/lib/types";
import { Loader2, Check, Clock } from "lucide-react";
import React from "react";

export const UpdateRecord = ({ update }: { update: AgentUpdate }) => (
  <div className="flex items-center justify-between border-t py-3 first:border-t-0">
    <div className="flex items-center gap-2">
      {update.event_status === "running" ? (
        <Loader2 className="h-5 w-5 duration-300 animate-spin text-blue-500" />
      ) : (
        <div className="rounded-full bg-emerald-500/15 p-1">
          <Check className="h-3 w-3 text-emerald-500" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-medium">{update.event_type}</span>
        <span className="text-sm text-muted-foreground">
          {update.updated_node}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>{update.duration.toFixed(1)}s</span>
    </div>
  </div>
);
