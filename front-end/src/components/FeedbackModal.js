import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const FeedbackModal = ({ show, onHide, onSubmit, feedbackText, setFeedbackText, rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gửi Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Đánh giá</Form.Label>
            <div className="d-flex">
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={30}
                    style={{ cursor: "pointer" }}
                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setRating(currentRating)}
                  />
                );
              })}
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" onClick={onSubmit}>Gửi</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
