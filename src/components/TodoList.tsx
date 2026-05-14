import { Todo } from '@/types';
import TodoItem from '@/components/TodoItem';
import styles from './TodoList.module.css';
import { CheckCheck } from 'lucide-react';
import clsx from 'clsx';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onToggleAll: () => void;
  allCompleted: boolean;
};

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onToggleAll,
  allCompleted,
}: TodoListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleAllRow}>
        <button
          className={clsx(styles.toggleAllBtn, allCompleted && styles.allDone)}
          onClick={onToggleAll}
          title={allCompleted ? 'Mark all active' : 'Mark all complete'}
        >
          <CheckCheck size={18} />
          <span>{allCompleted ? 'Uncheck all' : 'Complete all'}</span>
        </button>
      </div>

      {todos.length === 0 ? (
        <div className={styles.noItems}>
          <p>No todos in this filter.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
