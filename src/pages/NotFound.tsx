import { useNavigate } from "react-router";
import styles from "./NotFound.module.scss";

import Button, { ButtonStyle } from "../components/Button";
import { TopBar } from "../components/TopBar";

import useTranslations from "../hooks/useTranslations";

function NotFound()
{
	const navigate = useNavigate();
	const { translate } = useTranslations();

	return (
		<div className='mainContainer'>
			<TopBar/>
			<div className={styles.content}>
				<h1>404</h1>
				<p>{translate("not_found")}</p>
				<Button buttonStyle={ButtonStyle.Primary} onClick={() => navigate("/")}>{translate("go_home")}</Button>
			</div>
		</div>
	);
}

export default NotFound;