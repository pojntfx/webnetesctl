import { Table as TableTmpl } from "antd";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Wrapper } from "../components/layout-wrapper";
import glass from "../styles/glass";

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
    <Wrapper>
      <Title level={2}>{t("node", { count: 2 })}</Title>

      <Table dataSource={dataSource} columns={columns} />
    </Wrapper>
  );
}

const Table = styled(TableTmpl)`
  .ant-table {
    border: 1px solid #303030;
    border-bottom: 0;
  }

  .ant-table,
  .ant-table-cell {
    ${glass}
  }
`;

export default Explorer;
