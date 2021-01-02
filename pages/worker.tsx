import { useRouter } from "next/router";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import { BlurWrapper, ContentWrapper, Wrapper } from "./created";

function Worker() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Wrapper>
      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            <h1>{router.query.id}</h1>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </Wrapper>
  );
}

export default Worker;
