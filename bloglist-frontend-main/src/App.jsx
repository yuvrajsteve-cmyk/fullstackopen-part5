import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Togglealbe'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
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
      console.log('wrong password', username)
      setMessage('wrong username and password')
      setTimeout(() => { setMessage(null) }, 5000)
    }
  }

  const handleLikes = async (id, blogObject) => {
    try{
      const updatedBlog = await blogService.update(id, blogObject)
      const blogWithUser = {
        ...updatedBlog,
        user: blogs.find(b => b.id === id).user
      }
      setBlogs(blogs.map(blog => blog.id === id ? blogWithUser : blog))
    }catch (exception) {
      console.log('Error updating likes' , exception)
    }
  }

  const handleDelete = async (id, blogTitle, blogAuthor) => {
    if (window.confirm(`Remove blog ${blogTitle} by ${blogAuthor}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setMessage('Blog removed successfully')
        setTimeout(() => setMessage(null), 5000)
      } catch (exception) {
        console.log('Error deleting blogs', exception)
      }
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => { setMessage(null) }, 5000)
    } catch (exception) {
      console.log('this error', exception.response?.data || exception)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const padding = { padding: 5 }

  return (
    <div>
      {message !== null && (
        <div style={{
          color: message.includes('wrong') ? 'red' : 'green',
          background: 'lightgrey',
          fontSize: '20px',
          borderStyle: 'solid',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '10px'
        }}>
          {message}
        </div>
      )}

      <div style={{ background: 'lightgray', padding: 10, marginBottom: 10 }}>
        <Link style={padding} to="/">blogs</Link>
        {user ? (
          <span>
            <em style={{ marginLeft: 10 }}>username {user.name} </em>
            <button onClick={handleLogout} style={{ marginLeft: 10 }}>logout</button>
          </span>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </div>

      <h1>login in to application</h1>

      <Routes>
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            {user && (
              <Toggleable buttonLabel='create a new blog' ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Toggleable>
            )}
            {blogs
              .toSorted((a, b) => b.likes - a.likes)
              .map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  updatedBlog={handleLikes}
                  deleteBlog={handleDelete}
                  currentUser={user} />
              )
            }
          </div>
        } />

        <Route path="/login" element={
          !user ? (
            <div>
              <h2>blogs</h2>
              <h2>{user?.name} logged in </h2>
              <form onSubmit={handleLogin}>
                <div>
                  <label>
                    username: <input id="username" type="text" value={username}
                      onChange={({ target }) => setUsername(target.value)} />
                  </label>
                </div>
                <div>
                  <label>
                    password: <input id="password" type="password" value={password}
                      onChange={({ target }) => setPassword(target.value)} />
                  </label>
                </div>
                <button type="submit">login</button>
              </form>
            </div>
          ) : (
            <Navigate replace to="/" />
          )
        } />
      </Routes>
    </div>
  )
}

export default App
