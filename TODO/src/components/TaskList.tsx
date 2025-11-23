import { type Todo } from '../api/api';
import { TaskItem } from './TaskItem';

// Renders a titled section with a list of todos
interface TaskListProps {
  title: string;
  tasks: Todo[];
  onToggle?: (task: Todo) => void;
  onDelete?: (name: string) => void;
   onEditDescription?: (task: Todo, description: string) => void;
}

export function TaskList({ title, tasks, onToggle, onDelete, onEditDescription }: TaskListProps) {
  return (
    <div className={title.startsWith("Done") ? "" : "mb-10"}>
      <h2 className="text-[#9E78CF] text-base font-medium mb-4">{title} - {tasks.length}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskItem
            key={task.name}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEditDescription={onEditDescription}
          />
        ))}
      </div>
    </div>
  );
}
