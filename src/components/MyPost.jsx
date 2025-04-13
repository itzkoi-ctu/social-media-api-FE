"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap"
import { useParams } from "react-router-dom"

export default function MyPost() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editText, setEditText] = useState("")
  const [editTags, setEditTags] = useState([])
  const [editFile, setEditFile] = useState(null)
  const {userId} = useParams()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:8080/posts/creator/${userId}`) 
      setPosts(res.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to load posts. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token")
    try {
      await axios.post(`http://localhost:8080/posts/${postId}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchPosts()
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token")
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này?")) return

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchPosts()
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Xoá bài viết thất bại.")
    }
  }

  const handleDeleteAll = async () => {
    const token = localStorage.getItem("token")
    if (!window.confirm("Bạn có chắc muốn xoá tất cả bài viết của bạn?")) return

    try {
      await axios.delete(`http://localhost:8080/posts/creator/delete?creatorId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchPosts()
    } catch (err) {
      console.error("Error deleting all posts:", err)
      alert("Xoá tất cả bài viết thất bại.")
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditText(post.text)
    setEditTags(post.tags?.join(", ") || "")
    setEditFile(null)
    setShowEditModal(true)
  }

  const submitEditForm = async () => {
    if (!editingPost) return
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("title", editTitle)
    formData.append("text", editText)
    formData.append("tags", editTags);
    if (editFile) {
      formData.append("mediaFile", editFile || "");
    }

    try {
      await axios.put(`http://localhost:8080/posts/${editingPost.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setShowEditModal(false)
      setEditingPost(null)
      setEditFile(null)
      fetchPosts()
    } catch (err) {
      console.error("Error updating post:", err)
      alert("Cập nhật bài viết thất bại.")
    }
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải bài viết...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-clipboard-check me-2"></i>
        Bài viết mới nhất
      </h2>

      {/* Add Delete All button */}
      <Button variant="outline-danger" onClick={handleDeleteAll} className="mb-4">
        <i className="bi bi-trash-fill me-1"></i> Xoá tất cả bài viết
      </Button>

      {posts?.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <Card.Body>
            <h4>Chưa có bài viết nào.</h4>
            <p className="text-muted">Đăng bài viết đầu tiên của bạn!</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {posts?.map((post) => (
            <Col md={6} lg={4} className="mb-4" key={post.id}>
              <Card className="h-100 shadow-sm hover-shadow">
                {post?.mediaType === "IMAGE" && (
                  <Card.Img
                    variant="top"
                    src={post.presignedUrl}
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{post?.title}</Card.Title>
                  <Card.Text className="text-truncate">{post.text}</Card.Text>
                  <h6>Tags:</h6>
                  <Card.Text className="text-muted small">{post.tags?.join(", ")}</Card.Text>
                  <div className="d-flex align-items-center mt-3">
                    <img
                      src={post.creator.profilePhoto || "/placeholder.svg"}
                      alt="Avatar"
                      width="40"
                      height="40"
                      className="rounded-circle me-2"
                    />
                    <div>
                      <strong>{post.creator.name}</strong>
                      <div className="text-muted small">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="me-2 d-inline-flex align-items-center"
                      >
                        <i className="bi bi-heart-fill me-1"></i> Like
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="me-2 d-inline-flex align-items-center"
                      >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="d-inline-flex align-items-center"
                      >
                        <i className="bi bi-trash-fill me-1"></i> Delete
                      </Button>
                    </div>
                    <Badge bg="light" text="dark" pill>
                      {post.likes} likes
                    </Badge>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal chỉnh sửa */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </Form.Group>

            <Form.Label>Tags</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Separate tags with commas (e.g., news,tech,social)" 
                value={editTags} 
                onChange={(e) => setEditTags(e.target.value)}
              />
            <Form.Group className="mb-3">
              <Form.Label>Ảnh / Video (nếu muốn thay đổi)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setEditFile(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={submitEditForm}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
