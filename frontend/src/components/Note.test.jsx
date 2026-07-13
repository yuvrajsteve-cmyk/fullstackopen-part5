import { render, screen } from '@testing-library/react'
import Note from './Note'
import { expect } from 'vitest'

// test 1
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})

//test 2
test('shows right button label when note is not important' , () => {
  const note = {
    content: 'Learning test is fun',
    important: false
  }
  render(<Note note={note}/>)

  const button = screen.getByText('make important')
  expect(button).toBeDefined()
})

//test 3
test('new test for me button', () => {
  const note = {
    content: 'hello',
    important: true
  }
  render(<Note note={note} />)

  const button = screen.getByText('make not important')
  expect(button).toBeDefined()
})

//test 4
test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note}/>)

  const element = screen.queryByText('do not want this thing to be renderd')
  expect(element).toBeNull()
})