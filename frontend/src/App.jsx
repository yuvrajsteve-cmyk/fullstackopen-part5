import { useEffect, useRef, useState } from 'react'
import loginService from './services/login'
import noteService from './services/notes'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Toggleable'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Footer from './components/Footer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notes, setNotes] = useState([])
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
      noteService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    }
    catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => { setErrorMessage(null) }, 5000)
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
      .catch( () => {
        setErrorMessage(`The note '${note.content}' was already deleted from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
      .catch((error) => {
        const msg = error.response?.data?.error || 'failed to create note'
        setErrorMessage(msg)
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
        .catch( () => {
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
        .catch( () => {
          setErrorMessage('Failed to clear notes from server')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const padding = { padding: 5 }

  return (
    <Router>
      <div>
        <h1>Notes app</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <div style={{ background: 'lightgray', padding: 10, marginBottom: 10 }}>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          <Link style={padding} to="/create">new note</Link>
          {user ? (
            <em style={{ marginLeft: 10 }}>{user.name} logged in</em>
          ) : (
            <Link style={padding} to="/login">login</Link>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/notes" element={
            <NoteList 
              notesToShow={notesToShow}
              toggleImportanceOf={toggleImportanceOf}
              deleteNoteOf={deleteNoteOf}
              deleteAllNotes={deleteAllNotes}
              notes={notes}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          } />
          
          <Route path="/create" element={
            user ? <NoteForm createNote={addNote} /> : <Navigate replace to="/login" />
          } />
          
          <Route path="/login" element={
            !user ? (
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
            ) : (
              <Navigate replace to="/notes" />
            )
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
