export default function ErrorMessage({ message }: { message: string }) {
  return <p className="text-sm text-red-600 mt-1">{message}</p>;
}
