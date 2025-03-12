import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const ManageBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: "", content: "", img: "" });
    const [editBlog, setEditBlog] = useState(null);

    useEffect(() => {
        fetch("http://localhost:9999/api/blogs")
            .then(response => response.json())
            .then(data => setBlogs(data))
            .catch(error => console.error("Error fetching blogs:", error));
    }, []);
console.log(blogs);

    const handleAddBlog = () => {
        const blogWithTimestamp = { ...newBlog, created_at: new Date().toISOString() };

        fetch("http://localhost:9999/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogWithTimestamp)
        })
        .then(response => response.json())
        .then(data => {
            setBlogs([...blogs, data]);
            setShowAddModal(false);
            setNewBlog({ title: "", content: "", img: "" });
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
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(`http://localhost:9999/api/blogs/${id}`, { method: "DELETE" })
            .then(() => {
                setBlogs(blogs.filter(blog => blog._id !== id));
            })
            .catch(error => console.error("Error deleting blog:", error));
        }
    };

    return (
        <div className="container" style={{ marginTop: "100px" }}>
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
                                    <Button variant="warning" onClick={() => { setEditBlog(blog); setShowEditModal(true); }}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteBlog(blog._id)}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" value={newBlog.img} onChange={(e) => setNewBlog({ ...newBlog, img: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddBlog}>Add</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editBlog && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" value={editBlog.title} onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Content</Form.Label>
                                <Form.Control as="textarea" rows={3} value={editBlog.content} onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control type="text" value={editBlog.img} onChange={(e) => setEditBlog({ ...editBlog, img: e.target.value })} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleEditBlog}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageBlog;