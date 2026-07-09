import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'

const baseUrl = '/api/notes'
const loginUrl = '/api/login'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setNotes(response.data)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    token = null
  }

  const addNote = (event) => {
    event.preventDefault()
    const config = { headers: { Authorization: token } }
    const noteObject = {
      content: newNote,
      important: true
    }

    axios.post(baseUrl, noteObject, config).then(response => {
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    const config = { headers: { Authorization: token } }

    axios.put(`${baseUrl}/${id}`, changedNote, config)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
      .catch(() => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(loginUrl, { username, password })
      const user = response.data

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ color: 'green', fontStyle: 'italic', margin: '0 0 10px 0' }}>Notes app</h1>


      <Notification message={errorMessage} />

      {!user && (
        <div>
          <h2 style={{ margin: '10px 0' }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div style={{ margin: '5px 0' }}>
              password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      )}

      {user && (
        <div>
          <p>
            <strong>{user.name}</strong> logged in {' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">save</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul style={{ paddingLeft: '20px' }}>
        {notesToShow.map(note => (

          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>


      <Footer />
    </div>
  )
}

export default App
