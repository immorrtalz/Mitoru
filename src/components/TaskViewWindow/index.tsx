import Button, { ButtonStyle } from '../Button';
import styles from './TaskViewWindow.module.scss';

import { TextBox, TextBoxStyle } from '../TextBox';
import Checkbox, { CheckboxType } from '../Checkbox';
import KanbanTag from '../KanbanTag';
import { SVG } from '../SVG';

import { isNewTaskTextValid, isNewTaskTitleValid } from '../../misc/boards';

import useTranslations from "../../hooks/useTranslations";
import { Id, Tag } from '../../hooks/useKanban';

import { useBoardsContext } from '../../context/BoardsContext';
import { useState } from 'react';

interface Props
{
	boardId: Id;
	taskId: Id;
	tags: Record<Id, Tag>;
	className?: string;
	onCancel?: (...args: any[]) => any;
	onTaskContextMenu: (...args: any[]) => any;
	canBackdropCancel?: boolean;
}

export default function TaskViewWindow(props: Props)
{
	const { translate } = useTranslations();
	const { state, toggleTaskCompleted, renameTask, setTaskText } = useBoardsContext();

	const boardId = props.boardId;
	const task = state.boards[boardId]?.tasks[props.taskId];
	const taskTags = task.tagsIds.map(id => props.tags[id]).filter(Boolean);

	const onCancel = (e: React.MouseEvent<HTMLElement>) => props.onCancel?.(e);

	const [titleResetToken, setTitleResetToken] = useState(0);
	const [textResetToken, setTextResetToken] = useState(0);

	return (
		<>
			<span className={styles.overlay} onClick={props.canBackdropCancel !== false ? onCancel : undefined}/>

			<div className={`${styles.container} ${props.className || ''}`}>
				<div className={styles.headerContainer}>
					<Checkbox type={CheckboxType.Simple} checked={task.isCompleted} onChange={() => toggleTaskCompleted(boardId, task.id)}/>

					<TextBox
						key={`task-title-${titleResetToken}`}
						className={styles.taskHeaderText}
						textBoxStyle={TextBoxStyle.Ghost}
						placeholder={`${translate("input_incentive")}...`}
						variant="wrap"
						value={task.title}
						onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						{
							const value = e.target.value.trim();

							if (isNewTaskTitleValid(value, task.title))
								renameTask(boardId, task.id, value);
							else setTitleResetToken(t => t + 1);
						}}/>

					<Button buttonStyle={ButtonStyle.Ghost} small square dimmed onClick={e => props.onTaskContextMenu(e.currentTarget.getBoundingClientRect(), ['color', 'duplicate', 'delete'])}>
						<SVG name='menuDots'/>
					</Button>
				</div>

			{
				task.tagsIds.length > 0 &&
					<div className={styles.taskTagsContainer}>
					{ taskTags.map(tag => <KanbanTag key={tag.id} title={tag.title}/>) }
					</div>
			}

				<TextBox
					key={`task-text-${textResetToken}`}
					className={styles.descriptionText}
					textBoxStyle={TextBoxStyle.Ghost}
					placeholder={`${translate("input_incentive")}...`}
					variant="multiline"
					value={task.text}
					onEditingEnded={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					{
						const value = e.target.value;

						if (isNewTaskTextValid(value, task.text))
							setTaskText(boardId, task.id, value);
						else setTextResetToken(t => t + 1);
					}}/>
			</div>
		</>
	);
}