import { Link } from "react-router-dom" // first import the Link from the react router dom

const NoteList = ({ notesToShow, 
                    toggleImportanceOf, 
                    deleteNoteOf, 
                    deleteAllNotes,
                    notes,
                    showAll, 
                setShowAll}) => {

    return(
        <div>
            <div>
                <button onClick={() => setShowAll(!showAll)} 
                         style={{marginLeft : '10px',
                                         color : 'black',
                                         border : 'none',
                                         borderRadius : '10px'}}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>

            {notes.length > 0 && (
                <button onClick={deleteAllNotes} style={{backgroundColor: 'red',
                    color : 'white',
                    margin : '10px 0',
                    padding : '5px 10px',
                    cursor : 'pointer',
                    border : 'none',
                    borderRadius : '10px'
                }}>
                    delete all notes
                </button>
            )}
            <ul>
                {notesToShow.map(note => (
                    <li key={note.id}>
                        {note.content} {' '}
                        <button onClick={() => toggleImportanceOf(note.id)}
                                 style={{marginLeft : '10px',
                                         color : 'black',
                                         border : 'none',
                                         borderRadius : '10px'}}>
                            {note.important ? 'make note not important' : 'make important'}
                        </button>
                        <button onClick={() => deleteNoteOf(note.id)} 
                                style={{marginLeft : '10px',
                                         color : 'black',
                                         border : 'none',
                                         borderRadius : '10px'}}>
                            delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NoteList