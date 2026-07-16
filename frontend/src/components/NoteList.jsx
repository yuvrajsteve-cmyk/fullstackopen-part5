import { Form, Link } from "react-router-dom" // first import the Link from the react router dom
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonBase, IconButton } from '@mui/material';


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
                <Button variant="contained" onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all' }
                </Button>
            </div>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Content</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
            {notes.length > 0 && (
                <Button color="error" onClick={deleteAllNotes}>
                    delete all notes
                </Button>
            )}
            <ul>
                {notesToShow.map(note => (
                    <TableRow key={note.id}>
                        <TableCell>
                       <Link to={`/notes/${note.id}`}>{note.content}</Link>
                        <Button variant="text" size="small" color="red" onClick={() => toggleImportanceOf(note.id)}>
                            {note.important ? 'make note not important' : 'make important'}
                        </Button>
                        <Button variant="contained" color="green" size="small" onClick={() => deleteNoteOf(note.id)} >
                            delete
                        </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </ul>
            </TableBody>
            </Table>
            </TableContainer>
        </div>
    
    )
}

export default NoteList