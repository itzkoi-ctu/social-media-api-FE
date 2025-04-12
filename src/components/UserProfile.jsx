import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
const {userId}= useParams()
console.log(userId)
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/${userId}/user-detail`)
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      });
  }, [userId]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    try {
      const res = await axios.put(
        `http://localhost:8080/user/${userId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <img
        src={user.profilePhoto}
        alt="Profile"
        style={{ width: 150, height: 150, borderRadius: "50%" }}
      />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <Button variant="primary" onClick={() => setShowEditModal(true)}>
        Edit Profile
      </Button>

      {/* Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mt-2">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
