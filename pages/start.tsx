import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import { Wrapper } from "../components/layout-wrapper";

function Start() {
  const { t } = useTranslation();

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <img alt={t("webnetesLogo")} src="/logo.svg" />
      </Wrapper>
    </Animate>
  );
}

export default Start;
