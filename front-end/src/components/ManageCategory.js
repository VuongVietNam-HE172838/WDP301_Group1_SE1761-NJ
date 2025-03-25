import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";


const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null); 
  const [newCategoryName, setNewCategoryName] = useState(""); 
  const [showAddModal, setShowAddModal] = useState(false); 

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9999/menu/menu");
      setCategories(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh mục!"); 
    }
  };

  const handleEdit = (id, name) => {
    setEditedCategory({ id, name });
  };

  const handleCancel = () => {
    setEditedCategory(null);
  };

  const handleUpdate = async () => {
    if (!editedCategory || !editedCategory.name.trim()) {
      toast.warning("Tên Category không được để trống!");
      return;
    }

    if (!editedCategory.id || editedCategory.id.length !== 24) {
      toast.error("ID không hợp lệ!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:9999/menu/category/${editedCategory.id}`,
        { name: editedCategory.name },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Cập nhật Category thành công!"); 
      fetchCategories(); 
      setEditedCategory(null);
    } catch (error) {
      toast.error("Lỗi khi cập nhật Category!"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa Category này không?")) {
      try {
        await axios.delete(`http://localhost:9999/menu/category/${id}`);
        toast.success("Xóa Category thành công!"); 
        fetchCategories(); 
      } catch (error) {
        toast.error("Lỗi khi xóa Category!"); 
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.warning("Tên Category không được để trống!");
      return;
    }
  
    const userId = localStorage.getItem("userId"); 
    const isAdmin = localStorage.getItem("role") === "admin"; 
    const createdBy = isAdmin ? "admin" : userId;
    
    const newCategory = { 
      name: newCategoryName,
      created_by: createdBy,
      updated_by: createdBy, 
    };
  
    try {
      await axios.post("http://localhost:9999/menu/category", newCategory);
      toast.success("Thêm Category thành công!"); 
      fetchCategories(); 
      setNewCategoryName(""); 
      setShowAddModal(false); 
    } catch (error) {
      toast.error("Lỗi khi thêm Category!"); 
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-3">Manage Category</h2>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        Add New Category
      </Button>

      {/* Modal thêm danh mục */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bảng danh mục */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>
                {editedCategory?.id === category._id ? (
                  <Form.Control
                    type="text"
                    value={editedCategory.name}
                    onChange={(e) =>
                      setEditedCategory({ ...editedCategory, name: e.target.value })
                    }
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editedCategory?.id === category._id ? (
                  <>
                    <Button variant="success" onClick={handleUpdate} className="mr-2">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="warning" onClick={() => handleEdit(category._id, category.name)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(category._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Component hiển thị thông báo */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageCategory;
