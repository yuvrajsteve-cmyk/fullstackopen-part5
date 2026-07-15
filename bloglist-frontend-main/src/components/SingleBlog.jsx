const SingleBlog = ({ blog, handleLikes, currentUser }) => {
  if (!blog) {
    return null
  }

  const handleLikeClick = () => {
    if (!currentUser) {
      alert('You must be logged in to like a blog')
      return
    }

    const likedBlog = {
      user: blog.user?.id || blog.user,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    handleLikes(blog.id, likedBlog)
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
      <div>
        likes {blog.likes}
        <button onClick={handleLikeClick}>like</button>
      </div>
      <div>added by {blog.user?.name || 'anonymous'}</div>
    </div>
  )
}

export default SingleBlog
