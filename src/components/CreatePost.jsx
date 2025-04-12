import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    data.append('title', title);
    data.append('text', text);
    data.append('tags', tags.split(','));
    if (mediaFile) data.append('mediaFile', mediaFile);

    try {
      const res = await axios.post('http://localhost:8080/posts', data, config);
      setMessage({ type: 'success', text: 'Post created successfully!' });
      // Reset form
      setTitle('');
      setText('');
      setTags('');
      setMediaFile(null);
      setFileName('');
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error creating post. Please try again.' });
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Create New Post</h4>
        </Card.Header>
        <Card.Body>
          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
              {message.text}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter post title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                placeholder="What's on your mind?" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Separate tags with commas (e.g., news,tech,social)" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)}
              />
              <Form.Text className="text-muted">
                Add relevant tags to help others find your post
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Media (Optional)</Form.Label>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => document.getElementById('fileInput').click()}
                  className="me-3"
                >
                  Choose File
                </Button>
                <span className="text-muted">
                  {fileName || 'No file chosen'}
                </span>
              </div>
              <Form.Control 
                id="fileInput"
                type="file" 
                onChange={handleFileChange}
                className="d-none"
              />
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                className="py-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
