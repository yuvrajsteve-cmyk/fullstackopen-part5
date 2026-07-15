import { getByText, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

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

// 5.15: Blog List Tests, step 3
test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Testing the react components',
    author: 'Yuvraj Singh',
    url: 'www.fullstackopen.com/',
    likes: 20,
    user: {
      username: 'tester',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updatedBlog={mockHandler}/>)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

// 5.16: Blog List Tests, step 4
test('form calls the event handler with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing React Forms')
  await user.type(authorInput, 'Yuvraj Singh')
  await user.type(urlInput, 'www.fullstackopen.com/')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing React Forms')
  expect(createBlog.mock.calls[0][0].author).toBe('Yuvraj Singh')
  expect(createBlog.mock.calls[0][0].url).toBe('www.fullstackopen.com/')
})
