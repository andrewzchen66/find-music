import logo from '../logo.svg';
import { NavLink } from "./NavbarElements"
import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
} from 'mdb-react-ui-kit';

export default function Navbar() {
    const [showNav, setShowNav] = useState(false);
  
    return (
      <MDBNavbar expand='lg' light bgColor='info'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'><img className="App-logo" src={logo} alt="Spotifynder" /></MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNav(!showNav)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                <NavLink to="/search" activeStyle>
                        Search Artists
                </NavLink>
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                <NavLink to="/playlist" activeStyle>
                        Generate Playlist
                </NavLink>
                </MDBNavbarLink>
              </MDBNavbarItem>

              
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    );
  }