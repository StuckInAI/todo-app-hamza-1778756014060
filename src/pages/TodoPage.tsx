import styles from './TodoPage.module.css';
import { useTodos } from '@/hooks/useTodos';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TodoFilter from '@/components/TodoFilter';
import TodoFooter from '@/components/TodoFooter';
import { CheckSquare, Loader2, AlertCircle } from 'lucide-react';

export default function TodoPage() {
  const todoState = useTodos();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.headerIcon}>
            <CheckSquare size={32} color="var(--color-primary)" />
          </span>
          <h1 className={styles.title}>My Todos</h1>
        </header>

        {todoState.error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{todoState.error}</span>
          </div>
        )}

        <div className={styles.card}>
          <TodoInput onAdd={todoState.addTodo} />

          {todoState.loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={24} className={styles.spinner} />
              <span>Loading todos…</span>
            </div>
          ) : (
            <>
              {todoState.allTodos.length > 0 && (
                <>
                  <TodoFilter filter={todoState.filter} setFilter={todoState.setFilter} />
                  <TodoList
                    todos={todoState.todos}
                    onToggle={todoState.toggleTodo}
                    onDelete={todoState.deleteTodo}
                    onEdit={todoState.editTodo}
                    onToggleAll={todoState.toggleAll}
                    allCompleted={todoState.activeCount === 0 && todoState.allTodos.length > 0}
                  />
                  <TodoFooter
                    activeCount={todoState.activeCount}
                    completedCount={todoState.completedCount}
                    onClearCompleted={todoState.clearCompleted}
                  />
                </>
              )}

              {todoState.allTodos.length === 0 && (
                <div className={styles.empty}>
                  <p className={styles.emptyText}>No todos yet. Add one above!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
