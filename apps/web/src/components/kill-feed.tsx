export function KillFeed({ messages }: { messages: string[] }) {
  return (
    <div className="absolute bottom-24 left-4 z-10 space-y-1 max-w-xs">
      {messages.map((msg, i) => (
        <div
          key={`${msg}-${i}`}
          className="text-xs text-white/90 bg-black/40 px-2 py-1 rounded"
        >
          {msg}
        </div>
      ))}
    </div>
  );
}
