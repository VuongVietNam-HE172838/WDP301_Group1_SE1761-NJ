import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";

const ManageDish = () => {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newDish, setNewDish] = useState({
        name: "",
        price: "",
        size: "",
        img: "",
        quantity: "",
        category_id: "",
        description: "",
    });
    const [editDish, setEditDish] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" }); // Track sorting configuration

    useEffect(() => {
        fetchDishes();
        fetchCategories();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await axios.get("http://localhost:9999/menu/dishes");
            const dishesWithCategoryName = await Promise.all(
                response.data.map(async (dish) => {
                    const categoryResponse = await axios.get(`http://localhost:9999/menu/category/${dish.category_id}`);
                    return {
                        ...dish,
                        category_name: categoryResponse.data.name,
                        price: dish.optional?.price || "",
                        size: dish.optional?.size || "",
                    };
                })
            );
            setDishes(dishesWithCategoryName);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:9999/menu/menu");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddDish = async () => {
        if (!newDish.name.trim() || !newDish.price.trim() || !newDish.size.trim() || !newDish.category_id || !newDish.description.trim()) {
            alert("All fields must be filled!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:9999/menu/dishes", newDish, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchDishes();
            setNewDish({ name: "", price: "", size: "", img: "", quantity: "", category_id: "", description: "" });
            setShowAddModal(false);
        } catch (error) {
            console.error("Error adding dish:", error);
            alert("Error adding dish.");
        }
    };

    const handleEditClick = (dish) => {
        setEditDish({
            ...dish,
            price: dish.optional?.price || "",
            size: dish.optional?.size || "",
        });
        setShowEditModal(true);
    };

    const handleEditDish = async () => {
        if (!editDish?._id) {
            alert("Dish ID is missing.");
            return;
        }

        if (!editDish?.name?.trim() || !String(editDish?.price)?.trim() || !editDish?.size?.trim() || !editDish?.category_id || !editDish?.description?.trim()) {
            alert("All fields must be filled!");
            return;
        }

        const updatedDish = {
            ...editDish,
            optional: {
                price: String(editDish.price),
                size: editDish.size,
            },
            category_id: editDish.category_id,
            description: editDish.description,
        };

        try {
            await axios.put(`http://localhost:9999/menu/dishes/${editDish._id}`, updatedDish, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchDishes();
            setShowEditModal(false);
            setEditDish(null);
        } catch (error) {
            console.error("Error updating dish:", error);
            alert("Error updating dish.");
        }
    };

    const handleDeleteDish = async (dishId) => {
        try {
            await axios.delete(`http://localhost:9999/menu/dishes/${dishId}`);
            fetchDishes();
        } catch (error) {
            console.error("Error deleting dish:", error);
            alert("Error deleting dish.");
        }
    };

    // Sorting function
    const sortDishes = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key, direction });

        const sortedDishes = [...dishes].sort((a, b) => {
            if (key === "price" || key === "quantity") {
                // Convert to number for proper sorting
                a = parseFloat(a[key]);
                b = parseFloat(b[key]);
            } else {
                a = a[key].toLowerCase();
                b = b[key].toLowerCase();
            }

            if (a < b) return direction === "asc" ? -1 : 1;
            if (a > b) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setDishes(sortedDishes);
    };

    return (
        <div className="container">
            <h2 className="text-center my-3">Manage Dishes</h2>

            <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
                Add Dish
            </Button>

            {/* Add Dish Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Dish</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Dish Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter dish name"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter price"
                            value={newDish.price}
                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Size</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter size"
                            value={newDish.size}
                            onChange={(e) => setNewDish({ ...newDish, size: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            value={newDish.img}
                            onChange={(e) => setNewDish({ ...newDish, img: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter quantity"
                            value={newDish.quantity}
                            onChange={(e) => setNewDish({ ...newDish, quantity: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter dish description"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={newDish.category_id}
                            onChange={(e) => setNewDish({ ...newDish, category_id: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddDish}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Dish Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Dish Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={editDish?.name || ""}
                            onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            value={editDish?.price || ""}
                            onChange={(e) => setEditDish({ ...editDish, price: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Size</Form.Label>
                        <Form.Control
                            type="text"
                            value={editDish?.size || ""}
                            onChange={(e) => setEditDish({ ...editDish, size: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={editDish?.img || ""}
                            onChange={(e) => setEditDish({ ...editDish, img: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={editDish?.quantity || ""}
                            onChange={(e) => setEditDish({ ...editDish, quantity: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editDish?.description || ""}
                            onChange={(e) => setEditDish({ ...editDish, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={editDish?.category_id || ""}
                            onChange={(e) => setEditDish({ ...editDish, category_id: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditDish}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Table displaying dishes */}
            <Table striped bordered hover>
                <thead>
                    <tr>    
                        <th>Name</th>
                        <th onClick={() => sortDishes("price")}>Price</th>
                        <th>Size</th>
                        <th onClick={() => sortDishes("quantity")}>Quantity</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Img</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes.map((dish) => (
                        <tr key={dish._id}>
                            <td>{dish.name}</td>
                            <td>{dish.price}</td>
                            <td>{dish.size}</td>
                            <td>{dish.quantity}</td>
                            <td>{dish.description}</td>
                            <td>{dish.category_name}</td>
                            <td>
                                {dish.img ? (
                                    <img src={dish.img} alt={dish.name} style={{ width: "100px", height: "auto" }} />
                                ) : (
                                    "No Image"
                                )}
                            </td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEditClick(dish)}
                                    className="mr-2"
                                >
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteDish(dish._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ManageDish;
