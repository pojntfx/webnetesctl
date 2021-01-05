import {
  faBinoculars,
  faCogs,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Select } from "antd";
import { Header as HeaderTmpl } from "antd/lib/layout/layout";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import glass from "../styles/glass";

export interface INavbarProps {
  path: string;
}

/**
 * Navbar is the main navigation component.
 *
 * @param param0 Props
 */
const Navbar = ({ path, ...otherProps }: INavbarProps) => {
  const { t } = useTranslation();

  return (
    <NavigationMenu {...otherProps}>
      <Link href="/overview">
        <NavigationButton type={path === "/overview" ? "primary" : "text"}>
          <FontAwesomeIcon size="lg" icon={faGlobe} fixedWidth />
          {t("overview")}
        </NavigationButton>
      </Link>

      <Link href="/explorer">
        <NavigationButton type={path === "/explorer" ? "primary" : "text"}>
          <FontAwesomeIcon size="lg" icon={faBinoculars} fixedWidth />
          {t("explorer")}
        </NavigationButton>
      </Link>

      <Link href="/config">
        <NavigationButton type={path === "/config" ? "primary" : "text"}>
          <FontAwesomeIcon size="lg" icon={faCogs} fixedWidth />
          {t("config")}
        </NavigationButton>
      </Link>
    </NavigationMenu>
  );
};

// Navigation components
const NavigationMenu = styled.div`
  height: 100%;
  display: flex;
`;

const NavigationButton = styled(Button)`
  width: 5rem;
  height: 100% !important;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

// Header components
export const DesktopHeader = styled(HeaderTmpl)`
  display: none;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 999;
  width: 100%;
  border-bottom: 1px solid #303030;
  ${glass}

  @media screen and (min-width: 812px) {
    display: flex;
  }
`;

export const MobileHeader = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 999;
  width: 100%;
  border-bottom: 1px solid #303030;
  ${glass}

  @media screen and (min-width: 812px) {
    display: none;
  }
`;

// Tab components
export const MobileTabs = styled(HeaderTmpl)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 999;
  width: 100%;
  border-top: 1px solid #303030;
  bottom: 0;
  ${glass}

  @media screen and (min-width: 812px) {
    display: none;
  }
`;

// Search components

/**
 * SearchInput is the global search menu's dropdown search menu.
 */
export const SearchInput = styled(Select)`
  width: 100%;
  max-width: 22.5rem;
  margin-left: 8px;
  margin-right: 8px;
`;

export default Navbar;
