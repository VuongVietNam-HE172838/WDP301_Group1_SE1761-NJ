import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const FeedbackModal = ({ show, onHide, orderId }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [isFeedbackExist, setIsFeedbackExist] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const [feedbackId, setFeedbackId] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Không tìm thấy token!');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_URL_API_BACKEND}/feedback/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.feedbacks && response.data.feedbacks.length > 0) {
          const feedback = response.data.feedbacks[0];
          setFeedbackText(feedback.comment);
          setRating(feedback.rating);
          setIsFeedbackExist(true);
          setFeedbackId(feedback._id);
        } else {
          setIsFeedbackExist(false);
          setFeedbackId(null);
        }
      } catch (error) {
        console.error('Lỗi tải feedback:', error);
      }
    };

    if (show && orderId) {
      fetchFeedback();
    }
  }, [show, orderId]);

  const handleDelete = async () => {
    if (!feedbackId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_URL_API_BACKEND}/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Xóa feedback thành công!');
      setIsFeedbackExist(false);
      setFeedbackText('');
      setRating(0);
      onHide();
    } catch (error) {
      console.error('Lỗi xóa feedback:', error);
      alert('Xóa feedback thất bại!');
    }
  };

  const handleEdit = async () => {
    if (!feedbackId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_URL_API_BACKEND}/feedback/${feedbackId}`, {
        comment: editedText,
        rating: editedRating,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Chỉnh sửa feedback thành công!');
      setFeedbackText(editedText);
      setRating(editedRating);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi sửa feedback:', error);
      alert('Sửa feedback thất bại!');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Feedback của bạn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditing ? (
          <>
            <div className="d-flex mb-3">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={30}
                  color={index + 1 <= editedRating ? '#ffc107' : '#e4e5e9'}
                  onClick={() => setEditedRating(index + 1)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <textarea
              className="form-control"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="d-flex mb-3">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={30}
                  color={index + 1 <= rating ? '#ffc107' : '#e4e5e9'}
                />
              ))}
            </div>
            <p><strong>Nhận xét:</strong></p>
            <p>{feedbackText || "Không có feedback"}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {isEditing ? (
          <>
            <Button variant="success" onClick={handleEdit}>Lưu</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Hủy</Button>
          </>
        ) : (
          <>
            {isFeedbackExist && (
              <>
                <Button variant="warning" onClick={() => {
                  setIsEditing(true);
                  setEditedText(feedbackText);
                  setEditedRating(rating);
                }}>Sửa</Button>
                <Button variant="danger" onClick={handleDelete}>Xóa</Button>
              </>
            )}
            <Button variant="secondary" onClick={onHide}>Đóng</Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
