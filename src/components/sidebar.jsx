import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

/* styles */
const SidebarContainer = styled.div`
  position: fixed;
  width: 120px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #000;
  padding: 20px;
  z-index: 1000;
  text-align: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease-in-out;

  /* Collapsible sidebar on mobile */
  @media (max-width: 768px) {
    width: 90px;
    padding: 10px;
  }
`;

/* Container for Logo */
const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;

  /* Adjust logo size on smaller screens */
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const SidebarLinks = styled.div`
  display: block; /* Always show links */
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: pink;
  margin-top: 10px;
  transition: background-color 0.3s, color 0.3s;
  font-size: 14px;

  &:hover {
    background-color: #ff0066;
    color: white;
  }

  /* Hide text on smaller screens */
  @media (max-width: 768px) {
    justify-content: center;
    font-size: 12px;
    & span {
      display: none;
    }
  }
`;

const Icon = styled.i`
  margin-right: 8px;

  /* Adjust icon size on smaller screens */
  @media (max-width: 768px) {
    margin-right: 0;
    font-size: 18px;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <TopContainer>
        <Logo
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSEQR04TIMQ1CyzAX2vmiOh633XYpmix-D03PYGJn4rqX6Acm1AxB14F0&s"
          alt="Logo"
        />
      </TopContainer>
      <SidebarLinks>
        <SidebarLink to="/">
          <Icon className="fas fa-home"></Icon> <span>Home</span>
        </SidebarLink>
        <SidebarLink to="/playlist">
          <Icon className="fas fa-music"></Icon> <span>Playlist</span>
        </SidebarLink>
        <SidebarLink to="/favorites">
          <Icon className="fas fa-heart"></Icon> <span>Favorites</span>
        </SidebarLink>
        <SidebarLink to="/library">
          <Icon className="fas fa-book"></Icon> <span>Library</span>
        </SidebarLink>
      </SidebarLinks>
    </SidebarContainer>
  );
};

export default Sidebar;
