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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const ProtectedRoute = ({ children }) => {
    if (isLoading) return null // hoặc hiển thị loading spinner
    return isAuthenticated ? children : <Navigate to="/signin" />
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          {!isLoading && (
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
            </Routes>
          )}
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">© 2025 SocialApp. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}


export default App
