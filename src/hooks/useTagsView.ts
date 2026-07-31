import { useContext } from "react";
import { TagsViewContext } from "../context/TagsViewContext";

export default function useTagsView()
{
	const ctx = useContext(TagsViewContext);
	if (!ctx) throw new Error("useTagsView must be used within <TagsViewProvider>");
	return ctx;
}