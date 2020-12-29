import { Table } from "antd";
import styled from "styled-components";
import glass from "../styles/glass";

export default styled(Table)`
  .ant-table {
    border: 1px solid #303030;
    border-bottom: 0;
  }

  .ant-table,
  .ant-table-cell {
    ${glass}
  }
`;
