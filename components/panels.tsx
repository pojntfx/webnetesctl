import { Card } from "antd";
import styled from "styled-components";
import glass from "../styles/glass";

export const InspectorPanel = styled(Card)`
  position: absolute;
  height: calc(100% - 64px - 64px); // Top & bottom menus
  overflow-y: auto;
  min-width: 20rem;
  top: 64px;
  border: 0;
  left: 0;
  right: 0;
  margin: 0;
  ${glass}
  max-width: 100%;

  .ant-card-head {
    border-bottom: 0;
  }

  .ant-card-body {
    padding: 0;
  }

  @media screen and (min-width: 812px) {
    height: calc(100% - 64px - 2rem); // Navbar & self-margins
    border: 1px solid #303030;
    left: auto;
    right: 50px;
    margin: 1rem;
    margin-right: 0;
    max-width: calc(5rem * 5);
  }
`;

export const StatsPanel = styled(Card)`
  position: absolute;
  // The last part is the bottom toolbar
  max-height: calc(100% - 64px - 64px); // Top & bottom menus
  min-width: calc(5rem * 3); // NavigationButton * 3
  overflow-y: auto;
  bottom: 64px;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  left: 0;
  right: 0;
  margin: 0;

  .ant-card-head {
    border-bottom: 0;
  }

  .ant-card-body {
    padding: 0;
  }

  ${glass}

  @media screen and (min-width: 812px) {
    top: 64px;
    left: 50px;
    right: auto;
    bottom: auto;
    border: 1px solid #303030;
    max-height: calc(100% - 64px - 2rem - 32px - 1rem);
    margin: 1rem;
    margin-left: 0;
  }
`;
