/* This file is mostly AI-generated */

import { createContext, useCallback, useState } from "react";
import ContextMenu from "../components/ContextMenu";
import Button from "../components/Button";
import React from "react";

type ContextMenuProps = React.ComponentProps<typeof ContextMenu>;

const withAutoClose = (node: React.ReactNode, close: () => void): React.ReactNode =>
{
	return React.Children.map(node, child =>
	{
		if (!React.isValidElement(child)) return child;

		if (child.type === Button)
		{
			const buttonProps = child.props as React.ComponentProps<typeof Button>;
			if (buttonProps.disabled) return child;

			return React.cloneElement(child,
			{
				onClick: (...args: any[]) =>
				{
					buttonProps.onClick?.(...args);
					close();
				}
			} as any);
		}

		const childProps = child.props as { children?: React.ReactNode };

		if (childProps?.children !== undefined)
			return React.cloneElement(child, { children: withAutoClose(childProps.children, close) } as any);

		return child;
	});
}

export interface ContextMenuHandle
{
	id: string;
	close: () => void;
	update: (patch: Partial<ContextMenuProps>) => void;
}

interface ContextMenuEntry extends ContextMenuProps { id: string; }
interface ContextMenuContextValue { openContextMenu: (props: ContextMenuProps) => ContextMenuHandle; }

let nextId = 0;

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export function ContextMenuProvider({ children }: { children: React.ReactNode })
{
	const [contextMenus, setContextMenus] = useState<ContextMenuEntry[]>([]);

	const closeContextMenu = useCallback((id: string) =>
		setContextMenus(prev => prev.filter(d => d.id !== id)), []);

	const updateContextMenu = useCallback((id: string, patch: Partial<ContextMenuProps>) =>
		setContextMenus(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d)), []);

	const openContextMenu = useCallback((props: ContextMenuProps): ContextMenuHandle =>
	{
		const id = `contextMenu-${nextId++}`;
		const close = () => closeContextMenu(id);

		// Wrap cancel so the context menu closes itself by default.
		const entry: ContextMenuEntry =
		{
			...props,
			id,
			children: withAutoClose(props.children, close),
			onCancel: (...args: any[]) =>
			{
				const result = props.onCancel?.(...args);
				if (result !== false) close();
			}
		};

		setContextMenus([entry]);

		return { id, close: () => closeContextMenu(id), update: patch => updateContextMenu(id, patch) };
	}, [closeContextMenu, updateContextMenu]);

	return (
		<ContextMenuContext.Provider value={{ openContextMenu }}>
			{children}
			{contextMenus.map(({ id, ...props }) => <ContextMenu key={id} {...props}/>)}
		</ContextMenuContext.Provider>
	);
}