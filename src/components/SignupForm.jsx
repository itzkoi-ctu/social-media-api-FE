"use client"

import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Container, Card, Row, Col, Alert, InputGroup, Spinner } from "react-bootstrap"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fileName, setFileName] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "profilePhoto" && files[0]) {
      setFormData({ ...formData, profilePhoto: files[0] })
      setFileName(files[0].name)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("password", formData.password)
    if (formData.profilePhoto) {
      data.append("profilePhoto", formData.profilePhoto)
    }

    try {
      const response = await axios.post("http://localhost:8080/user/signup", data)
      setSuccess("Registration successful! Redirecting to login...")

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        profilePhoto: null,
      })
      setFileName("")
      setPreviewUrl("")

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/signin")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create an Account</h2>
                <p className="text-muted">Join our community today</p>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess("")}>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-person"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">Password must be at least 6 characters long</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Profile Photo</Form.Label>
                  <div className="d-flex mb-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Profile preview"
                        className="rounded-circle me-3"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <i className="bi bi-person text-muted" style={{ fontSize: "2rem" }}></i>
                      </div>
                    )}

                    <div className="d-flex flex-column justify-content-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => document.getElementById("profilePhotoInput").click()}
                        className="mb-1"
                      >
                        Choose Photo
                      </Button>
                      <small className="text-muted">{fileName || "No file chosen"}</small>
                    </div>
                  </div>
                  <Form.Control
                    id="profilePhotoInput"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="d-none"
                  />
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button variant="primary" type="submit" disabled={isSubmitting} className="py-2">
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
