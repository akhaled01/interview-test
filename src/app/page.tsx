"use client";

import { StatusDisplay } from "./components/status-display";
import raw_data from "../../public/data.json";
import { useEffect, useMemo, useState } from "react";
import { AgentUpdate } from "@/lib/types";

const Home = () => {
  const data: AgentUpdate[] = useMemo(
    () =>
      raw_data.map((d) => ({
        ...d.update,
        startTime: 1,
      })) as AgentUpdate[],
    []
  );

  const [currentTasks, setCurrentTasks] = useState<Map<string, AgentUpdate>>(
    new Map()
  );

  const addOrSetTask = (key: string, value: AgentUpdate) => {
    setCurrentTasks((prevTasks) => {
      const updatedTasks = new Map(prevTasks);

      const prevTask = updatedTasks.get(key);
      const currentTime = Date.now();

      updatedTasks.set(key, {
        ...value,
        // Maintain the startTime if the task is already running
        startTime:
          value.event_status === "running"
            ? prevTask?.startTime || currentTime
            : prevTask?.startTime || 1,
        duration:
          value.event_status === "running"
            ? prevTask && prevTask.event_status === "running"
              ? prevTask.duration
              : 1
            : prevTask?.duration || 1,
      });

      return updatedTasks;
    });
  };

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index < data.length) {
        const update = data[index];
        if (update) {
          addOrSetTask(update.event_type, update);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <StatusDisplay updates={currentTasks} />
    </main>
  );
};

export default Home;
