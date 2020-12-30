import { Table } from "antd";
import styled from "styled-components";

export default styled(Table)`
  .ant-table {
    border: 1px solid #303030;
    border-bottom: 0;
  }

  .ant-table-expanded-row {
    background: #2f2f2f;

    > td {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .ant-table-row:hover {
    cursor: pointer;
  }
`;
