// src/components/Menu.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Menu = () => {
  return (
    <section id="menu" className="py-5">
      <Container>
        <h2 className="text-center mb-4">Our Menu</h2>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="dish1.jpg" />
              <Card.Body>
                <Card.Title>Dish Name</Card.Title>
                <Card.Text>Description of the dish</Card.Text>
                <Card.Text><strong>$12.99</strong></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="dish2.jpg" />
              <Card.Body>
                <Card.Title>Dish Name</Card.Title>
                <Card.Text>Description of the dish</Card.Text>
                <Card.Text><strong>$15.99</strong></Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="dish3.jpg" />
              <Card.Body>
                <Card.Title>Dish Name</Card.Title>
                <Card.Text>Description of the dish</Card.Text>
                <Card.Text><strong>$18.99</strong></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Menu;
