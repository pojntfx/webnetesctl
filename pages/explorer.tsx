import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";
import { Wrapper } from "../components/layout-wrapper";
import Table from "../components/table";
import Animate from "rc-animate";

function Explorer() {
  const { t } = useTranslation();

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <Animate transitionName="fadeandzoom" transitionAppear>
      <Wrapper>
        <Title level={2}>{t("node", { count: 2 })}</Title>
        <Table dataSource={dataSource} columns={columns} />
      </Wrapper>
    </Animate>
  );
}

export default Explorer;
