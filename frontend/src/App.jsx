import { useEffect, useState } from 'react'
import loginService from './services/login'
import noteService from './services/notes'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) return

    try {
      const loggedUser = await loginService.login({ username, password })
      setUser(loggedUser)
      noteService.setToken(loggedUser.token)
      setUsername('')
      setPassword('')
    }
    catch (error) {
      console.error(error)
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changeNotes = { ...note, important : !note.important }

    noteService
      .update(id, changeNotes)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        console.error(error)
        setErrorMessage(`The note '${note.content}' was already deleted from server`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const addNote = async (e) => {
    e.preventDefault()

    if (!newNote.trim() || !user) return

    try {
      const noteObject = {
        content: newNote,
        important: Math.random() > 0.5,
      }
      await noteService.create(noteObject, user.token)
      const updatedNotes = await noteService.getAll()
      setNotes(updatedNotes)
      setNewNote('')
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to create note. Please check if you are logged in.')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteNoteOf = (id) => {
    if (window.confirm('Do you really want to delete this note?')) {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(n => n.id !== id))
        })
        .catch(error => {
          console.error(error)
          setErrorMessage('This note was already deleted from server')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const deleteAllNotes = () => {
    if (window.confirm('WARNING! Are you sure you want to delete ALL notes from the database?')) {
      noteService
        .removeAll()
        .then(() => {
          setNotes([])
        })
        .catch(error => {
          console.error(error)
          setErrorMessage('Failed to clear notes from server')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  return (
    <div>
      <h1>Notes app</h1>

      {user === null ? (
        <p>login form</p>
      ) : (
        <p>username {user?.name}</p>
      )}

      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username: <input type="text" value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoComplete="off"
            />
          </label>
        </div>
        <div>
          <label>
            password: <input type="password" value={password}
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div>
        {notes.length > 0 && (
          <button onClick={deleteAllNotes} style={{ backgroundColor: 'darkred', color: 'white', margin: '10px 0', padding: '5px 10px', cursor: 'pointer' }}>
            Delete All Notes
          </button>
        )}

        <ul>
          {notes.map(note => (
            <li key={note.id}>
              {note.content}{' '}
              <button onClick={() => toggleImportanceOf(note.id)}>
                {note.important ? 'make note not important' : 'make important'}
              </button>
              <button onClick={() => deleteNoteOf(note.id)} style={{ marginLeft: '10px', color: 'red' }}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <form onSubmit={addNote}>
          <input type='text' value={newNote}
            onChange={({ target }) => setNewNote(target.value)}
          />
          <button type='submit'>save</button>
        </form>
      </div>

    </div>
  )
}

export default App
