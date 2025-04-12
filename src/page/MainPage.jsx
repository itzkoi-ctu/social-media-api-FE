import { useState } from 'react';
import SignupForm from '../components/SignupForm';
import SigninForm from '../components/SigninForm';
import CreatePost from '../components/CreatePost';

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('signin');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'signin':
        return <SigninForm />;
      case 'signup':
        return <SignupForm />;
      case 'createpost':
        return <CreatePost />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Social Media App</h1>
      <div style={styles.tabMenu}>
        <button onClick={() => setActiveTab('signin')} style={styles.tabButton}>Đăng nhập</button>
        <button onClick={() => setActiveTab('signup')} style={styles.tabButton}>Đăng ký</button>
        <button onClick={() => setActiveTab('createpost')} style={styles.tabButton}>Tạo bài viết</button>
      </div>

      <div style={styles.formContainer}>
        {renderActiveTab()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  heading: {
    marginBottom: 20,
    color: '#333',
  },
  tabMenu: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  tabButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    marginTop: 20,
    textAlign: 'left',
  }
};
