import { TranslationKey } from "../hooks/useTranslations";

export type Locale = "en" | "ru";

export interface Settings
{
	locale: Locale
}

export interface DisplayOption
{
	displayValue: string;
	value: string;
}

export const settingOptions: Record<keyof Settings, string[]> =
{
	locale: ["en", "ru"]
} as const;

export const settingTranslationKeys: Record<keyof Settings, TranslationKey[]> =
{
	locale: settingOptions.locale.map(value => `setting_locale_${value}`) as TranslationKey[]
} as const;

export const getSettingTranslationKey = (settingKey: keyof Settings, settingUnit: keyof typeof settingOptions): TranslationKey =>
	settingTranslationKeys[settingKey][settingOptions[settingKey].indexOf(settingUnit)];

export const initialSettings: Settings =
{
	locale: "en"
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