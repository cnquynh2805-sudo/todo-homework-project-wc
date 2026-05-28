import { useEffect, useMemo, useState } from 'react'
import TodoItem from './components/TodoItem.jsx'
import './App.css'

const ACTIVITY_TITLES = [
  'Finish React homework',
  'Buy groceries for the week',
  'Read one chapter of a book',
  'Clean the study desk',
  'Review notes for the quiz',
  'Wash dishes after lunch',
  'Practice coding for 30 minutes',
]

const PAGE_SIZE = 3

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadTodos() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos?_limit=6',
        )

        if (!response.ok) {
          throw new Error('Could not load todos')
        }

        const data = await response.json()
        const mappedTodos = data.slice(0, 6).map((todo, index) => ({
          ...todo,
          title: ACTIVITY_TITLES[index],
        }))

        setTodos(mappedTodos)
      } catch {
        setError('Could not fetch todos, so sample homework tasks are shown.')
        setTodos(
          ACTIVITY_TITLES.slice(0, 6).map((task, index) => ({
            id: index + 1,
            title: task,
            completed: index % 2 === 0,
          })),
        )
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [])

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase().trim()),
    )
  }, [search, todos])
  const pageCount = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE))
  const visibleTodos = filteredTodos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const completedCount = todos.filter((todo) => todo.completed).length

  function handleAddTodo(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    setTodos((currentTodos) => [
      {
        id: Date.now(),
        title: trimmedTitle,
        completed: false,
      },
      ...currentTodos,
    ])
    setTitle('')
    setPage(1)
  }

  function handleDeleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  function handleToggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function handleUpdateTodo(id, nextTitle) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, title: nextTitle } : todo,
      ),
    )
  }

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  return (
    <main className="app">
      <section className="todo-panel">
        <div className="app-header">
          <div>
            <p className="top-label">Mini Project</p>
            <h1>Todo List</h1>
          </div>
          <div className="summary-pill">
            <span>{todos.length} total</span>
            <span>{completedCount} done</span>
          </div>
        </div>

        <div className="controls">
          <form className="todo-form" onSubmit={handleAddTodo}>
            <input
              aria-label="New todo title"
              type="text"
              placeholder="Add a new activity"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>
          <input
            aria-label="Search todos"
            type="search"
            placeholder="Search by title"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </div>

        {loading && <p className="message">Loading todos...</p>}
        {error && <p className="message warning">{error}</p>}

        {!loading && (
          <>
            <div className="list-heading">
              <h2>Today&apos;s activities</h2>
              <span>{filteredTodos.length} shown</span>
            </div>

            <div className="todo-grid">
              {visibleTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  number={(page - 1) * PAGE_SIZE + index + 1}
                  onDelete={handleDeleteTodo}
                  onToggle={handleToggleTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </div>

            {visibleTodos.length === 0 && (
              <p className="message">No activities match your search.</p>
            )}

            <div className="pagination">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page === pageCount}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App
