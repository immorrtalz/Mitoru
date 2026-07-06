import { useState } from "react";
import { Octokit } from "@octokit/core";
import { encryptAndStoreToken, decryptStoredToken } from "../misc/cryptoUtils";
import { KanbanState } from "./useKanban";

const GIST_FILE_NAME = 'MitoruJsonData';
const GITHUB_API_VERSION = '2026-03-10';

export default function useGistAPI(state: KanbanState, loadState: (newState: KanbanState) => void)
{
	const [octokit, setOctokit] = useState<Octokit | null>(null);

	const isOctokitInitialized = () => octokit !== null;

	const initOctokit = async (passPhrase: string, providedApiKey?: string) =>
	{
		console.log("Initializing Octokit with API key:", providedApiKey);

		if (passPhrase.length < 8 || passPhrase.length > 256)
			return Promise.reject("Passphrase must be between 8 and 256 characters long.");

		let apiKey = providedApiKey ?? null;

		// If this function is called without an API key, it means we're trying to load data from localStorage
		if (apiKey === null)
			apiKey = await decryptStoredToken(passPhrase);

		if (apiKey === null) // No API key provided and no data in localStorage
			return Promise.reject("API key is required for the first-time setup.");
		else if (providedApiKey !== undefined) // Store the provided API key in localStorage
			await encryptAndStoreToken(apiKey, passPhrase);

		console.log("Octokit initialized with API key:", apiKey);

		setOctokit(new Octokit({ auth: apiKey }));
		return Promise.resolve();
	};

	const createGist = async () =>
	{
		if (octokit === null) return;

		const result = await octokit.request('POST /gists',
		{
			public: false,
			files:
			{
				[GIST_FILE_NAME]:
				{
					content: JSON.stringify(state, null, 2)
				}
			},
			headers:
			{
				'X-GitHub-Api-Version': GITHUB_API_VERSION,
				'accept': 'application/vnd.github+json'
			}
		});

		console.log(result.data.id);

		/* if (result.status == 201 && result.data.id)
			setGistId(result.data.id); */
	};

	const getGistContent = async (gistId: string) =>
	{
		if (octokit === null) return;

		const result = await octokit.request(`GET /gists/${gistId}`,
		{
			gist_id: gistId,
			headers:
			{
				'X-GitHub-Api-Version': GITHUB_API_VERSION,
				'accept': 'application/vnd.github+json'
			}
		});

		console.log(result.data.files[GIST_FILE_NAME]?.content);

		if (result.status == 200 && result.data.files[GIST_FILE_NAME]?.content)
			loadState(JSON.parse(result.data.files[GIST_FILE_NAME]?.content ?? '{}'));
	};

	const updateGist = async (gistId: string) =>
	{
		if (octokit === null) return;

		const result = await octokit.request(`PATCH /gists/${gistId}`,
		{
			gist_id: gistId,
			files:
			{
				[GIST_FILE_NAME]:
				{
					content: JSON.stringify(state, null, 2)
				}
			},
			headers:
			{
				'X-GitHub-Api-Version': GITHUB_API_VERSION,
				'accept': 'application/vnd.github+json'
			}
		});

		console.log(result.data);
	};

	return { isOctokitInitialized, initOctokit, createGist, getGistContent, updateGist };
}