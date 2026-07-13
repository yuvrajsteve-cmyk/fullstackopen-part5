import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but does not render URL or likes by dfault', () => {
  const blog = {
    title : 'Testing the react components',
    author : 'Yuvraj Singh',
    url : 'www.fullstackopen.com/pa',
    likes : 15,
    users : {
      username : 'tester',
      name : 'Test User'
    }
  }

  render(<Blog blog={blog}/>)

  const titleAndAuthor = screen.getByText('Testing the react components', { exact:false })
  expect(titleAndAuthor).toBeDefined()

  const urlElement = screen.queryByText('www.fullstackopen.com/pa')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes : 15', { exact: false })
  expect(likesElement).toBeNull()
})