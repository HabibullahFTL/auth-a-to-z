import { CheckCircleIcon } from 'lucide-react';

interface IProps {
  message?: string;
}

const FormSuccess = ({ message }: IProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 text-emerald-500 px-3 py-2.5 text-sm gap-x-2 flex items-center rounded-md">
      <CheckCircleIcon className="size-4" /> <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
