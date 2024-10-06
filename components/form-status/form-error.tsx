import { TriangleAlertIcon } from 'lucide-react';

interface IProps {
  message?: string;
}

const FormError = ({ message }: IProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive px-3 py-2.5 text-sm gap-x-2 flex items-center rounded-md">
      <TriangleAlertIcon className="size-4" /> <p>{message}</p>
    </div>
  );
};

export default FormError;
