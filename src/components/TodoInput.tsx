import { useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './TodoInput.module.css';

type TodoInputProps = {
  onAdd: (text: string) => void;
};

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value);
      setValue('');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        autoFocus
      />
      <button
        className={styles.button}
        type="submit"
        aria-label="Add todo"
        disabled={!value.trim()}
      >
        <Plus size={20} />
      </button>
    </form>
  );
}
