type Props = {
  error: string;
  onClose?: () => void;
};

export default function ErrorMessage({ error, onClose }: Props) {
  return (
    <div className="relative max-w-96 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close error"
          className="absolute top-2 right-2 text-red-300 hover:text-red-100 hover:cursor-pointer p-1 rounded"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <div>{error}</div>
    </div>
  );
}
