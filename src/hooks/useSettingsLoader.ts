import { initialSettings, Locale, LOCALES, Settings } from "../misc/settings";

const SETTINGS_LOCAL_STORAGE_KEY = 'settings';

export default function useSettingsLoader(setSettings: (settings: Settings) => void)
{
	const loadSettings = async () =>
	{
		const settingsFromLocalStorage = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY);
		const settingsExistInLocalStorage = settingsFromLocalStorage !== null;

		const loadSettingsFromLocalStorage = async (): Promise<Settings> =>
		{
			try
			{
				if (!settingsExistInLocalStorage) return initialSettings;

				const loadedSettingsObject = JSON.parse(settingsFromLocalStorage);
				// Match locale with system on the first app launch
				let loadedSettings: Settings = { ...initialSettings, ...loadedSettingsObject, locale: loadedSettingsObject.locale ?? await getOSLocale() };

				for (const [key, _] of Object.entries(loadedSettingsObject))
				{
					if (!(key in initialSettings))
						delete (loadedSettings as any)[key];
				}

				return loadedSettings;
			}
			catch (e) { return initialSettings }
		};

		const getOSLocale = async (): Promise<Locale> =>
		{
			try
			{
				const osLocale = navigator.language || (navigator.languages && navigator.languages[0]) || initialSettings.locale;
				if (osLocale == null || osLocale.length !== 5) return initialSettings.locale;
				const osLocaleSliced = `${osLocale.slice(0, 2).toLowerCase()}-${osLocale.slice(3, 5).toUpperCase()}`;

				return (LOCALES as readonly string[]).includes(osLocaleSliced) ? osLocaleSliced as Locale : initialSettings.locale;
			}
			catch (e) { return initialSettings.locale }
		};

		const settingsToSet = await loadSettingsFromLocalStorage();
		setSettings(settingsToSet);
		if (settingsExistInLocalStorage === false) await saveSettings(settingsToSet);

		return settingsToSet;
	};

	const saveSettings = async (newSettings: Settings) =>
		localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(newSettings));

	return { loadSettings, saveSettings };
}