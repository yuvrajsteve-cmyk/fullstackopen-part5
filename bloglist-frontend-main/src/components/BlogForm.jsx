import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <Box component='form' onSubmit={addBlog} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
  <Typography variant='h4'>create new</Typography>
  <TextField  
    label='title' 
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    />
    <TextField 
     label='author'
     value={author}
     onChange={({ target }) => setAuthor(target.value)}
    />
    <TextField 
      label='url'
      value={url}
      onChange={({ target }) => setUrl(target.value)}
    />
    <Button variant='contained' type='submit'>Create</Button>
    </Box>
  )
}

export default BlogForm
