import { useContext } from "react";
import SettingsContext from "../context/SettingsContext";
import translationsEnUSJson from "../lang/en-US.json";
import translationsRuRUJson from "../lang/ru-RU.json";
import { initialSettings, Locale, LOCALES } from "../misc/settings";

type TranslationEntries = typeof translationsEnUSJson;
export type TranslationKey = keyof TranslationEntries;

const translations: Record<Locale, TranslationEntries> =
{
	[LOCALES[0]]: translationsEnUSJson,
	[LOCALES[1]]: translationsRuRUJson
};

export default function useTranslations()
{
	const { settings } = useContext(SettingsContext);
	const locale = settings.locale ?? initialSettings.locale;

	const translate = (key: TranslationKey): string =>
		translations[locale]?.[key] ?? key;

	return { translate, locale };
}