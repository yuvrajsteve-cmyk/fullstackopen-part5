import { useState } from "react"

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBotton: 5,
  }
  const buttonLabel = visible ? 'hide' : 'view'
 return (
    <div style={blogStyle}>
      <div>
        {blog.title} — {blog.author} 
        
        <button onClick={() => setVisible(!visible)}> {buttonLabel}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} 
            {/* <button>like</button>  */}
          </div>
          <div>{blog.user ? blog.user.name : 'anonymous'}</div>
        </div>
      )}
    </div>
  )
}

 


export default Blog