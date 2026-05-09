export default function NexusToolbar({ mode, setMode }: any) {
  const modes = ["quiz", "study", "short", "explain"];

  return (
    <div className="flex gap-2 px-2 py-2 border-t border-slate-700">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(mode === m ? "normal" : m)}
          className={`px-3 py-1 rounded-lg text-sm border transition ${
            mode === m
              ? "bg-slate-600 border-slate-400"
              : "border-slate-700 hover:bg-slate-800"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
