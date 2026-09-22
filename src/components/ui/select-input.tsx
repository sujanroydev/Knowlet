import { ChangeEvent, KeyboardEvent, useState } from "react";
import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  mutedOptions?: boolean[];
  addButton?: boolean;
  onAddClick?: () => void;
  onInputChange?: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  onInputEnd?: (value: string) => void;
}

export default function SelectInput({
  label,
  options,
  mutedOptions,
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

    const value = newOption.trim();

    setNewOption("");
    setIsAdding(false);
    value && onInputEnd?.(value);
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
          {options.map((option, index) => {
            const muted = mutedOptions?.[index] || false;

            return (
              <option
                key={option}
                value={option}
                className={muted ? "text-gray-400" : ""}
              >
                {option}
              </option>
            );
          })}

          {addButton && <option value="__add__">+ Add {label}</option>}
        </select>
      )}
    </div>
  );
}
