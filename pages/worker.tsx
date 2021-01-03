import {
  faChevronUp,
  faCube,
  faLocationArrow,
  faMapMarkerAlt,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card as CardTmpl, Space } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Animate from "rc-animate";
import { forwardRef, useCallback, useEffect, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "react-i18next";
import ParticlesTmpl from "react-particles-js";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { useWindowSize } from "use-window-size-hook";
import localResources from "../data/local-resources.json";
import network from "../data/network.json";
import glass from "../styles/glass";
import { urldecodeYAMLAll } from "../utils/urltranscode";
import {
  BlurWrapper as BlurWrapperTmpl,
  ContentWrapper as ContentWrapperTmpl,
  Wrapper,
} from "./created";

const particlesConfig: typeof ParticlesTmpl["arguments"] = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 1000,
      },
    },
    line_linked: {
      enable: true,
      opacity: 0.02,
    },
    move: {
      direction: "right",
      speed: 0.2,
    },
    size: {
      value: 1,
    },
    opacity: {
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.05,
      },
    },
  },
  interactivity: {
    events: {
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      push: {
        particles_nb: 1,
      },
    },
  },
  retina_detect: true,
};

function Worker() {
  const { t } = useTranslation();
  const router = useRouter();
  const { height } = useWindowSize();
  const { ref: bottomBarRef, height: bottomBarHeight } = useDimensions();

  const [nodeConfig, setNodeConfig] = useState<string>();

  useEffect(() => {
    const rawNodeConfig = router.query.nodeConfig;

    if (rawNodeConfig) {
      try {
        setNodeConfig(urldecodeYAMLAll(rawNodeConfig as string));
      } catch (e) {
        console.log("could not decode node config", e);
      }
    }
  }, [router.query.nodeConfig]);

  useEffect(() => {
    nodeConfig && console.log(nodeConfig);
  }, [nodeConfig]);

  const networkGraphRef = useCallback((graph) => {
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 1000);
    }
  }, []);

  const resourceGraphRef = useCallback((graph) => {
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 1000);
    }
  }, []);

  const compositeGraphRef = useCallback((graph) => {
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 1000);
    }
  }, []);

  return (
    <Wrapper>
      <Particles params={particlesConfig} />

      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            {/* <Graph
              graphData={composite}
              backgroundColor="rgba(0,0,0,0)"
              showNavInfo={false}
              height={height ? height - bottomBarHeight : 0}
              nodeThreeObject={(node: any) => {
                const sprite = new SpriteText(node.id?.toString());

                sprite.color = "#ffffff";
                sprite.textHeight = 2;
                sprite.backgroundColor = node.color + "F0";
                sprite.padding = 2;

                return sprite;
              }}
              nodeAutoColorBy="group"
              ref={compositeGraphRef}
            /> */}

            <BottomBarWrapper ref={bottomBarRef}>
              <LeftGauge
                cover={
                  <Graph
                    graphData={localResources}
                    backgroundColor="rgba(0,0,0,0)"
                    showNavInfo={false}
                    width={256}
                    height={200}
                    nodeThreeObject={(node: any) => {
                      const sprite = new SpriteText(node.id?.toString());

                      sprite.color = "#ffffff";
                      sprite.textHeight = 6;
                      sprite.backgroundColor = "rgba(0,0,0,0.5)";
                      sprite.padding = 2;

                      return sprite;
                    }}
                    ref={resourceGraphRef}
                  />
                }
              >
                <CardSpace>
                  <Button type="text" shape="circle">
                    <FontAwesomeIcon icon={faChevronUp} />
                  </Button>

                  <span>
                    <Text strong>
                      <FontAwesomeIcon icon={faCube} /> 16{" "}
                    </Text>
                    {t("resource", { count: 16 })}
                  </span>
                </CardSpace>
              </LeftGauge>

              <Space direction="vertical" align="center">
                <MainExpandButton type="text" shape="circle">
                  <FontAwesomeIcon icon={faChevronUp} />
                </MainExpandButton>

                <TitleSpace align="center">
                  <TransparentLocationButton
                    type="text"
                    shape="circle"
                    icon={<FontAwesomeIcon icon={faLocationArrow} fixedWidth />}
                  />

                  <Title level={1}>{router.query.id}</Title>
                </TitleSpace>

                <Text>
                  <Space>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Stuttgart, Germany
                  </Space>
                </Text>
              </Space>

              <RightGauge
                cover={
                  <Graph
                    graphData={network}
                    backgroundColor="rgba(0,0,0,0)"
                    showNavInfo={false}
                    width={256}
                    height={200}
                    nodeThreeObject={(node: any) => {
                      const sprite = new SpriteText(node.id?.toString());

                      sprite.color = "#ffffff";
                      sprite.textHeight = 6;
                      sprite.backgroundColor = "rgba(0,0,0,0.5)";
                      sprite.padding = 2;

                      return sprite;
                    }}
                    ref={networkGraphRef}
                  />
                }
              >
                <CardSpace>
                  <span>
                    <Text strong>
                      <FontAwesomeIcon icon={faMobile} /> 4{" "}
                    </Text>
                    {t("node", { count: 4 })}
                  </span>

                  <Button type="text" shape="circle">
                    <FontAwesomeIcon icon={faChevronUp} />
                  </Button>
                </CardSpace>
              </RightGauge>
            </BottomBarWrapper>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </Wrapper>
  );
}

const CardSpace = styled(Space)`
  width: 100%;
  justify-content: space-between;
`;

const Card = styled(CardTmpl)`
  background: transparent !important;

  .ant-card-cover {
    border: 1px solid #303030;
    ${glass}
  }

  .ant-card-body {
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #141414;
  }
`;

const LeftGauge = styled(Card)`
  border-left: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
`;

const RightGauge = styled(Card)`
  border-right: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  background: transparent !important;

  .ant-card-cover {
    border: 1px solid #303030;
    ${glass}
  }

  .ant-card-body {
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #141414;
  }
`;

const Particles = styled(ParticlesTmpl)`
  background: transparent;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const ContentWrapper = styled(ContentWrapperTmpl)`
  .ant-typography {
    margin-bottom: 0;
  }
`;

const BottomBarWrapper = styled.div<any>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const BlurWrapper = styled(BlurWrapperTmpl)`
  margin-top: auto;
`;

const GraphTmpl = dynamic(() => import("../components/graph"), {
  ssr: false,
});
const Graph = forwardRef((props: any, ref) => (
  <GraphTmpl {...props} forwardRef={ref} />
));

export const LocationButton = styled(Button)`
  &:not(.ant-btn-loading) {
    > *:first-child {
      /* Visual centering of location arrow */
      margin-top: 0.35rem;
      width: 0.9rem !important;
    }
  }
`;

const TransparentLocationButton = styled(LocationButton)`
  background: transparent !important;
  backdrop-filter: none !important;
`;

const MainExpandButton = styled(Button)`
  background: transparent !important;
  backdrop-filter: none !important;
`;

const TitleSpace = styled(Space)`
  margin-left: -8px; // Visual centering to balance out the location button

  > *:first-child {
    margin-right: 4px !important;
  }
`;

export default Worker;
