import { ErrorMessageProps } from "@/types";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <p>Error: {message}</p>;
};

export default ErrorMessage;
