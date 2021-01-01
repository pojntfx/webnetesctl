import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function Start() {
  const { t } = useTranslation();

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Image alt={t("webnetesLogo")} src="/logo.svg" />
      </Wrapper>
    </Animate>
  );
}

export const Wrapper = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
`;

const Image = styled.img`
  width: 100%;
  max-width: 25rem;
`;

export default Start;
