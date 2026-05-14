import clsx from 'clsx';
import { FilterType } from '@/types';
import styles from './TodoFilter.module.css';

type TodoFilterProps = {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
};

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export default function TodoFilter({ filter, setFilter }: TodoFilterProps) {
  return (
    <div className={styles.bar}>
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={clsx(styles.btn, filter === f.value && styles.active)}
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
