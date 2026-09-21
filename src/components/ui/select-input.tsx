import { ChangeEvent, KeyboardEvent, useState } from "react";
import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  addButton?: boolean;
  onAddClick?: () => void;
  onInputChange?: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  onInputEnd?: () => void;
}

export default function SelectInput({
  label,
  options,
  addButton = false,
  onAddClick,
  onInputChange,
  onInputEnd,
  ...props
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState("");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__add__") {
      setIsAdding(true);
      onAddClick?.();
      return;
    }

    props.onChange?.(e);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setNewOption(value);

    onInputChange?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    setNewOption("");
    setIsAdding(false);
    onInputEnd?.();
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">
        {label}
      </label>

      {isAdding ? (
        <input
          autoFocus
          type="text"
          value={newOption}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none"
        />
      ) : (
        <select
          {...props}
          onChange={handleChange}
          className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}

          {addButton && <option value="__add__">+ Add {label}</option>}
        </select>
      )}
    </div>
  );
}
