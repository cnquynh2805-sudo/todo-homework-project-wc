import { useState } from 'react'
import './todoItem.css'

function TodoItem({ todo, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)

  function handleSubmit(event) {
    event.preventDefault()
    const nextTitle = draftTitle.trim()

    if (!nextTitle) {
      return
    }

    onUpdate(todo.id, nextTitle)
    setIsEditing(false)
  }

  return (
    <article className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-status">
        <label>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          {todo.completed ? 'Done' : 'Not done'}
        </label>
      </div>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            aria-label="Edit todo title"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <h2>{todo.title}</h2>
      )}

      <div className="todo-actions">
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setDraftTitle(todo.title)
            setIsEditing((currentValue) => !currentValue)
          }}
        >
          {isEditing ? 'Cancel' : 'Update'}
        </button>
        <button type="button" className="danger" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default TodoItem
