interface Props {
  message: string;
}

export const ErrorBanner = ({ message }: Props) => (
  <div
    className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800"
    role="alert"
    aria-live="assertive"
  >
    {message}
  </div>
);
