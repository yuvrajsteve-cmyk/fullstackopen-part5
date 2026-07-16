import { useNavigate, useParams } from "react-router-dom"
import notes from "../services/notes"
import { Button } from "@mui/material"

const Note = ({ notes, toggleImportance, deleteNote }) => {
    const id = useParams().id
    const navigate = useNavigate()
    const note = notes.find(n => n.id === id)

    if(!note) {
      return null
    }
 

  const label = note.important
    ? 'make not important'
    : 'make important'

    const handleDelete = () => {
      if (window.confirm(`Delete note "${note.content}"?`))
        deleteNote(id)
      navigate('/notes')
    }

  return (
    <li className="note">
      your awsome note: {note.content}
      <Button onClick={toggleImportance}>{label}</Button>
      <Button onClick={handleDelete}>delete</Button>
    </li>
  )
}

export default Note
