/* This file is mostly AI-generated */

import { createContext, useCallback, useState } from "react";
import TaskViewWindow from "../components/TaskViewWindow";

type TaskViewWindowProps = React.ComponentProps<typeof TaskViewWindow>;

export interface TaskViewHandle
{
	id: string;
	close: () => void;
	update: (patch: Partial<TaskViewWindowProps>) => void;
}

interface TaskViewEntry extends TaskViewWindowProps { id: string; }

interface TaskViewContextValue
{
	openTaskView: (props: TaskViewWindowProps) => TaskViewHandle;
}

let nextId = 0;

export const TaskViewContext = createContext<TaskViewContextValue | null>(null);

export function TaskViewProvider({ children }: { children: React.ReactNode })
{
	const [taskViews, setTaskViews] = useState<TaskViewEntry[]>([]);

	const closeTaskView = useCallback((id: string) =>
		setTaskViews(prev => prev.filter(d => d.id !== id)), []);

	const updateTaskView = useCallback((id: string, patch: Partial<TaskViewWindowProps>) =>
		setTaskViews(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d)), []);

	const openTaskView = useCallback((props: TaskViewWindowProps): TaskViewHandle =>
	{
		const id = `taskView-${nextId++}`;

		// Wrap cancel so the task view closes itself by default.
		const entry: TaskViewEntry =
		{
			...props,
			id,
			onCancel: (...args: any[]) =>
			{
				const result = props.onCancel?.(...args);
				if (result !== false) closeTaskView(id);
			}
		};

		setTaskViews([entry]);

		return { id, close: () => closeTaskView(id), update: patch => updateTaskView(id, patch) };
	}, [closeTaskView, updateTaskView]);

	return (
		<TaskViewContext.Provider value={{ openTaskView }}>
			{children}
			{taskViews.map(({ id, ...props }) => <TaskViewWindow key={id} {...props}/>)}
		</TaskViewContext.Provider>
	);
}