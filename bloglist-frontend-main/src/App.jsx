import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Alert } from '@mui/material'

import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setMessage('wrong username and password')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const match = useMatch('/blogs/:id')
  const matchedBlog = match ? blogs.find(b => b.id === match.params.id) : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          {user && <Button color="inherit" component={Link} to="/create">create new</Button>}
          {user ? (
            <>
              <em style={{ marginLeft: 'auto', marginRight: 10 }}>{user.name} logged in</em>
              <Button color="inherit" onClick={handleLogout}>logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">login</Button>
          )}
        </Toolbar>
      </AppBar>

      {message && <Alert severity={message.includes('wrong') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}

      <Routes>
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
              <div key={blog.id} style={{ padding: 10, border: '1px solid #ccc', margin: 5 }}>
                <Link to={`/blogs/${blog.id}`}>{blog.title} — {blog.author}</Link>
              </div>
            )}
          </div>
        } />
        <Route path="/create" element={user ? <BlogForm /> : <Navigate to="/login" />} />
        <Route path="/blogs/:id" element={<SingleBlog blog={matchedBlog} />} />
        <Route path="/login" element={
          !user ? <LoginForm
            handleSubmit={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          /> : <Navigate to="/" />
        } />
      </Routes>
    </Container>
  )
}

export default App