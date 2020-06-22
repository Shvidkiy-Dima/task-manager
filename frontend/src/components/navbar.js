import React from 'react'
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'

function BoardNavbar({username}){
  return <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
    <Navbar.Brand>Task manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">All boards</Nav.Link>
            <Nav.Link>{username}</Nav.Link>
            </Nav>
</Navbar.Collapse>

</Navbar>
}

export default BoardNavbar
