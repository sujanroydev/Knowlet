interface PersonalInfoSectionProps {
  username: string;
  age: string;
  onChange: (field: string, value: string) => void;
}

export default function PersonalInfoSection({
  username,
  age,
  onChange,
}: PersonalInfoSectionProps) {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>

      <div className="grid gap-4">
        <input
          className="rounded border p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => onChange("username", e.target.value)}
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
