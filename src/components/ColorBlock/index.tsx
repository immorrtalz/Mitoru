import styles from './ColorBlock.module.scss';
import { Color, COLOR_VALUES } from '../../hooks/useKanban';
import { CSSPropertiesWithVars } from '../../misc/utils';

interface Props
{
	color: Color;
	className?: string;
}

export default function ColorBlock(props: Props)
{
	const styleObject: CSSPropertiesWithVars = { "--objectColor": `${COLOR_VALUES[props.color]}` };
	return <div className={`${styles.colorBlock} ${props.className || ''}`} style={styleObject}/>;
}