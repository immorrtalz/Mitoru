import { useNavigate } from "react-router";
import styles from "./NotFound.module.scss";

import Button from "../components/Button";

import useTranslations from "../hooks/useTranslations";
import { InteractableStyle } from "../misc/utils";

function NotFound()
{
	const navigate = useNavigate();
	const { translate } = useTranslations();

	return (
		<div className='mainContainer'>
			<div className={styles.content}>
				<h1>404</h1>
				<p>{translate("not_found")}</p>
				<Button buttonStyle={InteractableStyle.Primary} onClick={() => navigate("/")}>{translate("go_to_home")}</Button>
			</div>
		</div>
	);
}

export default NotFound;