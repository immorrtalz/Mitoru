import { useContext } from "react";
import SettingsContext from "../context/SettingsContext";
import translationsEnUSJson from "../lang/en-US.json";
import translationsRuRUJson from "../lang/ru-RU.json";

type TranslationEntries = typeof translationsEnUSJson;
export type TranslationKey = keyof TranslationEntries;

const translations: Record<string, TranslationEntries> =
{
	'en': translationsEnUSJson,
	'ru': translationsRuRUJson,
};

export default function useTranslations()
{
	const { settings } = useContext(SettingsContext);
	const locale = settings.locale ?? 'en';

	const translate = (key: TranslationKey): string =>
		translations[locale]?.[key] ?? key;

	return { translate, locale };
}