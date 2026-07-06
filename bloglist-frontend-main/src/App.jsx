import { useState, useEffect } from "react"
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)

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
    } catch {
      console.log('wrong password', username)
      setMessage('wrong username and password')
      setTimeout(() => { setMessage(null) }, 5000)
    }
  }
      
  const addBlog = async (e) => {
    e.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url }) 
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => { setMessage(null) }, 5000)
    } catch (exception) {
      console.log('this error', exception.response?.data || exception)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (user === null) {
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

        <h1>login in to application</h1>
        <h2>blogs</h2>
        <h2>{user?.name} logged in </h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username: <input type="text" value={username}
                onChange={({ target }) => setUsername(target.value)} />
            </label>
          </div>
          <div>
            <label>
              password: <input type="text" value={password}
                onChange={({ target }) => setPassword(target.value)} />
            </label>
          </div>  
          <button type="submit">login</button>
        </form> 
      </div>
    )
  }
    
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

      <h1>login in to application</h1>
      <h2>blogs</h2>
      <form onSubmit={addBlog}>
        <div>
          title: <input type="text" value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author: <input type="text" value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url: <input type="text" value={url} 
            onChange={({ target }) => setUrl(target.value)} />
        </div><br />
        <button type="submit">create</button>
      </form>
      <h2>username {user?.name} <button onClick={handleLogout}>logout</button></h2>
      {
        blogs.map(blog => 
          <li key={blog.id}>{blog.title} -- {blog.author} -- {blog.url}</li>
        )
      }
    </div>
  )
}

export default App
