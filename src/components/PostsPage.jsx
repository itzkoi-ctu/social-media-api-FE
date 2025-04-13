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
} from "react-bootstrap"

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8080/posts")
      setPosts(res.data.content)
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

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading posts...</p>
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
        New feeds
      </h2>

      {posts.length === 0 ? (
        <Card className="text-center p-5 bg-light">
          <Card.Body>
            <h4>Chưa có bài viết nào</h4>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {posts.map((post) => (
            <Col md={6} lg={4} className="mb-4" key={post.id}>
              <Card className="h-100 shadow-sm hover-shadow">
                {post.mediaType === "IMAGE" && (
                  <Card.Img
                    variant="top"
                    src={post.presignedUrl}
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text className="text-truncate">{post.text}</Card.Text>
                  <h6>Tags:</h6>
                  <Card.Text className="text-muted small">
                    {post.tags?.join(", ")}
                  </Card.Text>
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
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="d-inline-flex align-items-center"
                    >
                      <i className="bi bi-heart-fill me-1"></i> Like
                    </Button>
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
    </Container>
  )
}
