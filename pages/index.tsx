import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Typography } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["overview"]}>
          <Menu.Item icon={<FontAwesomeIcon icon={faGlobe} />} key="overview">
            {t("overview")}
          </Menu.Item>
        </Menu>
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

export default HomePage;
