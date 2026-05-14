import { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '@/types';
import { supabase } from '@/lib/supabase';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from Supabase on mount
  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    async function fetchTodos() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase!
          .from('todos')
          .select('*')
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped: Todo[] = (data ?? []).map((row) => ({
          id: row.id,
          text: row.text,
          completed: row.completed,
          createdAt: new Date(row.created_at).getTime(),
        }));
        setTodos(mapped);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load todos');
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  const addTodo = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !supabase) return;

    try {
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert({ text: trimmed, completed: false })
        .select()
        .single();

      if (insertError) throw insertError;

      setTodos((prev) => [
        ...prev,
        {
          id: data.id,
          text: data.text,
          completed: data.completed,
          createdAt: new Date(data.created_at).getTime(),
        },
      ]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    if (!supabase) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.completed;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: newCompleted })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err: unknown) {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: todo.completed } : t))
      );
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    if (!supabase) return;

    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err: unknown) {
      // Reload on failure
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  }, []);

  const editTodo = useCallback(async (id: string, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed || !supabase) return;

    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );

    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ text: trimmed })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err: unknown) {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: todo.text } : t))
      );
      setError(err instanceof Error ? err.message : 'Failed to edit todo');
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    if (!supabase) return;

    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;

    // Optimistic update
    setTodos((prev) => prev.filter((t) => !t.completed));

    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .in('id', completedIds);

      if (deleteError) throw deleteError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed todos');
    }
  }, [todos]);

  const toggleAll = useCallback(async () => {
    if (!supabase) return;

    const allDone = todos.every((t) => t.completed);
    const newCompleted = !allDone;

    // Optimistic update
    setTodos((prev) => prev.map((t) => ({ ...t, completed: newCompleted })));

    try {
      const ids = todos.map((t) => t.id);
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: newCompleted })
        .in('id', ids);

      if (updateError) throw updateError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle all todos');
    }
  }, [todos]);

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return {
    todos: filtered,
    allTodos: todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    toggleAll,
    activeCount,
    completedCount,
    loading,
    error,
  };
}
