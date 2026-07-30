/* This file is mostly AI-generated */

import { createContext, useCallback, useState } from "react";
import TagsViewWindow from "../components/TagsViewWindow";

type TagsViewWindowProps = React.ComponentProps<typeof TagsViewWindow>;

export interface TagsViewHandle
{
	id: string;
	close: () => void;
	update: (patch: Partial<TagsViewWindowProps>) => void;
}

interface TagsViewEntry extends TagsViewWindowProps { id: string; }

interface TagsViewContextValue
{
	openTagsView: (props: TagsViewWindowProps) => TagsViewHandle;
}

let nextId = 0;

export const TagsViewContext = createContext<TagsViewContextValue | null>(null);

export function TagsViewProvider({ children }: { children: React.ReactNode })
{
	const [tagsViews, setTagsViews] = useState<TagsViewEntry[]>([]);

	const closeTagsView = useCallback((id: string) =>
		setTagsViews(prev => prev.filter(d => d.id !== id)), []);

	const updateTagsView = useCallback((id: string, patch: Partial<TagsViewWindowProps>) =>
		setTagsViews(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d)), []);

	const openTagsView = useCallback((props: TagsViewWindowProps): TagsViewHandle =>
	{
		const id = `tagsView-${nextId++}`;

		// Wrap cancel so the tags view closes itself by default.
		const entry: TagsViewEntry =
		{
			...props,
			id,
			onCancel: (...args: any[]) =>
			{
				const result = props.onCancel?.(...args);
				if (result !== false) closeTagsView(id);
			}
		};

		setTagsViews([entry]);

		return { id, close: () => closeTagsView(id), update: patch => updateTagsView(id, patch) };
	}, [closeTagsView, updateTagsView]);

	return (
		<TagsViewContext.Provider value={{ openTagsView }}>
			{children}
			{tagsViews.map(({ id, ...props }) => <TagsViewWindow key={id} {...props}/>)}
		</TagsViewContext.Provider>
	);
}