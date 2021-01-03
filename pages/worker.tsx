import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronDown,
  faChevronUp,
  faCogs,
  faCompress,
  faCube,
  faExpand,
  faLocationArrow,
  faMapMarkerAlt,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card as CardTmpl, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Animate from "rc-animate";
import { forwardRef, useCallback, useEffect, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import ParticlesTmpl from "react-particles-js";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { useWindowSize } from "use-window-size-hook";
import EditNodeConfigModal from "../components/edit-node-config-modal";
import composite from "../data/composite.json";
import localResources from "../data/local-resources.json";
import network from "../data/network.json";
import glass from "../styles/glass";
import { urldecodeYAMLAll, urlencodeYAMLAll } from "../utils/urltranscode";
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
  const { width, height } = useWindowSize();
  const { ref: bottomBarRef, height: bottomBarHeight } = useDimensions();
  const { ref: rightGaugeRef, height: rightGaugeHeight } = useDimensions();
  const { ref: leftGaugeRef, height: leftGaugeHeight } = useDimensions();
  const {
    ref: rightGaugeToolbarRef,
    height: rightGaugeToolbarHeight,
  } = useDimensions();
  const {
    ref: leftGaugeToolbarRef,
    height: leftGaugeToolbarHeight,
  } = useDimensions();

  const [nodeConfig, setNodeConfig] = useState<string>();
  const [rightGaugeOpen, setRightGaugeOpen] = useState(
    width ? (width > 821 ? true : false) : false
  );
  const [leftGaugeOpen, setLeftGaugeOpen] = useState(
    width ? (width > 821 ? true : false) : false
  );
  const [compositeGraphOpen, setCompositeGraphOpen] = useState(false);
  const [rightGaugeMaximized, setRightGaugeMaximized] = useState(false);
  const [leftGaugeMaximized, setLeftGaugeMaximized] = useState(false);
  const [editNodeConfigModalOpen, setEditNodeConfigModalOpen] = useState(false);

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
      setTimeout(() => graph.zoomToFit(500, 0), 500);
    }
  }, []);

  const resourceGraphRef = useCallback((graph) => {
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 500);
    }
  }, []);

  const compositeGraphRef = useCallback((graph) => {
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 500);
    }
  }, []);

  return (
    <Wrapper>
      <Particles params={particlesConfig} />

      <EditNodeConfigModal
        open={editNodeConfigModalOpen}
        onDone={(definition) => {
          setEditNodeConfigModalOpen(false);

          try {
            router.push(
              `/worker?id=127.0.2&nodeConfig=${urlencodeYAMLAll(definition)}`
            );
          } catch (e) {
            console.error("could not parse definition", e);
          }
        }}
        onCancel={() => setEditNodeConfigModalOpen(false)}
      />

      <HeaderBar>
        <LogoImage alt={t("webnetesLogo")} src="/logo.svg" />

        <Tooltip title={t("advancedNodeConfig")} placement="left">
          <Button
            type="text"
            shape="circle"
            onClick={() => setEditNodeConfigModalOpen(true)}
          >
            <FontAwesomeIcon icon={faCogs} />
          </Button>
        </Tooltip>
      </HeaderBar>

      <CompositeGraphAnimate
        transitionName="fadeandzoom"
        transitionAppear
        $active={compositeGraphOpen}
      >
        {compositeGraphOpen && (
          <CompositeGraphWrapper>
            <Graph
              warmupTicks={500}
              graphData={composite}
              backgroundColor="rgba(0,0,0,0)"
              showNavInfo={false}
              width={width}
              height={height}
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
          </CompositeGraphWrapper>
        )}
      </CompositeGraphAnimate>

      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            <BottomBarWrapper
              ref={bottomBarRef}
              $padding={(() => {
                const leftHeight =
                  leftGaugeHeight && (leftGaugeHeight - bottomBarHeight) / 2;
                const rightHeight =
                  rightGaugeHeight && (rightGaugeHeight - bottomBarHeight) / 2;

                if (width && width > 821) {
                  if (rightGaugeMaximized) {
                    if (leftHeight) {
                      return leftHeight;
                    } else {
                      return 0;
                    }
                  } else if (leftGaugeMaximized) {
                    if (rightHeight) {
                      return rightHeight;
                    } else {
                      return 0;
                    }
                  } else {
                    return leftHeight < rightHeight
                      ? leftHeight || rightHeight
                      : rightHeight || leftHeight;
                  }
                } else {
                  return 0;
                }
              })()}
            >
              <LeftGaugeWrapper
                $maximized={leftGaugeMaximized}
                ref={leftGaugeRef}
              >
                <Animate transitionName="fadeandslideleft" transitionAppear>
                  {leftGaugeOpen && (
                    <LeftGauge
                      $maximized={leftGaugeMaximized}
                      cover={
                        <Graph
                          warmupTicks={500}
                          graphData={localResources}
                          backgroundColor="rgba(0,0,0,0)"
                          showNavInfo={false}
                          width={
                            width
                              ? leftGaugeMaximized
                                ? width
                                : width > 821
                                ? 256
                                : width
                              : 0
                          }
                          height={
                            leftGaugeMaximized
                              ? height
                                ? height - leftGaugeToolbarHeight
                                : 0
                              : 200
                          }
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
                      <CardSpaceWrapper ref={leftGaugeToolbarRef}>
                        <CardSpace>
                          <div>
                            <Text strong>
                              <FontAwesomeIcon icon={faMobile} /> 16{" "}
                            </Text>
                            {t("resource", { count: 16 })}
                          </div>

                          <Space>
                            <Button
                              type="text"
                              shape="circle"
                              onClick={() => {
                                setLeftGaugeMaximized((maximized) => {
                                  if (!maximized) {
                                    setRightGaugeMaximized(false); // Only one gauge can ever be maximized
                                  }

                                  return !maximized;
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  leftGaugeMaximized ? faCompress : faExpand
                                }
                              />
                            </Button>

                            <Button
                              type="text"
                              shape="circle"
                              onClick={() => setLeftGaugeOpen(false)}
                            >
                              <FontAwesomeIcon icon={faAngleDoubleLeft} />
                            </Button>
                          </Space>
                        </CardSpace>
                      </CardSpaceWrapper>
                    </LeftGauge>
                  )}
                </Animate>
              </LeftGaugeWrapper>

              <LeftGaugeToggle>
                {!leftGaugeOpen && (
                  <LeftGaugeButton
                    type="text"
                    onClick={() => setLeftGaugeOpen(true)}
                  >
                    <Text strong>
                      <FontAwesomeIcon icon={faCube} /> 16
                    </Text>
                  </LeftGaugeButton>
                )}
              </LeftGaugeToggle>

              <Space direction="vertical" align="center">
                <MainExpandButton
                  type="text"
                  shape="circle"
                  onClick={() =>
                    setCompositeGraphOpen((open) => {
                      if (!open) {
                        unstable_batchedUpdates(() => {
                          setLeftGaugeOpen(false);
                          setRightGaugeOpen(false);
                        });
                      } else {
                        if (width && width > 812) {
                          unstable_batchedUpdates(() => {
                            setLeftGaugeOpen(true);
                            setRightGaugeOpen(true);
                          });
                        }
                      }

                      return !open;
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      width && width > 821
                        ? compositeGraphOpen
                          ? faChevronUp
                          : faChevronDown
                        : compositeGraphOpen
                        ? faChevronDown
                        : faChevronUp
                    }
                  />
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

              <RightGaugeWrapper
                $maximized={rightGaugeMaximized}
                ref={rightGaugeRef}
              >
                <Animate transitionName="fadeandslideright" transitionAppear>
                  {rightGaugeOpen && (
                    <RightGauge
                      $maximized={rightGaugeMaximized}
                      cover={
                        <Graph
                          warmupTicks={500}
                          graphData={network}
                          backgroundColor="rgba(0,0,0,0)"
                          showNavInfo={false}
                          width={
                            width
                              ? rightGaugeMaximized
                                ? width
                                : width > 821
                                ? 256
                                : width
                              : 0
                          }
                          height={
                            rightGaugeMaximized
                              ? height
                                ? height - rightGaugeToolbarHeight
                                : 0
                              : 200
                          }
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
                      <CardSpaceWrapper ref={rightGaugeToolbarRef}>
                        <CardSpace>
                          <div>
                            <Text strong>
                              <FontAwesomeIcon icon={faMobile} /> 4{" "}
                            </Text>
                            {t("node", { count: 4 })}
                          </div>

                          <Space>
                            <Button
                              type="text"
                              shape="circle"
                              onClick={() => {
                                setRightGaugeMaximized((maximized) => {
                                  if (!maximized) {
                                    setLeftGaugeMaximized(false); // Only one gauge can ever be maximized
                                  }

                                  return !maximized;
                                });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  rightGaugeMaximized ? faCompress : faExpand
                                }
                              />
                            </Button>

                            <Button
                              type="text"
                              shape="circle"
                              onClick={() => setRightGaugeOpen(false)}
                            >
                              <FontAwesomeIcon icon={faAngleDoubleRight} />
                            </Button>
                          </Space>
                        </CardSpace>
                      </CardSpaceWrapper>
                    </RightGauge>
                  )}
                </Animate>
              </RightGaugeWrapper>

              <RightGaugeToggle>
                {!rightGaugeOpen && (
                  <RightGaugeButton
                    type="text"
                    onClick={() => setRightGaugeOpen(true)}
                  >
                    <Text strong>
                      <FontAwesomeIcon icon={faMobile} /> 4
                    </Text>
                  </RightGaugeButton>
                )}
              </RightGaugeToggle>
            </BottomBarWrapper>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </Wrapper>
  );
}

const CardSpaceWrapper = styled.div<any>``;

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

const LeftGaugeToggle = styled.div`
  position: absolute;
  left: 0;
`;

const RightGaugeToggle = styled.div`
  position: absolute;
  right: 0;
`;

const LeftGaugeWrapper = styled.div<{ ref: any; $maximized: boolean }>`
  position: absolute;
  z-index: 100;
  left: 0;
  bottom: 0;

  ${(props) => (props.$maximized ? "z-index: 110;" : "")}
`;

const LeftGauge = styled(Card)<{ $maximized: boolean }>`
  border-left: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;

  ${(props) => (props.$maximized ? "border-top: 0;" : "")}
`;

const RightGaugeWrapper = styled.div<{ ref: any; $maximized: boolean }>`
  position: absolute;
  z-index: 100;
  right: 0;
  bottom: 0;

  ${(props) => (props.$maximized ? "z-index: 110;" : "")}
`;

const RightGauge = styled(Card)<{ $maximized: boolean }>`
  border-right: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;

  ${(props) => (props.$maximized ? "border-top: 0;" : "")}
`;

const LeftGaugeButton = styled(Button)`
  border: 1px solid #303030;
  border-left: none;
`;

const RightGaugeButton = styled(Button)`
  border: 1px solid #303030;
  border-right: none;
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

const BottomBarWrapper = styled.div<{
  $padding: number | undefined;
  ref: any;
}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-bottom: 2rem;
  padding-top: 2rem;
  transition: all 0.5s ease-out;

  ${(props) =>
    props.$padding
      ? `padding-bottom: ${props.$padding}px; padding-top: ${props.$padding}px;`
      : ""}
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

const CompositeGraphAnimate = styled(Animate)<{ $active: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  ${(props) => (props.$active ? "" : "pointer-events: none;")}
`;

const CompositeGraphWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${glass}
`;

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

const HeaderBar = styled(Space)`
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;

  &::after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    ${glass}
    pointer-events: none;
    -webkit-mask-image: -webkit-gradient(
      linear,
      left 0%,
      left 100%,
      color-stop(100%, rgba(0, 0, 0, 0)),
      color-stop(80%, rgba(0, 0, 0, 0.7)),
      color-stop(50%, rgba(0, 0, 0, 1)),
      color-stop(20%, rgba(0, 0, 0, 0.7)),
      color-stop(0%, rgba(0, 0, 0, 0))
    );
    transform: scaleY(1.5);
  }

  * {
    position: relative;
    z-index: 110;
  }

  > *:first-child {
    margin-left: 1rem;
  }

  > *:last-child {
    margin-right: 1rem;
  }
`;

const LogoImage = styled.img`
  width: calc(256px - 2rem);
`;

export default Worker;
