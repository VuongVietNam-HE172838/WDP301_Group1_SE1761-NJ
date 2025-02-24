// src/components/Reviews.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Reviews = () => {
  return (
    <section id="reviews" className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-4">Customer Reviews</h2>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Text>"Great food and wonderful service! Highly recommend."</Card.Text>
                <Card.Footer>- John Doe</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Text>"A fantastic dining experience. Will come back for sure."</Card.Text>
                <Card.Footer>- Jane Smith</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Text>"The best restaurant in town! I loved every bite."</Card.Text>
                <Card.Footer>- Alice Johnson</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Reviews;
