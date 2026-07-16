import { Card, CardContent, Typography, Button, Box, Link } from '@mui/material'

const SingleBlog = ({ blog, handleLikes, handleRemove, currentUser }) => {
  if (!blog) return null

  const isCreator = currentUser && blog.user && currentUser.username === blog.user.username

  return (
    <Card sx={{ mt: 3, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>{blog.title}</Typography>

        <Link href={blog.url} target="_blank" rel="noopener" sx={{ display: 'block', mb: 2 }}>
          {blog.url}
        </Link>

        <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
          {blog.likes} likes
          {currentUser && (
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 2 }}
              onClick={() => handleLikes(blog.id, { ...blog, likes: blog.likes + 1 })}
            >
              LIKE
            </Button>
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          added by {blog.user?.name || 'Unknown'}
        </Typography>

        {isCreator && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleRemove(blog.id)}
          >
            REMOVE
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default SingleBlog