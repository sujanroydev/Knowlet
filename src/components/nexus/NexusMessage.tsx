export default function NexusMessage({ message }: any) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
        isUser
          ? "bg-green-500 text-black ml-auto"
          : "bg-slate-800 text-white mr-auto"
      }`}
    >
      {message.text}
      <div className="text-[10px] opacity-60 text-right mt-1">
        {message.time}
      </div>
    </div>
  );
}
