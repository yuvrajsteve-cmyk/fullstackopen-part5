import { useNavigate, useParams } from "react-router-dom"
import notes from "../services/notes"

const Note = ({ notes, toggleImportance, deleteNote }) => {
    const id = useParams().id
    const navigate = useNavigate()
    const note = notes.find(n => n.id === id)


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
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

export default Note
