import { createContext, useContext } from "react";
import useGistAPI from "../hooks/useGistAPI";

type GistApi = ReturnType<typeof useGistAPI>;

const GistAPIContext = createContext<GistApi | null>(null);

export function useGistAPIContext(): GistApi
{
	const value = useContext(GistAPIContext);
	if (value === null) throw new Error("useGistAPIContext must be used within <GistAPIProvider>");
	return value;
}

export default GistAPIContext;