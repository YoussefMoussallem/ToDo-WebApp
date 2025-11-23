import { Plus } from 'lucide-react';

// Controlled input row for creating a new todo
interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export function TaskInput({ value, onChange, onAdd }: TaskInputProps) {
  // Simple input + button row; parent owns the state
  return (
    <div className="flex gap-2 mb-12">
      <input
        type="text"
        placeholder="Add a new task"
        className="flex-1 bg-transparent border border-[#3E1671] rounded-[10px] px-4 py-2.5 text-white placeholder-[#777777] focus:outline-none focus:border-[#9E78CF] transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
      />
      <button
        onClick={onAdd}
        className="bg-[#9E78CF] hover:bg-[#8A65BC] text-white p-2.5 rounded-[10px] transition-colors cursor-pointer flex items-center justify-center"
      >
        <Plus size={22} />
      </button>
    </div>
  );
}
