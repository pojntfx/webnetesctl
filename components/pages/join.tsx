import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faBan,
  faCampground,
  faChevronDown,
  faChevronUp,
  faCity,
  faCogs,
  faCompress,
  faCube,
  faCubes,
  faExpand,
  faHandPeace,
  faLocationArrow,
  faMapMarkerAlt,
  faMobile,
  faRecordVinyl,
  faThumbsUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, notification, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import dynamic from "next/dynamic";
import Animate from "rc-animate";
import { forwardRef, useCallback, useEffect, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import ParticlesTmpl from "react-particles-js";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import SpriteText from "three-spritetext";
import { useWindowSize } from "use-window-size-hook";
import { IGraph } from "../../hooks/use-webnetes";
import glass from "../../styles/glass";
import { getColorForGraphGroup } from "../../styles/graph-group-color";
import { urldecodeYAMLAll, urlencodeYAMLAll } from "../../utils/urltranscode";
import { JoinFooterBar, JoinHeaderBar } from "../bars";
import { LocationButton as LocationButtonTmpl } from "../buttons";
import EditNodeConfigModal from "../edit-node-config-modal";
import {
  LeftGaugeButton,
  LeftGaugeContent,
  LeftGaugeToggler,
  LeftGaugeWrapper,
  RightGaugeButton,
  RightGaugeContent,
  RightGaugeToggler,
  RightGaugeWrapper,
} from "../gauges";
import {
  AfterWrapper,
  BlurWrapper as BlurWrapperTmpl,
  ContentWrapper as ContentWrapperTmpl,
} from "../layouts";
import { FocusedTitle, MainTitle } from "../typography";

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

export interface IJoinPageProps {
  network: IGraph;
  cluster: IGraph;
  resources: IGraph;
  refreshNodeLocation: () => void;
  nodeCoordinatesLoading: boolean;
  latitude: number;
  longitude: number;
  nodeAddress: string;
  nodeFlag: string;
}

/**
 * JoinPage is the "worker page"; it shows a worker of a cluster their current node status.
 *
 * Particles and music links have been added, making this a `de facto` start page option.
 */
export const JoinPage: React.FC<IJoinPageProps> = ({
  network,
  cluster,
  resources,
  refreshNodeLocation,
  nodeCoordinatesLoading,
  latitude,
  longitude,
  nodeAddress,
  nodeFlag,
  ...otherProps
}) => {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();
  const location = useLocation();
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

  // State
  const [nodeConfig, setNodeConfig] = useState<string>();

  const [rightGaugeOpen, setRightGaugeOpen] = useState(
    width ? (width > 821 ? true : false) : false
  );
  const [leftGaugeOpen, setLeftGaugeOpen] = useState(
    width ? (width > 821 ? true : false) : false
  );

  const [rightGaugeMaximized, setRightGaugeMaximized] = useState(false);
  const [leftGaugeMaximized, setLeftGaugeMaximized] = useState(false);

  const [clusterGraphOpen, setClusterGraphOpen] = useState(false);
  const [editNodeConfigModalOpen, setEditNodeConfigModalOpen] = useState(false);

  const [currentTitle, setCurrentTitle] = useState(-1);

  // Effects
  useEffect(() => {
    // Transition through the titles
    (async () => {
      await new Promise<void>((res) => setTimeout(() => res(), 1000));

      for (let i = 1; i <= 6; i++) {
        setCurrentTitle((curr) => curr + 1);

        await new Promise<void>((res) => setTimeout(() => res(), 5000));

        setCurrentTitle((curr) => curr + 1);

        await new Promise<void>((res) => setTimeout(() => res(), 500));

        // After the last title, link user to music
        if (i === 6) {
          await new Promise<void>((res) => setTimeout(() => res(), 2000));

          const key = "update";

          notification.open({
            message: t("lifeIsBetterWithMusic"),
            description: t("askForMusicDuringSharing"),
            btn: (
              <Space>
                <a href="https://lofimusic.app/" target="_blank">
                  <Button
                    onClick={async () => notification.close(key)}
                    type="primary"
                  >
                    <Space>
                      <FontAwesomeIcon icon={faRecordVinyl} />
                      {t("sure")}
                    </Space>
                  </Button>
                </a>

                <a
                  href="https://www.youtube.com/watch?v=qJIfavKyYvU"
                  target="_blank"
                >
                  <Button onClick={async () => notification.close(key)}>
                    <Space>
                      <FontAwesomeIcon icon={faCity} />
                      {t("iLovePhonk")}
                    </Space>
                  </Button>
                </a>

                <Button onClick={() => notification.close(key)}>
                  <Space>
                    <FontAwesomeIcon icon={faBan} />
                    {t("nope")}
                  </Space>
                </Button>
              </Space>
            ),
            duration: 0,
            onClose: () => notification.close(key),
            closeIcon: <FontAwesomeIcon icon={faTimes} />,
            key,
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    // Map the nodeConfig query parameter to state
    const rawNodeConfig = new URLSearchParams(location.search).get(
      "nodeConfig"
    );

    if (rawNodeConfig) {
      try {
        setNodeConfig(urldecodeYAMLAll(rawNodeConfig as string));
      } catch (e) {
        console.log("could not decode node config", e);
      }
    }
  }, [location.search]);

  const graphRef = useCallback((graph) => {
    // Zoom graph into view center
    if (graph) {
      setTimeout(() => graph.zoomToFit(500, 0), 500);
    }
  }, []);

  return (
    <AfterWrapper {...otherProps}>
      {/* Particles background */}
      <Particles params={particlesConfig} />

      {/* Node config editor */}
      <EditNodeConfigModal
        open={editNodeConfigModalOpen}
        onDone={(definition) => {
          setEditNodeConfigModalOpen(false);

          try {
            router.push(
              `/join?id=${new URLSearchParams(location.search).get(
                "id"
              )}&nodeConfig=${urlencodeYAMLAll(definition)}`
            );
          } catch (e) {
            console.error("could not parse definition", e);
          }
        }}
        onCancel={() => setEditNodeConfigModalOpen(false)}
        skipConfirmation
      />

      {/* Titles */}
      <MainTitleAnimator transitionName="fadeandzoom" transitionAppear>
        {currentTitle === 0 && (
          <MainTitle level={3} key="0">
            <FocusedTitle>
              <FontAwesomeIcon icon={faHandPeace} fixedWidth /> {t("welcome")}
            </FocusedTitle>{" "}
            {t("youveJoinedTheCluster")}
          </MainTitle>
        )}

        {currentTitle === 2 && (
          <MainTitle level={3} key="2">
            <FocusedTitle>
              <FontAwesomeIcon icon={faThumbsUp} fixedWidth />{" "}
              {t("thanksForKeepingThisTabOpen")}
            </FocusedTitle>{" "}
            {t("youreHelpingSomeone")}
          </MainTitle>
        )}

        {currentTitle === 4 && (
          <MainTitle level={3} key="4">
            <FontAwesomeIcon icon={faCubes} fixedWidth />{" "}
            {t("theGraphsBelowShowWhatYoureHosting")}
          </MainTitle>
        )}

        {currentTitle === 6 && (
          <MainTitle level={3} key="6">
            <FontAwesomeIcon icon={faCampground} fixedWidth />{" "}
            {t("enjoyYourStay")}
          </MainTitle>
        )}
      </MainTitleAnimator>

      {/* Header */}
      <JoinHeaderBar>
        <Logo alt={t("webnetesLogo")} src="/logo.svg" />

        <Tooltip title={t("advancedNodeConfig")} placement="left">
          <Button
            type="text"
            shape="circle"
            onClick={() => setEditNodeConfigModalOpen(true)}
          >
            <FontAwesomeIcon icon={faCogs} />
          </Button>
        </Tooltip>
      </JoinHeaderBar>

      {/* Cluster graph */}
      <ClusterGraphAnimator
        transitionName="fadeandzoom"
        transitionAppear
        $active={clusterGraphOpen}
      >
        {clusterGraphOpen && (
          <ClusterGraphWrapper>
            {/* TODO: Check why this graph throws parsing errors at times */}
            <Graph
              warmupTicks={500}
              graphData={cluster}
              backgroundColor="rgba(0,0,0,0)"
              showNavInfo={false}
              width={width}
              height={height}
              nodeThreeObject={(node: any) => {
                const sprite = new SpriteText(node.id?.toString());

                sprite.color = "#ffffff";
                sprite.textHeight = 2;
                sprite.backgroundColor =
                  getColorForGraphGroup(node.group) + "F0";
                sprite.padding = 2;

                return sprite;
              }}
              ref={graphRef}
            />
          </ClusterGraphWrapper>
        )}
      </ClusterGraphAnimator>

      {/* Footer */}
      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            <JoinFooterBar
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
              {/* Left gauge */}
              <LeftGaugeWrapper
                $maximized={leftGaugeMaximized}
                ref={leftGaugeRef}
              >
                <Animate transitionName="fadeandslideleft" transitionAppear>
                  {leftGaugeOpen && (
                    // Left gauge graph

                    <LeftGaugeContent
                      $maximized={leftGaugeMaximized}
                      cover={
                        <Graph
                          warmupTicks={500}
                          graphData={resources}
                          backgroundColor="rgba(0,0,0,0)"
                          showNavInfo={false}
                          width={
                            width
                              ? leftGaugeMaximized
                                ? width
                                : width > 821
                                ? 300
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
                          ref={graphRef}
                        />
                      }
                    >
                      <div ref={leftGaugeToolbarRef as any}>
                        <CardContentWrapper>
                          <div>
                            <Text strong>
                              <FontAwesomeIcon icon={faMobile} />{" "}
                              {
                                resources.nodes.filter(
                                  (node) => node.group !== 1 // No nodes here
                                ).length
                              }{" "}
                            </Text>
                            {t("resource", {
                              count: resources.nodes.filter(
                                (node) => node.group !== 1 // No nodes here
                              ).length,
                            })}
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
                        </CardContentWrapper>
                      </div>
                    </LeftGaugeContent>
                  )}
                </Animate>
              </LeftGaugeWrapper>

              {/* Left gauge toggler */}
              <LeftGaugeToggler>
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
              </LeftGaugeToggler>

              {/* Node metadata */}
              <Space direction="vertical" align="center">
                {/* Cluster graph toggler */}
                <ExpandButton
                  type="text"
                  shape="circle"
                  onClick={() =>
                    setClusterGraphOpen((open) => {
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
                        ? clusterGraphOpen
                          ? faChevronUp
                          : faChevronDown
                        : clusterGraphOpen
                        ? faChevronDown
                        : faChevronUp
                    }
                  />
                </ExpandButton>

                {/* Node IP */}
                <TitleWrapper align="center">
                  <LocationButton
                    onClick={refreshNodeLocation}
                    loading={nodeCoordinatesLoading}
                    type="text"
                    shape="circle"
                    icon={<FontAwesomeIcon icon={faLocationArrow} fixedWidth />}
                  />

                  <Title level={1}>
                    {new URLSearchParams(location.search).get("id")}
                  </Title>
                </TitleWrapper>

                {/* Node location */}
                <Text>
                  <Space>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <Tooltip
                      title={`${nodeAddress ? nodeAddress : t("notSet")}
                      ${nodeFlag ? " " + nodeFlag : ""}`}
                    >
                      {nodeAddress
                        ? nodeAddress
                            .split(", ")
                            .filter((_, i) => i <= 3)
                            .join(", ")
                        : t("notSet")}
                      {`${nodeFlag ? " " + nodeFlag : ""}`}
                    </Tooltip>
                  </Space>
                </Text>
              </Space>

              {/* Right gauge */}
              <RightGaugeWrapper
                $maximized={rightGaugeMaximized}
                ref={rightGaugeRef}
              >
                <Animate transitionName="fadeandslideright" transitionAppear>
                  {rightGaugeOpen && (
                    // Right gauge graph

                    <RightGaugeContent
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
                                ? 300
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
                          ref={graphRef}
                        />
                      }
                    >
                      <div ref={rightGaugeToolbarRef as any}>
                        <CardContentWrapper>
                          <div>
                            <Text strong>
                              <FontAwesomeIcon icon={faMobile} />{" "}
                              {network.nodes.length}{" "}
                            </Text>
                            {t("node", { count: network.nodes.length })}
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
                        </CardContentWrapper>
                      </div>
                    </RightGaugeContent>
                  )}
                </Animate>
              </RightGaugeWrapper>

              {/* Right gauge toggler */}
              <RightGaugeToggler>
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
              </RightGaugeToggler>
            </JoinFooterBar>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </AfterWrapper>
  );
};

// Animator components
const MainTitleAnimator = styled(Animate)`
  width: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ClusterGraphAnimator = styled(Animate)<{ $active: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  ${(props) => (props.$active ? "" : "pointer-events: none;")}
`;

// Particles components
const Particles = styled(ParticlesTmpl)`
  background: transparent;
  width: 100%;
  height: 100%;
  position: absolute;
`;

// Graph components
const GraphTmpl = dynamic(() => import("../graph"), {
  ssr: false,
});

const Graph = forwardRef((props: any, ref) => (
  <GraphTmpl {...props} forwardRef={ref} />
));

// Logo components
const Logo = styled.img`
  width: calc(200px - 2rem);
`;

// Wrapper components
const ContentWrapper = styled(ContentWrapperTmpl)`
  .ant-typography {
    margin-bottom: 0;
  }
`;

const BlurWrapper = styled(BlurWrapperTmpl)`
  margin-top: auto;
`;

const TitleWrapper = styled(Space)`
  margin-left: -8px; // Visual centering to balance out the location button

  > *:first-child {
    margin-right: 4px !important;
  }
`;

const CardContentWrapper = styled(Space)`
  width: 100%;
  justify-content: space-between;
`;

const ClusterGraphWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${glass}
`;

// Button components
const LocationButton = styled(LocationButtonTmpl)`
  background: transparent !important;
  backdrop-filter: none !important;
`;

const ExpandButton = styled(Button)`
  background: transparent !important;
  backdrop-filter: none !important;
`;
