const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'

  return (
    <li style={{ margin: '5px 0' }}>
      {note.content} <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
