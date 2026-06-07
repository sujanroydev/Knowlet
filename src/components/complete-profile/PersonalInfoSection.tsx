interface PersonalInfoSectionProps {
  name: string;
  age: string;
  onChange: (field: string, value: string) => void;
}

export default function PersonalInfoSection({
  name,
  age,
  onChange,
}: PersonalInfoSectionProps) {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>

      <div className="grid gap-4">
        <input
          className="rounded border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        <input
          className="rounded border p-2"
          placeholder="Age"
          value={age}
          onChange={(e) => onChange("age", e.target.value)}
        />
      </div>
    </section>
  );
}
