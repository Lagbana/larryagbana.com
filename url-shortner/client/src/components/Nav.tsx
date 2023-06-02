import { FaGithub, FaLinkedin } from "react-icons/fa";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  top: 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 80%;
  padding: 20px 30px;
  background-color: #f8f9fa;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: #343a40;
  padding: 0;
  margin: 0;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const IconLink = styled.a`
  color: #343a40;
  font-size: 1.5rem;
  text-decoration: none;
`;

export const Nav = () => {
  return (
    <Wrapper>
      <Header>
        <Logo>Url Shortner</Logo>
        <IconContainer>
          <IconLink
            href='https://github.com/Lagbana'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </IconLink>
          <IconLink
            href='https://linkedin.com/in/larryagbana'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </IconLink>
        </IconContainer>
      </Header>
    </Wrapper>
  );
};
