import { Button } from "antd";
import styled from "styled-components";

export const LocationButton: any = styled(Button)`
  &:not(.ant-btn-loading) {
    > *:first-child {
      /* Visual centering of location arrow */
      margin-top: 0.35rem;
      width: 0.9rem !important;
    }
  }
`;
