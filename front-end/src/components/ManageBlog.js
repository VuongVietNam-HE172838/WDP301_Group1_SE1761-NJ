import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", img: "" });
  const [editBlog, setEditBlog] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/api/blogs")
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleAddBlog = () => {
    if (!newBlog.title || newBlog.title.trim().length < 10 || newBlog.title.trim().length > 100) {
      toast.error("Tiêu đề không hợp lệ! Phải có từ 10-100 ký tự.");
      return;
    }
  
    if (!newBlog.content || newBlog.content.trim().length < 50) {
      toast.error("Nội dung quá ngắn! Phải có ít nhất 50 ký tự.");
      return;
    }
  
    if (!newBlog.img) {
      toast.error("Vui lòng tải lên một hình ảnh.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("img", newBlog.img);
    formData.append("created_at", new Date().toISOString());
  
    fetch("http://localhost:9999/api/blogs", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        setBlogs([...blogs, data]);
        setShowAddModal(false);
        setNewBlog({ title: "", content: "", img: null });
        setPreviewImage(null);
        toast.success("Thêm blog thành công! 🎉");
      })
      .catch(error => {
        console.error("Error adding blog:", error);
        toast.error("Lỗi khi thêm blog, vui lòng thử lại!");
      });
  };

  const handleEditBlog = async (newImage) => {
    if (!editBlog.title || editBlog.title.trim().length < 10 || editBlog.title.trim().length > 100) {
      toast.error("Tiêu đề không hợp lệ! Phải có từ 10-100 ký tự.");
      return;
    }
  
    if (!editBlog.content || editBlog.content.trim().length < 50) {
      toast.error("Nội dung quá ngắn! Phải có ít nhất 50 ký tự.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", editBlog.title);
    formData.append("content", editBlog.content);
    
    if (newImage) {
      formData.append("img", newImage);
    }
  
    try {
      const response = await fetch(`http://localhost:9999/api/blogs/${editBlog._id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to update blog");
  
      const updatedBlog = await response.json();
  
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        )
      );
  
      setShowEditModal(false);
      setEditBlog(null);
      setSelectedImage(null);
  
      toast.success("Sửa blog thành công! 🎉");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Có lỗi xảy ra khi sửa blog! ❌");
    }
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      fetch(`http://localhost:9999/api/blogs/${id}`, { method: "DELETE" })
        .then(() => {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          toast.success("Xóa blog thành công! 🗑️");
        })
        .catch((error) => {
          console.error("Error deleting blog:", error);
          toast.error("Lỗi khi xóa blog, vui lòng thử lại!");
        });
    }
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditBlog(null); // Reset lại form
};
const handleImageChange2 = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedImage(file);
    setEditBlog({ ...editBlog, img: URL.createObjectURL(file) }); // Hiển thị ảnh tạm thời
  }
};
  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center my-3">Manage Blogs</h2>
      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        Add Blog
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Image</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.content}</td>
              <td>
                {blog.img ? (
                  <img src={blog.img} alt={blog.title} style={{ width: "100px", height: "auto" }} />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-GB") : "N/A"}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => {
                    setEditBlog(blog);
                    setShowEditModal(true);
                  }}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteBlog(blog._id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editBlog && (
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editBlog.title}
                onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editBlog.content}
                onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Current Image</Form.Label>
              <div className="mt-3 text-center">
                <img
                  src={editBlog.img}
                  alt="Current"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload New Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange2} />
              {selectedImage && (
                <div className="mt-3 text-center" style={{ marginTop: "10px" }}>
                  <p>Preview:</p>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCloseEditModal}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleEditBlog(selectedImage)}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
      {/* Modal thêm blog */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={3} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setNewBlog({ ...newBlog, img: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddBlog}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageBlog;
