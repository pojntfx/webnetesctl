import { faChevronUp, faMobile } from "@fortawesome/free-solid-svg-icons";
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
import composite from "../data/composite.json";
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
            <Graph
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
            />

            <BottomBarWrapper ref={bottomBarRef}>
              <Graph
                graphData={localResources}
                backgroundColor="rgba(0,0,0,0)"
                showNavInfo={false}
                width={256}
                height={200}
                nodeThreeObject={(node: any) => {
                  const sprite = new SpriteText(node.id?.toString());

                  sprite.color = "#ffffff";
                  sprite.textHeight = 6; // TODO: Set by group
                  sprite.backgroundColor = "rgba(0,0,0,0.5)"; // TODO: Set by group
                  sprite.padding = 2;

                  return sprite;
                }}
                ref={resourceGraphRef}
              />

              <Title level={1}>{router.query.id}</Title>

              <Card
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
              </Card>
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

export default Worker;
