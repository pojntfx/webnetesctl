import Title from "antd/lib/typography/Title";
import { Wrapper } from "../components/layout-wrapper";
import Animate from "rc-animate";

function Config() {
  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Title level={1}>Config</Title>
      </Wrapper>
    </Animate>
  );
}

export default Config;
