"use client";

import TaskTable from "@/components/TaskTable";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://10.82.66.179:5050/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="w-[80%] mx-auto mt-10 gap-5 flex flex-col">
      <h1 className="text-2xl font-bold">User request history</h1>
      <TaskTable tasks={tasks} />
    </div>
  );
}
