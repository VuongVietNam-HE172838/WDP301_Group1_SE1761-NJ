import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null); // Lưu danh mục đang chỉnh sửa
  const [newCategoryName, setNewCategoryName] = useState(""); // Lưu tên danh mục mới
  const [showAddModal, setShowAddModal] = useState(false); // Điều khiển modal thêm danh mục

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9999/menu/menu");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleEdit = (id, name) => {
    setEditedCategory({ id, name });
  };

  const handleCancel = () => {
    setEditedCategory(null); // Hủy chỉnh sửa
  };

  const handleUpdate = async () => {
    if (!editedCategory || !editedCategory.name.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    const updatedData = { name: editedCategory.name };

    // Kiểm tra ID trước khi gửi
    if (!editedCategory.id || editedCategory.id.length !== 24) {
      console.error("❌ ID không hợp lệ!");
      alert("Lỗi: ID không hợp lệ.");
      return;
    }

    console.log("🔥 Đang gửi dữ liệu cập nhật:", updatedData);
    console.log("ID danh mục đang cập nhật:", editedCategory.id);  // Kiểm tra giá trị ID

    try {
      const response = await axios.put(
        `http://localhost:9999/menu/category/${editedCategory.id}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("✅ Cập nhật thành công:", response.data);
      fetchCategories(); // Cập nhật danh sách mới
      setEditedCategory(null); // Reset trạng thái
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật danh mục:", error.response ? error.response.data : error.message);
      alert("Lỗi khi cập nhật, vui lòng kiểm tra lại.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      try {
        await axios.delete(`http://localhost:9999/menu/category/${id}`);
        fetchCategories(); // Load lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }
  
    const userId = localStorage.getItem("userId"); // Hoặc từ token JWT nếu lưu trong đó
    const isAdmin = localStorage.getItem("role") === "admin"; // Kiểm tra nếu người dùng là admin
    
    // Nếu không phải admin, gán userId vào created_by, nếu là admin thì gán "admin"
    const createdBy = isAdmin ? "admin" : userId;
    
    const newCategory = { 
      name: newCategoryName,
      created_by: createdBy,
      updated_by: createdBy, // Cũng có thể gán là userId hoặc "admin" tùy nhu cầu
    };
  
    try {
      const response = await axios.post("http://localhost:9999/menu/category", newCategory);
      console.log("✅ Thêm danh mục thành công:", response.data);
      fetchCategories(); // Cập nhật danh sách danh mục
      setNewCategoryName(""); // Reset tên danh mục
      setShowAddModal(false); // Đóng modal
    } catch (error) {
      console.error("❌ Lỗi khi thêm danh mục:", error);
      alert("Lỗi khi thêm danh mục.");
    }
  };
  
  
  

  return (
    <div className="container">
      <h2 className="text-center my-3">Quản lý Danh mục</h2>

      {/* Nút Thêm danh mục */}
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

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Namee Category</th>
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
    </div>
  );
};

export default ManageCategory;
