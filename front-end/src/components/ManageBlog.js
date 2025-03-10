import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const ManageBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: "", content: "", img: "", create_at: "" });
    const [editBlog, setEditBlog] = useState(null);

    useEffect(() => {
        fetch("http://localhost:9999/api/blogs")
            .then(response => response.json())
            .then(data => setBlogs(data))
            .catch(error => console.error("Error fetching blogs:", error));
    }, []);

    const handleAddBlog = () => {
        fetch("http://localhost:9999/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBlog)
        })
        .then(response => response.json())
        .then(data => {
            setBlogs([...blogs, data]);
            setShowAddModal(false);
            setNewBlog({ title: "", content: "", img: "", create_at: "" });
        })
        .catch(error => console.error("Error adding blog:", error));
    };

    const handleEditBlog = () => {
        fetch(`http://localhost:9999/api/blogs/${editBlog._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editBlog)
        })
        .then(response => response.json())
        .then(() => {
            setBlogs(blogs.map(blog => blog._id === editBlog._id ? editBlog : blog));
            setShowEditModal(false);
            setEditBlog(null);
        })
        .catch(error => console.error("Error updating blog:", error));
    };

    const handleDeleteBlog = (id) => {
        fetch(`http://localhost:9999/api/blogs/${id}`, { method: "DELETE" })
        .then(() => {
            setBlogs(blogs.filter(blog => blog._id !== id));
        })
        .catch(error => console.error("Error deleting blog:", error));
    };

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <h2 className="text-center my-3">Manage Blogs</h2>

            <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
                Add Blog
            </Button>

            {/* Table displaying blogs */}
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
                            <td>{new Date(blog.create_at).toLocaleDateString("en-GB")}</td>
                            <td>
                                <Button variant="warning" className="mr-2" onClick={() => { setEditBlog(blog); setShowEditModal(true); }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteBlog(blog._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Blog Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
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
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" value={newBlog.img} onChange={(e) => setNewBlog({ ...newBlog, img: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Created At</Form.Label>
                            <Form.Control type="date" value={newBlog.create_at} onChange={(e) => setNewBlog({ ...newBlog, create_at: e.target.value })} />
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