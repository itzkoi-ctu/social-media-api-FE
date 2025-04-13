"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Modal, Button, Form, Card, Container, Row, Col, Image } from "react-bootstrap"
import { useParams } from "react-router-dom"

const UserProfile = () => {
  const [user, setUser] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)
  const { userId } = useParams()

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/${userId}/user-detail`)
      .then((res) => {
        setUser(res.data)
        setName(res.data.name)
        setEmail(res.data.email)
      })
      .catch((error) => {
        console.error("Error fetching user data:", error)
      })
  }, [userId])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    if (profilePhoto) formData.append("profilePhoto", profilePhoto)

    try {
      const res = await axios.put(`http://localhost:8080/user/${userId}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setUser(res.data)
      setShowEditModal(false)
    } catch (err) {
      console.error("Error updating user:", err)
    }
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Banner */}
        <div
          className="bg-gradient-primary text-white"
          style={{
            height: "180px",
            background: "linear-gradient(to right, #8e2de2, #4a00e0)",
          }}
        />

        <Card.Body className="position-relative px-4">
          {/* Profile Photo */}
          <div className="position-absolute" style={{ top: "-75px", left: "50%", transform: "translateX(-50%)" }}>
            <div className="position-relative">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto || "/placeholder.svg"}
                  alt={user.name}
                  roundedCircle
                  className="border border-4 border-white shadow-sm"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light border border-4 border-white shadow-sm"
                  style={{
                    width: "150px",
                    height: "150px",
                    fontSize: "3rem",
                    color: "#8e2de2",
                    backgroundColor: "#f8f0ff",
                  }}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-5 pt-4">
            <h2 className="fw-bold mb-1">{user.name}</h2>
            <p className="text-muted">
              <i className="bi bi-envelope me-2"></i>
              {user.email}
            </p>
            <Button
              variant="primary"
              onClick={() => setShowEditModal(true)}
              className="mt-2"
              style={{ backgroundColor: "#8e2de2", borderColor: "#8e2de2" }}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit Profile
            </Button>
          </div>

          <hr className="my-4" />

          <Row className="mt-4">
            <Col md={6} className="mb-4">
              <h4 className="fw-bold mb-3">Personal Information</h4>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-3">
                    <p className="text-muted mb-1 small">Full Name</p>
                    <p className="fw-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-muted mb-1 small">Email Address</p>
                    <p className="fw-medium">{user.email}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <h4 className="fw-bold mb-3">Account Information</h4>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <p className="text-muted mb-1 small">User ID</p>
                  <code className="d-block p-2 bg-light rounded">{userId}</code>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            {previewUrl || user.profilePhoto ? (
              <Image
                src={previewUrl || user.profilePhoto}
                alt={name}
                roundedCircle
                className="mb-3 border shadow-sm"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center bg-light border shadow-sm"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "2rem",
                  color: "#8e2de2",
                  backgroundColor: "#f8f0ff",
                }}
              >
                {getInitials(name)}
              </div>
            )}

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label className="d-block text-center">Profile Photo</Form.Label>
              <div className="d-flex justify-content-center">
                <label htmlFor="profile-upload" className="btn btn-outline-secondary btn-sm cursor-pointer">
                  <i className="bi bi-camera me-2"></i>
                  Choose Image
                </label>
                <Form.Control
                  type="file"
                  id="profile-upload"
                  onChange={handleFileChange}
                  className="d-none"
                  accept="image/*"
                />
              </div>
            </Form.Group>
          </div>

          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            style={{ backgroundColor: "#8e2de2", borderColor: "#8e2de2" }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default UserProfile
