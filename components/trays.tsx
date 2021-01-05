import styled from "styled-components";
import glass from "../styles/glass";

export const AppTray = styled.div`
  z-index: 999;
  position: absolute !important;
  bottom: 64px;
  border: 1px solid #303030;
  margin: 1rem;
  left: 0;
  right: auto;
  display: flex;
  align-items: center;
  ${glass}

  @media screen and (min-width: 812px) {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin-right: 0;
    margin-left: 0;
  }
`;

export const OverviewTray = styled.div`
  position: absolute !important;
  bottom: 64px;
  border: 1px solid #303030;
  margin: 1rem;
  right: 0;
  ${glass}

  @media screen and (min-width: 812px) {
    bottom: 0;
    left: 50px;
    right: auto;
    margin-left: 0;
  }

  > *:first-child:not(:last-child) {
    border-right: 1px solid #303030;
  }
`;
