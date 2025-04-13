  "use client"

  import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
  import { useEffect, useState } from "react"
  import NavBar from "./components/NavBar"
  import SigninForm from "./components/SigninForm"
  import SignupForm from "./components/SignupForm"
  import CreatePost from "./components/CreatePost"
  import PostsPage from "./components/PostsPage"
  import "bootstrap/dist/css/bootstrap.min.css"
  import "bootstrap-icons/font/bootstrap-icons.css"
 import { AuthProvider, useAuth } from "./page/AuthContext"

import UserProfile from "./components/UserProfile"
import MyPost from "./components/MyPost"

function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return null;
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavBar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="/posts" />} />
              <Route path="/signin" element={<SigninForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <PostsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile/:userId/details"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/mypost/:userId"
                element={
                  <ProtectedRoute>
                    <MyPost />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <footer className="bg-dark text-white text-center py-3 mt-auto">
            <p className="mb-0">© 2025 SocialApp. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}


  export default App
