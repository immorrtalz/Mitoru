import { createContext } from 'react';
import { SettingsContextValue, initialSettingsContextValue } from '../misc/settings';

const SettingsContext = createContext<SettingsContextValue>(initialSettingsContextValue);

export default SettingsContext;