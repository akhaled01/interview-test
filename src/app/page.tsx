"use client";

import { StatusDisplay } from "./components/status-display";
import raw_data from "../../public/data.json";
import { useEffect, useMemo, useState } from "react";
import { AgentUpdate } from "@/lib/types";

const Home = () => {
  const data: AgentUpdate[] = useMemo(
    () =>
      (
        raw_data.map((d) => ({
          ...d.update,
          startTime: 0,
          duration: 0,
        })) as AgentUpdate[]
      ).filter(
        (d) =>
          d && d.event_status !== "streaming" && d.node_status !== "streaming"
      ),
    []
  );

  const [currentTasks, setCurrentTasks] = useState<Map<string, AgentUpdate>>(
    new Map()
  );
  const [startTime, setStartTime] = useState<number | null>(null);

  const addOrSetTask = (
    key: string,
    value: AgentUpdate,
    elapsedTime: number
  ) => {
    setCurrentTasks((prevTasks) => {
      const updatedTasks = new Map(prevTasks);
      const prevTask = updatedTasks.get(key);

      const taskStartTime = prevTask?.startTime ?? elapsedTime;
      let duration;

      if (value.event_status === "finished") {
        duration = elapsedTime - taskStartTime;
      } else if (prevTask && prevTask.event_status === "finished") {
        duration = prevTask.duration;
      } else {
        duration = elapsedTime - taskStartTime;
      }

      updatedTasks.set(key, {
        ...value,
        startTime: taskStartTime,
        duration,
      });

      return updatedTasks;
    });
  };

  useEffect(() => {
    let index = 0;
    setStartTime(Date.now());

    const interval = setInterval(() => {
      if (startTime === null) return;

      const now = Date.now();
      const elapsedTime = now - startTime;

      if (index <= data.length) {
        const update = data[index];

        if (!update.node_status) {
          return;
        }

        if (update) {
          addOrSetTask(update.event_type, update, elapsedTime);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [data, startTime]);

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <StatusDisplay updates={currentTasks} startTime={startTime} />
    </main>
  );
};

export default Home;
