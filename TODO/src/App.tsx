import { useState, useEffect } from 'react';
import { listTodos, createTodo, updateTodo, deleteTodo, type Todo } from './api/api';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';

// Main page component: fetches todos and wires up actions
export default function App() {
  // Local state for todos list, input field and top-level error banner
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial data once on mount
  useEffect(() => {
    listTodos()
      .then(setTasks)
      .catch((err) => {
        console.error(err);
        setErrorMessage('Could not load your tasks. Please refresh the page.');
      });
  }, []);

  // Create a new todo and update state
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setErrorMessage(null);
    try {
      const todo = await createTodo(newTask);
      setTasks([...tasks, todo]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to create todo:', error);
      setErrorMessage('Could not create the task. Try again in a moment.');
    }
  };

  // Toggle status between Open/Closed
  const handleToggleTask = async (todo: Todo) => {
    const newStatus = todo.status === 'Open' ? 'Closed' : 'Open';
    setErrorMessage(null);
    try {
      const updated = await updateTodo(todo.name, { status: newStatus });
      setTasks(tasks.map(t => t.name === todo.name ? updated : t));
    } catch (error) {
      console.error('Failed to update todo:', error);
      if ((error as Error).message.includes('Not permitted')) {
        setErrorMessage('You do not have permission to change this task.');
      } else {
        setErrorMessage('Could not update the task. Please try again.');
      }
    }
  };

  // Edit todo description inline
  const handleEditDescription = async (todo: Todo, description: string) => {
    setErrorMessage(null);
    try {
      const updated = await updateTodo(todo.name, { description });
      setTasks(tasks.map(t => t.name === todo.name ? updated : t));
    } catch (error) {
      console.error('Failed to update description:', error);
      if ((error as Error).message.includes('Not permitted')) {
        setErrorMessage('You do not have permission to edit this task.');
      } else {
        setErrorMessage('Could not save the changes. Please try again.');
      }
    }
  };

  // Delete todo from backend and local state
  const handleDeleteTask = async (name: string) => {
    setErrorMessage(null);
    try {
      await deleteTodo(name);
      setTasks(tasks.filter(t => t.name !== name));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      if ((error as Error).message.includes('Not permitted')) {
        setErrorMessage('You do not have permission to delete this task.');
      } else {
        setErrorMessage('Could not delete the task. Please try again.');
      }
    }
  };

  const activeTasks = tasks.filter(t => t.status === 'Open');
  const completedTasks = tasks.filter(t => t.status !== 'Open');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans p-4">
      <div className="w-[480px] bg-[#1D1825] rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-800/50">
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/60 px-3 py-2 text-sm text-red-100">
            {errorMessage}
          </div>
        )}
        
        <TaskInput 
          value={newTask} 
          onChange={setNewTask} 
          onAdd={handleAddTask} 
        />

        <TaskList 
          title="Tasks to do" 
          tasks={activeTasks} 
          onToggle={handleToggleTask} 
          onDelete={handleDeleteTask} 
          onEditDescription={handleEditDescription}
        />

        <TaskList 
          title="Done" 
          tasks={completedTasks} 
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />

      </div>
    </div>
  );
}



