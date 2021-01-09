import { faCogs, faHandshake, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Input, Menu, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import Animate from "rc-animate";
import { createRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { CLUSTER_ID_TEMPLATE_KEY } from "../../data/node-config";
import bg from "../../img/fernando-rodrigues-sGJUb5HJBqs-unsplash.jpg";
import glass from "../../styles/glass";
import { urlencodeYAMLAll } from "../../utils/urltranscode";
import EditNodeConfigModal from "../edit-node-config-modal";

export interface IHomePageProps {
  nodeConfig: string;
}

/**
 * HomePage is the central starting point for webnetes.
 *
 * There are two CTAs: "Create cluster" and "Join cluster", which link to CreatedPage and JoinPage respectively.
 */
export const HomePage: React.FC<IHomePageProps> = ({
  nodeConfig,
  ...otherProps
}) => {
  // Hooks
  const { t } = useTranslation();
  const router = useHistory();

  // State
  const [clusterId, setClusterId] = useState<string>();
  const [newClusterId, setNewClusterId] = useState<string>();
  const [editNodeConfigModalOpen, setEditNodeConfigModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(false);

  // Refs
  const newClusterIdRef = createRef<Input>();
  const clusterIdRef = createRef<Input>();

  return (
    <HomeAfterWrapper {...otherProps}>
      <HomeBlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <div>
            {/* Node config editor */}
            <EditNodeConfigModal
              open={editNodeConfigModalOpen}
              onDone={(definition) => {
                setEditNodeConfigModalOpen(false);

                try {
                  if (editingWorker) {
                    router.push(
                      `/join?nodeConfig=${urlencodeYAMLAll(
                        definition.replace(CLUSTER_ID_TEMPLATE_KEY, clusterId!) // Checked before opening modal
                      )}`
                    );
                  } else {
                    router.push(
                      `/created?nodeConfig=${urlencodeYAMLAll(
                        definition.replace(
                          CLUSTER_ID_TEMPLATE_KEY,
                          newClusterId! // Checked before opening modal
                        )
                      )}`
                    );
                  }
                } catch (e) {
                  console.error("could not parse definition", e);
                }
              }}
              onCancel={() => {
                unstable_batchedUpdates(() => {
                  setEditingWorker(false);
                  setEditNodeConfigModalOpen(false);
                });
              }}
              nodeConfig={nodeConfig}
            />

            {/* Logo */}
            <Logo alt={t("webnetesLogo")} src="/logo.svg" />

            {/* Actions */}
            <ActionSplit>
              <div>
                {/* Create cluster action */}
                <Action direction="vertical" align="center">
                  <ActionIcon icon={faPlus} size="3x" />

                  <Text strong>{t("createClusterIntro")}</Text>

                  <Text>{t("createClusterDescription")}</Text>

                  <Space>
                    <Tooltip
                      title={t("newClusterIdDescription")}
                      placement="bottom"
                    >
                      <Input
                        placeholder={t("newClusterId")}
                        value={newClusterId}
                        onChange={(e) => setNewClusterId(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (newClusterId) {
                              router.push(
                                `/created?nodeConfig=${urlencodeYAMLAll(
                                  nodeConfig.replace(
                                    CLUSTER_ID_TEMPLATE_KEY,
                                    newClusterId
                                  )
                                )}`
                              );
                            } else {
                              newClusterIdRef.current?.focus();
                            }
                          }
                        }}
                        required
                        ref={newClusterIdRef}
                      />
                    </Tooltip>

                    <Dropdown.Button
                      onClick={() => {
                        if (newClusterId) {
                          router.push(
                            `/created?nodeConfig=${urlencodeYAMLAll(
                              nodeConfig.replace(
                                CLUSTER_ID_TEMPLATE_KEY,
                                newClusterId
                              )
                            )}`
                          );
                        } else {
                          newClusterIdRef.current?.focus();
                        }
                      }}
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="cluster"
                            onClick={() => {
                              if (newClusterId) {
                                unstable_batchedUpdates(() => {
                                  setEditingWorker(false);
                                  setEditNodeConfigModalOpen(true);
                                });
                              } else {
                                newClusterIdRef.current?.focus();
                              }
                            }}
                          >
                            <Space>
                              <FontAwesomeIcon fixedWidth icon={faCogs} />
                              {t("advancedNodeConfig")}
                            </Space>
                          </Menu.Item>
                        </Menu>
                      }
                      type="primary"
                    >
                      {t("createCluster")}
                    </Dropdown.Button>
                  </Space>
                </Action>

                {/* Main divider */}
                <MainDivider>
                  <MainDividerPart />

                  <span>{t("or")}</span>

                  <MainDividerPart />
                </MainDivider>

                {/* Join cluster action */}
                <Action direction="vertical" align="center">
                  <ActionIcon icon={faHandshake} size="3x" />

                  <Text strong>{t("joinClusterIntro")}</Text>

                  <Text>{t("joinClusterDescription")}</Text>

                  <Space>
                    <Tooltip
                      title={t("clusterIdDescription")}
                      placement="bottom"
                    >
                      <Input
                        placeholder={t("clusterId")}
                        value={clusterId}
                        onChange={(e) => setClusterId(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (clusterId) {
                              router.push(
                                `/join?nodeConfig=${urlencodeYAMLAll(
                                  nodeConfig.replace(
                                    CLUSTER_ID_TEMPLATE_KEY,
                                    clusterId
                                  )
                                )}`
                              );
                            } else {
                              clusterIdRef.current?.focus();
                            }
                          }
                        }}
                        required
                        ref={clusterIdRef}
                      />
                    </Tooltip>

                    <Dropdown.Button
                      onClick={() => {
                        if (clusterId) {
                          router.push(
                            `/join?nodeConfig=${urlencodeYAMLAll(
                              nodeConfig.replace(
                                CLUSTER_ID_TEMPLATE_KEY,
                                clusterId
                              )
                            )}`
                          );
                        } else {
                          clusterIdRef.current?.focus();
                        }
                      }}
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="cluster"
                            onClick={() => {
                              if (clusterId) {
                                unstable_batchedUpdates(() => {
                                  setEditingWorker(true);
                                  setEditNodeConfigModalOpen(true);
                                });
                              } else {
                                clusterIdRef.current?.focus();
                              }
                            }}
                          >
                            <Space>
                              <FontAwesomeIcon fixedWidth icon={faCogs} />
                              {t("advancedNodeConfig")}
                            </Space>
                          </Menu.Item>
                        </Menu>
                      }
                      type="primary"
                    >
                      {t("joinCluster")}
                    </Dropdown.Button>
                  </Space>
                </Action>
              </div>
            </ActionSplit>
          </div>
        </Animate>
      </HomeBlurWrapper>
    </HomeAfterWrapper>
  );
};

