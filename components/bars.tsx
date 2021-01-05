import { Space } from "antd";
import styled from "styled-components";
import glass from "../styles/glass";

export const JoinHeaderBar = styled(Space)`
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;

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
    position: relative;
    z-index: 110;
  }

  > *:first-child {
    margin-left: 1rem;
  }

  > *:last-child {
    margin-right: 24px; /* Matches the card's internal margins */
  }
`;

export const JoinFooterBar = styled.div<{
  $padding: number | undefined;
  ref: any;
}>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-bottom: 2rem;
  padding-top: 2rem;
  transition: all 0.5s ease-out;

  ${(props) =>
    props.$padding
      ? `padding-bottom: ${props.$padding}px; padding-top: ${props.$padding}px;`
      : ""}
`;

export const CreatedHeaderBar = styled(Space)`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

export const CreatedFooterBar = styled.div`
  padding-bottom: 2rem;
`;
