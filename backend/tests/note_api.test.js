const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const assert = require('assert')

const api = supertest(app)

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_MONGODB_URI)
    console.log('Connected to MongoDB successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
  }
})
      


     beforeEach(async () => {
            await Note.deleteMany({}) 
            
            for (let note of helper.initialNotes) {
              let noteObject = new Note(note)
              await noteObject.save()
              }
            })


        //  first describe
        describe('when there is initially some notes saved', () => {
                
         
          // first test for notes 
          test('notes are returned as json', async () => {
        console.log('entered test')
        await api
          .get('/api/notes')
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })

      // the second test  for notes 
      test('all notes are returned' , async () => {
        const response = await api.get('/api/notes')

        assert.strictEqual(response.body.length, helper.initialNotes.length)
      })
      
      // the third test for the notes 
      test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')

        const contents = response.body.map(e => e.content)
        assert(contents.includes('HTML is easy'))
      })

    })  

    /////////////////////////////////////////////////////////////////

    // the second describe 
    describe('viewing a specific note', () => {
      // fourth test 
      test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb()
        
        const notesToView = notesAtStart[0]

        const resultNote = await api.get(`/api/notes/${notesToView.id}`)
              .expect(200)
              .expect('Content-Type', /application\/json/)

              assert.deepStrictEqual(resultNote.body, notesToView)
      })

      // fifth test 
     test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`) 
      .expect(404) 
  })

  // sixth test 
  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

////////////////////////////////////////////////////////////////////////////

// third describe 
describe('addition of a new note', () => {
  //  seventh test 
  test('succeed with valid data', async () =>  {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true
    }

    await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)

    assert(contents.includes('async/await simplifies making async calls'))
  })
     // eights test
   test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })

})

///////////////////////////////////////////////////////////////////////////////
// fourth describe 
 describe('deletion of a note', () => {

  // nineth test 
  test('succeeds with status code 204 if id is valid', async () => {
  const notesAtStart = await helper.notesInDb()
  console.log('Start count:', notesAtStart.length) 

  const noteToDelete = notesAtStart[0]
  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const notesAtEnd = await helper.notesInDb()
  console.log('End count:', notesAtEnd.length) 
  assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
})
})

      





afterAll(async () => {
  await mongoose.connection.close()
})

