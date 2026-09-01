import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export default function SelectInput({ label, options, ...props }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-2xl border border-border bg-muted px-4 py-3 outline-none"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
