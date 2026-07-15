import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import SingleBlog from './SingleBlog'

describe('SingleBlog view rendering', () => {
  const blog = {
    id: '6a5708d8cbf02a518d3b3662',
    title: 'Testing Blog Routing with Vitest',
    author: 'Full Stack Open Guru',
    url: 'http://localhost:5173/blogs/abc',
    likes: 42,
    user: {
      username: 'creatoruser',
      name: 'Satinderpal Singh',
      id: '6a5708d8cbf02a518d3b3661'
    }
  }

  test('displays blog information and likes to unauthenticated users, but hides buttons', () => {
    render(
      <SingleBlog
        blog={blog}
        handleLikes={() => {}}
        currentUser={null}
      />
    )

    expect(screen.getByText('Testing Blog Routing with Vitest by Full Stack Open Guru')).toBeInTheDocument()
    expect(screen.getByText('http://localhost:5173/blogs/abc')).toBeInTheDocument()
    expect(screen.getByText('likes 42')).toBeInTheDocument()
    expect(screen.getByText('added by Satinderpal Singh')).toBeInTheDocument()

    const likeButton = screen.queryByRole('button', { name: 'like' })
    const deleteButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).not.toBeInTheDocument()
    expect(deleteButton).not.toBeInTheDocument()
  })

  test('displays the like button to authenticated users who are not the creator, but hides the delete button', () => {
    const nonCreatorUser = {
      username: 'anotheruser',
      name: 'Second User',
      id: '9b8708d8cbf02a518d3b3669'
    }

    render(
      <SingleBlog
        blog={blog}
        handleLikes={() => {}}
        currentUser={nonCreatorUser}
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  })
})
