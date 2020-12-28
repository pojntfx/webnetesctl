import {
  faBinoculars,
  faCogs,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Navbar = (props: any) => {
  const { t } = useTranslation();

  return (
    <NavigationMenu {...props}>
      <NavigationButton type="primary">
        <FontAwesomeIcon size="lg" icon={faGlobe} fixedWidth />
        {t("overview")}
      </NavigationButton>

      <NavigationButton type="text">
        <FontAwesomeIcon size="lg" icon={faBinoculars} fixedWidth />
        {t("explorer")}
      </NavigationButton>

      <NavigationButton type="text">
        <FontAwesomeIcon size="lg" icon={faCogs} fixedWidth />
        {t("config")}
      </NavigationButton>
    </NavigationMenu>
  );
};

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

export default Navbar;
