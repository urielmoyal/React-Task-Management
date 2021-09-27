import { React, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRealmApp } from "./UserContext";

function Header(props) {
  const [userNameAndRole, setUserNameAndRole] = useState({ name: "", role: "" });
  const app = useRealmApp();

  const handleSelect = (eventKey) => {
    props.setShowNotesOf(eventKey);
  };

  useEffect(() => {
    const getUserNameAndRole = async () => {
      const result = await app.currentUser.functions.getUserPermission();
      setUserNameAndRole(result);
    };
    getUserNameAndRole();
  }, []);

  return (
    <header>
      {userNameAndRole.role === "manager" ? (
        <Nav variant="pills" activeKey="1" onSelect={handleSelect}>
          <Navbar.Brand href="#home">Hello {userNameAndRole.name}</Navbar.Brand>

          <Nav.Item>
            <Nav.Link eventKey="Employee_1" title="Item">
              Employee_1
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Employee_2" title="Item">
              Employee_2
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Employee_3" title="Item">
              Employee_3
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="all" title="Item">
              all
            </Nav.Link>
          </Nav.Item>

          <Button className="ml-auto" onClick={app.logOut}>
            Log Out
          </Button>
        </Nav>
      ) : (
        <Nav variant="pills" activeKey="1" onSelect={handleSelect}>
          <Navbar.Brand href="#home">Hello {userNameAndRole.name}</Navbar.Brand>
          <Button className="ml-auto" onClick={app.logOut}>
            Log Out
          </Button>
        </Nav>
      )}
    </header>
  );
}

export default Header;
