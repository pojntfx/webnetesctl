import { useRouter } from "next/router";
import Animate from "rc-animate";
import { useTranslation } from "react-i18next";
import ParticlesTmpl from "react-particles-js";
import styled from "styled-components";
import {
  BlurWrapper as BlurWrapperTmpl,
  ContentWrapper as ContentWrapperTmpl,
  Wrapper,
} from "./created";

const particlesConfig: typeof ParticlesTmpl["arguments"] = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 1000,
      },
    },
    line_linked: {
      enable: true,
      opacity: 0.02,
    },
    move: {
      direction: "right",
      speed: 0.2,
    },
    size: {
      value: 1,
    },
    opacity: {
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.05,
      },
    },
  },
  interactivity: {
    events: {
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      push: {
        particles_nb: 1,
      },
    },
  },
  retina_detect: true,
};

function Worker() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Wrapper>
      <Particles params={particlesConfig} />

      <BlurWrapper>
        <Animate transitionName="fadeandzoom" transitionAppear>
          <ContentWrapper>
            <h1>{router.query.id}</h1>
          </ContentWrapper>
        </Animate>
      </BlurWrapper>
    </Wrapper>
  );
}

const Particles = styled(ParticlesTmpl)`
  background: transparent;
  width: 100%;
  height: 100%;
  position: fixed;
`;

const ContentWrapper = styled(ContentWrapperTmpl)`
  padding-top: 3rem;
  padding-bottom: 3rem;

  h1 {
    margin-bottom: 0;
  }
`;

const BlurWrapper = styled(BlurWrapperTmpl)`
  margin-top: auto;
`;

export default Worker;
