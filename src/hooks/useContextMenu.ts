import { useContext } from "react";
import { ContextMenuContext } from "../context/ContextMenuContext";

export default function useContextMenu()
{
	const ctx = useContext(ContextMenuContext);
	if (!ctx) throw new Error("useContextMenu must be used within <ContextMenuProvider>");
	return ctx;
}