import { useState } from 'react';
import { Check, Trash, RotateCcw } from 'lucide-react';
import { type Todo } from '../api/api';

// Single todo row: description + actions (toggle / delete / edit)
interface TaskItemProps {
  task: Todo;
  onToggle?: (task: Todo) => void;
  onDelete?: (name: string) => void;
  onEditDescription?: (task: Todo, description: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEditDescription }: TaskItemProps) {
  // Closed tasks are treated as "done"
  const isCompleted = task.status !== 'Open';
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.description);

  // Commit description edits back to the parent
  const handleSubmit = () => {
    const value = draft.trim();
    if (!value || !onEditDescription) {
      setIsEditing(false);
      setDraft(task.description);
      return;
    }
    onEditDescription(task, value);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#15101C] rounded-[10px] py-4 px-5 flex justify-between items-center group hover:bg-[#1a1423] transition-colors">
      {isEditing && !isCompleted && onEditDescription ? (
        <input
          className="flex-1 bg-transparent border-b border-[#3E1671] text-white text-sm focus:outline-none focus:border-[#9E78CF] mr-4"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') {
              setIsEditing(false);
              setDraft(task.description);
            }
          }}
          autoFocus
        />
      ) : (
        <button
          type="button"
          className={isCompleted ? "text-[#78CFB0] line-through decoration-1 text-left flex-1" : "text-white text-left flex-1"}
          onClick={() => {
            if (!isCompleted && onEditDescription) setIsEditing(true);
          }}
        >
          {task.description}
        </button>
      )}

      {onToggle && onDelete && (
        <div className="flex gap-3">
          {isCompleted ? (
            <>
              <button
                onClick={() => onToggle(task)}
                className="text-[#78CFB0] hover:text-[#5fb395] transition-colors cursor-pointer"
                title="Mark as open again"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => onDelete(task.name)}
                className="text-[#F44336] hover:text-[#d32f2f] transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onToggle(task)}
                className="text-[#78CFB0] hover:text-[#5fb395] transition-colors cursor-pointer"
                title="Mark as done"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => onDelete(task.name)}
                className="text-[#F44336] hover:text-[#d32f2f] transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
