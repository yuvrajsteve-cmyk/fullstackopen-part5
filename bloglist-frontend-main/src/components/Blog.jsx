import { useState } from 'react'

const Blog = ({ blog, updatedBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showRemoveButton = blog?.user && currentUser && blog.user.username === currentUser.username

  const handleLikeClick = () => {
    const likedBlog = {
      user : blog?.user?.id || null,
      likes : (blog?.likes || 0) + 1,
      author : blog?.author,
      title : blog?.title,
      url : blog?.url
    }
    updatedBlog(blog?.id, likedBlog)
  }

  const handleRemoveClick = () => {
    deleteBlog(blog?.id, blog?.title, blog?.author)
  }
  console.log('CurrentUser:', currentUser)
  console.log('BlogUser:', blog?.user)

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog?.title} — {blog?.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog?.url}</div>
          <div>
            likes {blog?.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          <div>{blog?.user ? blog.user.name : 'anonymous'}</div>

          {showRemoveButton && (
            <div style={{ marginTop: 5 }}>
              <button
                onClick={handleRemoveClick}
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog