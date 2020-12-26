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
import { Button, Dropdown, List, Menu, Popover, Space, Typography } from "antd";
import Layout, { Content, Header as HeaderTmpl } from "antd/lib/layout/layout";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function HomePage() {
  const { t } = useTranslation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <Layout>
        <Header>
          <MainSpace split>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["overview"]}
            >
              <Menu.Item
                icon={<FontAwesomeIcon icon={faGlobe} />}
                key="overview"
              >
                {t("overview")}
              </Menu.Item>
              <Menu.Item
                icon={<FontAwesomeIcon icon={faBinoculars} />}
                key="explorer"
              >
                {t("explorer")}
              </Menu.Item>
              <Menu.Item icon={<FontAwesomeIcon icon={faCogs} />} key="config">
                {t("config")}
              </Menu.Item>
            </Menu>

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
          </MainSpace>
        </Header>
        <Content>
          <Typography>
            <Title level={1}>Hello, world!</Title>

            <Paragraph>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              at aliquam, nobis est voluptates magnam blanditiis a delectus.
              Nesciunt odit minus esse debitis molestias voluptate voluptatem
              sapiente, corporis suscipit officia.
            </Paragraph>
          </Typography>
        </Content>
      </Layout>
    </>
  );
}

const Header = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
`;

const MainSpace = styled(Space)`
  width: 100%;
  justify-content: space-between;
`;

export default HomePage;
