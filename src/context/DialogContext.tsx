/* This file is mostly AI-generated */

import { createContext, useCallback, useState } from "react";
import DialogWindow from "../components/DialogWindow";
import { TextBox } from "../components/TextBox";

type DialogWindowProps = React.ComponentProps<typeof DialogWindow>;

// Derive the input event type from TextBox's own onInput prop
type TextBoxOnInput = NonNullable<React.ComponentProps<typeof TextBox>["onInput"]>;
type TextBoxInputEvent = Parameters<TextBoxOnInput>[0];

export interface DialogHandle
{
	id: string;
	close: () => void;
	update: (patch: Partial<DialogWindowProps>) => void;
}

interface DialogEntry extends DialogWindowProps { id: string; }

interface PromptDialogProps extends Omit<DialogWindowProps, "children" | "onConfirm">
{
	initialValue?: string;
	minLength?: number;
	maxLength?: number;
	validate?: (value: string) => boolean;
	onConfirm: (result: string) => void | false;
}

interface DialogContextValue
{
	openDialog: (props: DialogWindowProps) => DialogHandle;
	openPromptDialog: (props: PromptDialogProps) => DialogHandle;
}

let nextId = 0;

export const DialogContext = createContext<DialogContextValue | null>(null);

interface ValueBox<T> { current: T; }

// Internal only - owns the TextBox's live value, reports validity up to the dialog chrome via `handle`, and calls `onConfirm` directly when Enter is pressed.
function PromptDialogContent({ initialValue, minLength, maxLength, validate, handle, valueBox, onConfirm }:
{
	initialValue: string;
	minLength?: number;
	maxLength?: number;
	validate?: (value: string) => boolean;
	handle: DialogHandle;
	valueBox: ValueBox<string>;
	onConfirm: (result: string) => void | false;
})
{
	const [value, setValue] = useState(initialValue);

	const onInput = (e: TextBoxInputEvent) =>
	{
		const v = (e.target as HTMLInputElement).value;
		setValue(v);
		valueBox.current = v;
		handle.update({ confirmDisabled: validate ? !validate(v) : false });
	};

	const onEnterPressed = () =>
	{
		const result = onConfirm(valueBox.current);
		if (result !== false) handle.close();
	};

	return (
		<TextBox
			value={value}
			minLength={minLength}
			maxLength={maxLength}
			onInput={onInput}
			onEnterPressed={onEnterPressed}
			autofocus/>
	);
}

export function DialogProvider({ children }: { children: React.ReactNode })
{
	const [dialogs, setDialogs] = useState<DialogEntry[]>([]);

	const closeDialog = useCallback((id: string) =>
		setDialogs(prev => prev.filter(d => d.id !== id)), []);

	const updateDialog = useCallback((id: string, patch: Partial<DialogWindowProps>) =>
		setDialogs(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d)), []);

	const openDialog = useCallback((props: DialogWindowProps): DialogHandle =>
	{
		const id = `dialog-${nextId++}`;

		// Wrap confirm/cancel so the dialog closes itself by default.
		// Returning `false` from your handler keeps it open (e.g. failed async validation).
		const entry: DialogEntry =
		{
			...props,
			id,
			onConfirm: (...args: any[]) =>
			{
				const result = props.onConfirm?.(...args);
				if (result !== false) closeDialog(id);
			},
			onCancel: (...args: any[]) =>
			{
				const result = props.onCancel?.(...args);
				if (result !== false) closeDialog(id);
			}
		};

		setDialogs(prev => [...prev, entry]);

		return { id, close: () => closeDialog(id), update: patch => updateDialog(id, patch) };
	}, [closeDialog, updateDialog]);

	const openPromptDialog = useCallback((props: PromptDialogProps): DialogHandle =>
	{
		const { initialValue = "", minLength, maxLength, validate, onConfirm, ...rest } = props;
		const valueBox: ValueBox<string> = { current: initialValue };

		const handle = openDialog(
		{
			...rest,
			confirmDisabled: validate ? !validate(initialValue) : rest.confirmDisabled,
			onConfirm: () => onConfirm(valueBox.current)
		});

		handle.update(
		{
			children: (
				<PromptDialogContent
					initialValue={initialValue}
					minLength={minLength}
					maxLength={maxLength}
					validate={validate}
					handle={handle}
					valueBox={valueBox}
					onConfirm={onConfirm}/>)
		});

		return handle;
	}, [openDialog]);

	return (
		<DialogContext.Provider value={{ openDialog, openPromptDialog }}>
			{children}
			{dialogs.map(({ id, ...props }) => <DialogWindow key={id} {...props}/>)}
		</DialogContext.Provider>
	);
}