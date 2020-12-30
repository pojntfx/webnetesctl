import styled from "styled-components";
import LayoutTmpl from "antd/lib/layout/layout";

export const Wrapper = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin: 12px 16px;
  margin-top: 64px;

  @media screen and (min-width: 812px) {
    margin-left: 50px;
    margin-right: 50px;
    margin-bottom: 64px;
  }
`;

export const Layout = styled(LayoutTmpl)`
  background: transparent;
`;
