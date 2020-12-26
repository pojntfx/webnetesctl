import {
  faGlobe,
  faHandshake,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, Space as SpaceTmpl, Typography } from "antd";
import Layout, { Content, Header as HeaderTmpl } from "antd/lib/layout/layout";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header>
        <Space split>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["overview"]}
          >
            <Menu.Item icon={<FontAwesomeIcon icon={faGlobe} />} key="overview">
              {t("overview")}
            </Menu.Item>
          </Menu>

          <SpaceTmpl>
            <Button>
              <Space>
                <FontAwesomeIcon icon={faPlus} />
                {t("create")}
              </Space>
            </Button>

            <Button type="primary">
              <Space>
                <FontAwesomeIcon icon={faHandshake} />
                {t("invite")}
              </Space>
            </Button>
          </SpaceTmpl>
        </Space>
      </Header>
      <Content>
        <Typography>
          <Title level={1}>Hello, world!</Title>

          <Paragraph>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus at
            aliquam, nobis est voluptates magnam blanditiis a delectus. Nesciunt
            odit minus esse debitis molestias voluptate voluptatem sapiente,
            corporis suscipit officia.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
}

const Header = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
`;

const Space = styled(SpaceTmpl)`
  width: 100%;
  justify-content: space-between;
`;

export default HomePage;
