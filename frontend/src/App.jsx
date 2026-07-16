import { useEffect, useRef, useState } from 'react'
import loginService from './services/login'
import noteService from './services/notes'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Toggleable'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useMatch } from 'react-router-dom'
import Home from './components/Home'
import Footer from './components/Footer'
import Note from './components/Note'
import { AppBar, Button, CardHeader, Container, Toolbar, Typography } from '@mui/material'
import Notification from './components/Notification'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)

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
        setNotification({ text: `Note '${returnedNote.content}' added!`, type: 'success'})
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

 

 const match = useMatch('/notes/:id')
const note = match
  ? notes.find(note => note.id == match.params.id)
  : null




    return (
      <Container>
    <AppBar position='static'>
      <Toolbar>
        <Button color='inherit' component={Link} to='/'>Home</Button>
        <Button color='inherit' component={Link} to='/notes'>Notes</Button>
        <Button color='inherit' component={Link} to='/create'>New Notes</Button>
        {user ? (
          <em>{user.name} logged in</em>
        ) : (
          <Button color='inherit' component={Link} to='/login'>Login</Button>
        )}
      </Toolbar>
    </AppBar>
    <Notification notification={notification}/>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

   <h1>Notes App</h1>

   <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='/notes' element={
      <NoteList 
      notes={notes}
      showAll={showAll}
      toggleImportanceOf={toggleImportanceOf}
      deleteNoteOf={deleteNoteOf}
      deleteAllNotes={deleteAllNotes}
      notesToShow={notesToShow}
      setShowAll={setShowAll}
      />
    }/>
    <Route path='/create' element={
      user ? <NoteForm createNote={addNote}/> : <Navigate replace to='/login'/>
    } />
    <Route path="/login" element={
        !user ? <LoginForm /> : <Navigate replace to="/notes" />
      } />
    <Route path='/notes/:id' element={
      <Note notes={notes} toggleImportance={toggleImportanceOf} deleteNote={deleteNoteOf}/>
    } />  
   </Routes>
   <Footer />
    </Container>
  )

}

export default App

