export default function Footer() {
  return (
    <div className="pointer-events-none fixed bottom-4 inset-x-0 z-40 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-stone-900/70 backdrop-blur border border-stone-800/80 px-3 py-1.5 text-[11px] text-stone-400 shadow-lg">
        <span className="hidden sm:inline">Made with <span aria-hidden className="inline-block align-[-1px]">❤️</span> by</span>
        <a
          href="https://krshubham.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-stone-300 hover:text-white underline decoration-stone-700 hover:decoration-stone-400"
        >
          Kumar Shubham
        </a>
        <span className="text-stone-600">•</span>
        <a
          href="https://x.com/krshubham1708"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 hover:text-white"
          aria-label="Kumar Shubham on X"
        >
          @krshubham1708
        </a>
      </div>
    </div>
  );
}
