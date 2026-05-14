import { useState } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { Todo } from '@/types';
import styles from './TodoItem.module.css';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  function handleEditSubmit(): void {
    if (editValue.trim()) {
      onEdit(todo.id, editValue);
    } else {
      setEditValue(todo.text);
    }
    setEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditValue(todo.text);
      setEditing(false);
    }
  }

  function startEditing(): void {
    setEditValue(todo.text);
    setEditing(true);
  }

  return (
    <li className={clsx(styles.item, todo.completed && styles.completed)}>
      <button
        className={clsx(styles.checkbox, todo.completed && styles.checked)}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as complete'}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {editing ? (
        <input
          className={styles.editInput}
          value={editValue}
          autoFocus
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
        />
      ) : (
        <span
          className={styles.text}
          onDoubleClick={startEditing}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      <div className={styles.actions}>
        {editing ? (
          <>
            <button
              className={clsx(styles.actionBtn, styles.saveBtn)}
              onClick={handleEditSubmit}
              aria-label="Save"
            >
              <Check size={15} />
            </button>
            <button
              className={clsx(styles.actionBtn, styles.cancelBtn)}
              onClick={() => { setEditValue(todo.text); setEditing(false); }}
              aria-label="Cancel"
            >
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            <button
              className={clsx(styles.actionBtn, styles.editBtn)}
              onClick={startEditing}
              aria-label="Edit"
            >
              <Pencil size={15} />
            </button>
            <button
              className={clsx(styles.actionBtn, styles.deleteBtn)}
              onClick={() => onDelete(todo.id)}
              aria-label="Delete"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
