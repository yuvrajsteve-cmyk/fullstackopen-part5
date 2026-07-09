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
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      noteService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(loggedUser)
      )
      noteService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    }
    catch (error) {
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
        setErrorMessage(`The note '${note.content}' was already deleted from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (e) => {
    e.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
      .catch(error => {
        setErrorMessage('Failed to create note')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const deleteNoteOf = (id) => {
    if (window.confirm('Do you really want to delete this note?')) {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter(n => n.id !== id))
        })
        .catch(error => {
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
          setErrorMessage('Failed to clear notes from server')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const loginForm = () => (
    <div>
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
    </div>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input type='text' value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
      />
      <button type='submit'>save</button>
    </form>
  )

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes app</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <div>
        {notes.length > 0 && (
          <button onClick={deleteAllNotes} style={{ backgroundColor: 'darkred', color: 'white', margin: '10px 0', padding: '5px 10px', cursor: 'pointer' }}>
            Delete All Notes
          </button>
        )}

        <ul>
          {notesToShow.map(note => (
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
    </div>
  )
}

export default App
