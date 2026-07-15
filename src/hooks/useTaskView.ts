import { useContext } from "react";
import { TaskViewContext } from "../context/TaskViewContext";

export default function useTaskView()
{
	const ctx = useContext(TaskViewContext);
	if (!ctx) throw new Error("useTaskView must be used within <TaskViewProvider>");
	return ctx;
}