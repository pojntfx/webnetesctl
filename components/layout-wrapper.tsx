import { Space } from "antd";
import LayoutTmpl from "antd/lib/layout/layout";
import styled from "styled-components";
import bg from "../img/night-sky.png";
import glass from "../styles/glass";

export const Wrapper = styled.div`
  background: url(${bg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
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

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BlurWrapper = styled.div`
  width: 100%;
  position: relative;

  .ant-input,
  .ant-btn {
    ${glass}
  }

  &::after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    ${glass}
    pointer-events: none;
    -webkit-mask-image: -webkit-gradient(
      linear,
      left 0%,
      left 100%,
      color-stop(100%, rgba(0, 0, 0, 0)),
      color-stop(80%, rgba(0, 0, 0, 0.7)),
      color-stop(50%, rgba(0, 0, 0, 1)),
      color-stop(20%, rgba(0, 0, 0, 0.7)),
      color-stop(0%, rgba(0, 0, 0, 0))
    );
    transform: scaleY(1.5);
  }

  * {
    z-index: 10;
  }
`;

export const AfterWrapper = styled.div`
  background: url(${bg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      black,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      transparent,
      black
    );
    pointer-events: none;
  }

  > * {
    width: 100%;
  }
`;

export const WideSpace = styled(Space)`
  width: 100%;

  .ant-input-group-wrapper,
  .ant-pagination > * {
    ${glass}
  }
`;

export const TitleSpace = styled(WideSpace)<any>`
  justify-content: space-between;
  margin-bottom: 1rem;
  cursor: pointer;

  > * {
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      margin-bottom: 0;
    }
  }
`;
