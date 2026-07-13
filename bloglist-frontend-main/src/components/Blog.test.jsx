import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

// 5.14: Blog List Tests, step 2
test('after clicking the view button, URL and likes are displayed', async () => {
  const blog = {
    title: 'Testing the react components',
    author: 'Yuvraj Singh',
    url: 'www.fullstackopen.com/',
    likes: 10 ,
    user: {
      username: 'Tester',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog}/>)

  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('www.fullstackopen.com/')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes 10', { exact: false })
  expect(likesElement).toBeDefined()
})