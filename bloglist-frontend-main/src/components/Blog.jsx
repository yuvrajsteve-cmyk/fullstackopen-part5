import { useState } from "react"

const Blog = ({ blog, updatedBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBotton: 5,
  }
  const handleLikeClick = () => {
    const likedBlog = {
      user : blog.user?.id || null,
      likes : blog.likes + 1,
      author : blog.author,
      title : blog.title,
      url : blog.url
    }
    updatedBlog(blog.id, likedBlog)
  }

 return (
    <div style={blogStyle}>
      <div>
        {blog.title} — {blog.author} 
        
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} 
            <button onClick={handleLikeClick}>like</button> 
          </div>
          <div>{blog.user ? blog.user.name : 'anonymous'}</div>
        </div>
      )}
    </div>
  )
}

 


export default Blog