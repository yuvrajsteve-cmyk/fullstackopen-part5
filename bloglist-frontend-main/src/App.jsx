import { useState, useEffect } from "react";
import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
      blogService.getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
    }, [])

    const handleLogin = async (e) => {
      e.preventDefault()

      try {
        const user = await loginService.login({ username, password })
        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
          console.log('wrong password', username)
      } 
  }

  if(user === null) {
      return (
         <div>
          <h1>login in to application</h1>
          <h2>blogs</h2>
          <h2>username {user?.name}</h2>
        <form onSubmit={handleLogin}>
        <div>
          <label>
        username: <input type="text" value={username}
                  onChange={({target}) => 
                  setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
        password: <input type="text" value={password}
                  onChange={({target}) => 
                  setPassword(target.value)}/>
          </label>
        </div>  
        <button type="submit">login</button>
        </form> 
        </div>
      )
    } return (
        <div>
          {
            blogs.map(blog => 
              <li key={blog.id}>{blog.title}</li>
            )
          }
        </div>
    )
}

export default App