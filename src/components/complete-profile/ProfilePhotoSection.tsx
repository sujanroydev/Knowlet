interface ProfilePhotoSectionProps {
  picture: string;
  onChange: (url: string) => void;
}

export default function ProfilePhotoSection({
  picture,
  onChange,
}: ProfilePhotoSectionProps) {
  return (
    <section className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Profile Picture</h2>

      <div className="flex items-center gap-4">
        <img
          src={picture || "/demo_pp.png"}
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover"
        />

        <input type="file" accept="image/*" />
      </div>
    </section>
  );
}
