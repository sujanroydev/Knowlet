const links = [
  "Edit Profile",
  "Change Password",
  "Notification Preferences",
  "Privacy Controls",
];

export default function SettingsPanel() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="font-semibold mb-4">Account Settings</h2>

      <div className="space-y-2">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="flex items-center gap-2 text-blue-600 hover:pl-1 transition"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}
