import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()

  const addNote = event => {
    event.preventDefault()
    createNote ({
      content: newNote,
      important: true
    })
    navigate('/notes')
    setNewNote('')
  }

  return(
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <TextField
          label value={newNote} placeholder='write note content here'
          onChange={event => setNewNote(event.target.value)
          }
        />
        <Button type='submit' variant='contained' style={{ margin: 10}}>save</Button>
      </form>

    </div>
  )
}

export default NoteForm
