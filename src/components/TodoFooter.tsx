import styles from './TodoFooter.module.css';

type TodoFooterProps = {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export default function TodoFooter({ activeCount, completedCount, onClearCompleted }: TodoFooterProps) {
  return (
    <footer className={styles.footer}>
      <span className={styles.count}>
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </span>
      {completedCount > 0 && (
        <button className={styles.clearBtn} onClick={onClearCompleted}>
          Clear completed ({completedCount})
        </button>
      )}
    </footer>
  );
}
