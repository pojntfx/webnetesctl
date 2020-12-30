import styled from "styled-components";
import LayoutTmpl from "antd/lib/layout/layout";

export const Wrapper = styled.div`
  padding-top: calc(1rem + 64px);
  padding-bottom: calc(1rem + 64px);
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  overflow-y: auto;

  @media screen and (min-width: 812px) {
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 1rem;
  }
`;

export const Layout = styled(LayoutTmpl)`
  background: transparent;
`;
