import { useContext } from "react";
import SettingsContext from "../context/SettingsContext";
import translationsJson from "../misc/translations.json";

const translations: Record<string, Record<string, string>> = translationsJson;

type TranslationsJson = typeof translationsJson;

export type TranslationKey =
{
	[K in keyof TranslationsJson]: TranslationsJson[K] extends Record<string, string> ? K : never;
}[keyof TranslationsJson];

export default function useTranslations()
{
	const { settings } = useContext(SettingsContext);

	const translate = (key: TranslationKey): string =>
	{
		return translations[key]?.[settings.locale ?? 'en'] ?? key;
	};

	const translateWeekday = (weekday: number, useShortWeekday: boolean = false): string =>
	{
		if (weekday < 0 || weekday > 6) return "??";
		const weekdaysKeys: TranslationKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		return translate(weekdaysKeys[weekday] + (useShortWeekday ? "_short" : "") as TranslationKey);
	};

	const translateMonth = (month: number, useShortMonth: boolean = false): string =>
	{
		if (month < 0 || month > 11) return "???";
		const monthKeys: TranslationKey[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		const fullTranslation = translate(monthKeys[month]);

		return useShortMonth ? fullTranslation.substring(0, 3) : fullTranslation;
	};

	return { translate, translateWeekday, translateMonth };
}