// Wrapper components
const HomeAfterWrapper = styled.div`
  background: url(${bg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      black,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      black
    );
    pointer-events: none;
  }

  > * {
    width: 100%;
  }
`;

const HomeBlurWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 4rem; // Visual centering offset for logo

  .ant-input,
  .ant-btn {
    ${glass}
  }

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
    z-index: 10;
  }
`;

// Logo components
const Logo = styled.img`
  position: relative;
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-right: 1rem;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
  max-height: 10rem;
`;

// Action components
const ActionSplit = styled.div`
  position: relative;
  width: 100%;

  > * {
    padding-left: 1rem;
    padding-right: 1rem;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    align-items: center;
    justify-items: center;
    max-width: 45rem;
    margin-bottom: 2rem;

    .ant-btn-primary {
      box-shadow: none !important;

      &:last-child:not(:first-child) {
        border-color: rgb(67, 67, 67) !important;
        border-left: 0;
      }

      &:first-child {
        background: #177ddc94 !important;

        &:hover {
          background: #177ddc !important;
        }
      }
    }

    @media screen and (min-width: 812px) {
      grid-template-columns: 6fr 1fr 6fr;
    }
  }
`;

const Action = styled(Space)`
  text-align: center;

  > *:last-child {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;

const ActionIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
`;

// Divider components
const MainDivider = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > *:not(:first-child):not(:last-child) {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  > *:first-child,
  > *:last-child {
    flex: 1;
  }

  @media screen and (min-width: 812px) {
    height: 100%;
    flex-direction: column;

    > *:not(:first-child):not(:last-child) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
`;

const MainDividerPart = styled.div`
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.85) !important;

  @media screen and (min-width: 812px) {
    border-right: 0.5px solid rgba(255, 255, 255, 0.85) !important;
  }
`;
