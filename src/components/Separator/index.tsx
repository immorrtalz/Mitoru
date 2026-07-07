import { CSSPropertiesWithVars, Orientation } from '../../misc/utils';
import styles from './Separator.module.scss';

interface Props
{
	orientation: Orientation;
	paddingRightOrTop?: number;
	paddingLeftOrBottom?: number;
	className?: string;
}

export default function Separator(props: Props)
{
	const orientationStyles = [styles.horizontal, styles.vertical];
	const orientationStyle = orientationStyles[props.orientation];

	const styleObject: CSSPropertiesWithVars =
	{
		"--paddingRightOrTop": `${props.paddingRightOrTop ?? 0}px`,
		"--paddingLeftOrBottom": `${props.paddingLeftOrBottom ?? 0}px`
	};

	return <span className={`${styles.separator} ${orientationStyle}`} style={styleObject}/>;
}