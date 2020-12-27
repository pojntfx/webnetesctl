import {
  faBell,
  faBinoculars,
  faCaretDown,
  faCogs,
  faCube,
  faFile,
  faGlobe,
  faHandshake,
  faNetworkWired,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Input, List, Menu, Popover, Space } from "antd";
import Layout, { Content, Header as HeaderTmpl } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import earthTexture from "three-globe/example/img/earth-night.jpg";
import earthElevation from "three-globe/example/img/earth-topology.png";
import universeTexture from "three-globe/example/img/night-sky.png";
import nodes from "../data/nodes.json";
import connections from "../data/connections.json";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

function HomePage() {
  const { t } = useTranslation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    typeof window !== "undefined" &&
      setWindowHeight(document.querySelector("body")!.clientHeight - 64);
  }, []);

  const connectionPaths = [
    ...connections.management.map((conn) => ({
      coords: conn,
      properties: { name: "Management", color: "#fa8c16" },
    })),
    ...connections.application.map((conn) => ({
      coords: conn,
      properties: { name: "Application", color: "#1890ff" },
    })),
  ];

  return (
    <>
      <Layout>
        <Header>
          <NavigationBar>
            <NavigationMenu>
              <NavigationButton type="primary">
                <FontAwesomeIcon size="lg" icon={faGlobe} fixedWidth />
                {t("overview")}
              </NavigationButton>

              <NavigationButton type="text">
                <FontAwesomeIcon size="lg" icon={faBinoculars} fixedWidth />
                {t("explorer")}
              </NavigationButton>

              <NavigationButton type="text">
                <FontAwesomeIcon size="lg" icon={faCogs} fixedWidth />
                {t("config")}
              </NavigationButton>
            </NavigationMenu>

            <SearchInput placeholder={t("findNodeOrResource")} />

            <Space>
              <Popover
                title={t("notifications")}
                trigger="click"
                visible={notificationsOpen}
                onVisibleChange={(open) => setNotificationsOpen(open)}
                content={
                  <List>
                    <List.Item>Example notification 1</List.Item>
                    <List.Item>Example notification 2</List.Item>
                  </List>
                }
              >
                <Button
                  type="text"
                  shape="circle"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <FontAwesomeIcon icon={faBell} />
                </Button>
              </Popover>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="resource">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faCube} />
                        {t("resource")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="cluster">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faNetworkWired} />
                        {t("cluster")}
                      </Space>
                    </Menu.Item>
                    <Menu.Item key="file">
                      <Space>
                        <FontAwesomeIcon fixedWidth icon={faFile} />
                        {t("file")}
                      </Space>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <Space>
                    <FontAwesomeIcon icon={faPlus} />
                    {t("create")}
                    <FontAwesomeIcon icon={faCaretDown} />
                  </Space>
                </Button>
              </Dropdown>

              <Button type="primary">
                <Space>
                  <FontAwesomeIcon icon={faHandshake} />
                  {t("invite")}
                </Space>
              </Button>
            </Space>
          </NavigationBar>
        </Header>
        <Content>
          <Globe
            labelsData={nodes}
            labelLat={(d) => (d as typeof nodes[0]).latitude}
            labelLng={(d) => (d as typeof nodes[0]).longitude}
            labelText={(d) => {
              const node = d as typeof nodes[0];

              return `${node.privateIP} (${node.location}, ${node.publicIP})`;
            }}
            labelSize={(d) => Math.sqrt((d as typeof nodes[0]).size) * 4e-4}
            labelDotRadius={(d) =>
              Math.sqrt((d as typeof nodes[0]).size) * 4e-4
            }
            labelColor={() => "rgba(255, 165, 0, 0.75)"}
            onLabelClick={(label) => console.log("Clicked", label)}
            pathsData={connectionPaths}
            pathPoints="coords"
            pathPointLat={(c) => c[1]}
            pathPointLng={(c) => c[0]}
            pathLabel={(c: any) => c.properties.name}
            pathColor={(c: any) => c.properties.color}
            pathDashLength={0.1}
            pathDashGap={0.008}
            pathDashAnimateTime={12000}
            globeImageUrl={earthTexture as string}
            bumpImageUrl={earthElevation as string}
            backgroundImageUrl={universeTexture as string}
            height={windowHeight}
          />
        </Content>
      </Layout>
    </>
  );
}

const Header = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
`;

const NavigationBar = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationMenu = styled.div`
  height: 100%;
  display: flex;
`;

const NavigationButton = styled(Button)`
  width: 5rem;
  height: 100% !important;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SearchInput = styled(Input.Search)`
  max-width: 22.5rem;
`;

export default HomePage;
