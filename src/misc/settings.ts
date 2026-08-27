export const LOCALES = ["en-US", "ru-RU"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Settings
{
	locale: Locale
}

export const initialSettings: Settings =
{
	locale: LOCALES[0]
};

export interface SettingsContextValue
{
	settings: Settings;
	setSettings: (settings: Settings) => void;
}

export const initialSettingsContextValue: SettingsContextValue =
{
	settings: initialSettings,
	setSettings: () => {}
};