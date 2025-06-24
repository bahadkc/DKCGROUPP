import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(26, 26, 26, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    z-index: 99;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  opacity: 0.7;
  transition: all 0.3s ease;
  position: relative;
  font-size: 1rem;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    &::after {
      width: 100%;
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: white;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    
    &::after {
      bottom: -8px;
      height: 3px;
    }
  }
`;

const MobileMenuButton = styled.button<{ isOpen: boolean }>`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  z-index: 101;
  position: relative;
  padding: 0.8rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
  }
  
  span {
    display: block;
    width: 22px;
    height: 2px;
    background: white;
    margin: 2px 0;
    transition: all 0.3s ease;
    border-radius: 1px;
    
    &:nth-child(1) {
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)'};
      width: ${props => props.isOpen ? '20px' : '22px'};
    }
    
    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
      transform: ${props => props.isOpen ? 'scale(0)' : 'scale(1)'};
    }
    
    &:nth-child(3) {
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'rotate(0)'};
      width: ${props => props.isOpen ? '20px' : '22px'};
    }
  }
`;

const MenuLabel = styled.span<{ isOpen: boolean }>`
  display: none;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.3rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: block;
    opacity: ${props => props.isOpen ? '0' : '1'};
    transform: ${props => props.isOpen ? 'translateY(-5px)' : 'translateY(0)'};
  }
`;

const MobileMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    position: relative;
  }
`;

const Main = styled.main`
  padding-top: 6rem;
  
  @media (max-width: 768px) {
    padding-top: 4rem;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isProjectDetail = location.pathname.includes('/project/');
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <LayoutWrapper>
      <Header>
        {!isProjectDetail && <Logo to="/" onClick={closeMenu}>DKC Group</Logo>}
        <MobileMenuContainer>
          <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
          <MenuLabel isOpen={isMenuOpen}>Menu</MenuLabel>
        </MobileMenuContainer>
        <Nav isOpen={isMenuOpen}>
          <NavLink to="/" className={isHome ? 'active' : ''} onClick={closeMenu}>Work</NavLink>
          <NavLink to="/about" className={isAbout ? 'active' : ''} onClick={closeMenu}>About</NavLink>
        </Nav>
      </Header>
      <Main>{children}</Main>
    </LayoutWrapper>
  );
};

export default Layout; 