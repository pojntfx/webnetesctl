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
import universeTexture from "three-globe/example/img/night-sky.png";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

function HomePage() {
  const { t } = useTranslation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    typeof window !== "undefined" &&
      setWindowHeight(document.querySelector("body")!.clientHeight - 64);
  }, []);

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
            globeImageUrl={earthTexture as string}
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
