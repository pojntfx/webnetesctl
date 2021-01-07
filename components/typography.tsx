import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "antd/lib/typography/Title";
import styled from "styled-components";

export const BareTitle = styled(Title)`
  margin-bottom: 0 !important;
`;

export const BareLink = styled.a`
  color: unset !important;
`;

export const MoreLink = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const IlluminatedTitle = styled(Title)`
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 0 !important;
  font-size: 34px !important;

  @media screen and (min-width: 812px) {
    font-size: 36px !important;
  }
`;

export const IlluminatedIcon = styled(FontAwesomeIcon)`
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
`;

export const MainTitle = styled(Title)`
  text-align: center;
`;

export const FocusedTitle = styled.strong`
  font-weight: 700 !important;
`;
