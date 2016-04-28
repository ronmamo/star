import React, { Component, PropTypes } from "react";
import { Navbar, Button, FormGroup, FormControl } from 'react-bootstrap';

const styles = {
  title: {
    cursor: 'pointer',
  }
};

export default class Header extends Component {

  render() {
    const { title } = this.props;

    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullRight>
            <FormGroup>
              <FormControl type="text" placeholder="Search" />
            </FormGroup>
            {' '}
            <Button type="submit">Submit</Button>
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>);
  }
}

