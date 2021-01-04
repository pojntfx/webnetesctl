import { Button, Card as CardTmpl } from "antd";
import styled from "styled-components";
import glass from "../styles/glass";

const Card = styled(CardTmpl)`
  background: transparent !important;

  .ant-card-cover {
    border: 1px solid #303030;
    ${glass}
  }

  .ant-card-body {
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #141414;
  }
`;

export const LeftGaugeToggler = styled.div`
  position: absolute;
  left: 0;
`;

export const RightGaugeToggler = styled.div`
  position: absolute;
  right: 0;
`;

export const LeftGaugeWrapper = styled.div<{ ref: any; $maximized: boolean }>`
  position: absolute;
  z-index: 100;
  left: 0;
  bottom: 0;

  ${(props) => (props.$maximized ? "z-index: 110;" : "")}
`;

export const LeftGaugeContent = styled(Card)<{ $maximized: boolean }>`
  border-left: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;

  ${(props) => (props.$maximized ? "border-top: 0;" : "")}
`;

export const RightGaugeWrapper = styled.div<{ ref: any; $maximized: boolean }>`
  position: absolute;
  z-index: 100;
  right: 0;
  bottom: 0;

  ${(props) => (props.$maximized ? "z-index: 110;" : "")}
`;

export const RightGaugeContent = styled(Card)<{ $maximized: boolean }>`
  border-right: 0;
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;

  ${(props) => (props.$maximized ? "border-top: 0;" : "")}
`;

export const LeftGaugeButton = styled(Button)`
  border: 1px solid #303030;
  border-left: none;
`;

export const RightGaugeButton = styled(Button)`
  border: 1px solid #303030;
  border-right: none;
`;
