import { Button, List, Space } from "antd";
import styled from "styled-components";

export const ResourceList = styled(Space)`
  padding: 12px 16px;
  width: 100%;
`;

export const ResourceItem = styled(List.Item)`
  transition: background 0.3s;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: none !important;
  position: relative;

  & :after {
    /* Polyfill border with margin */
    content: "";
    position: absolute;
    width: calc(100% - 32px);
    background: #303030;
    height: 1px;
    bottom: 0;
  }

  :hover {
    background: #262626;
    cursor: pointer;
  }

  .ant-list-item-action {
    margin-left: 1rem;
  }
`;
