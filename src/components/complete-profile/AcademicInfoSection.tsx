interface AcademicInfoSectionProps {
  stream: string;
  standard: string;
  favouriteSubject: string;
  onChange: (field: string, value: string) => void;
}

export default function AcademicInfoSection({
  stream,
  standard,
  favouriteSubject,
  onChange,
}: AcademicInfoSectionProps) {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Academic Information</h2>

      <div className="grid gap-4">
        <select
          className="rounded border p-2"
          value={stream}
          onChange={(e) => onChange("stream", e.target.value)}
        >
          <option value="">Select Stream</option>
          <option value="science">Science</option>
          <option value="commerce">Commerce</option>
          <option value="arts">Arts</option>
          <option value="bca">BCA</option>
        </select>

        <input
          className="rounded border p-2"
          placeholder="Class / Semester"
          value={standard}
          onChange={(e) => onChange("standard", e.target.value)}
        />

        <input
          className="rounded border p-2"
          placeholder="Favourite Subject"
          value={favouriteSubject}
          onChange={(e) => onChange("favouriteSubject", e.target.value)}
        />
      </div>
    </section>
  );
}
