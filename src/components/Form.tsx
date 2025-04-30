import { FormEvent, ReactNode } from "react";
import Button from "./Button";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormProps {
  children: ReactNode;
  onsubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className: string;
  status: FormStatus;
  errorMessage: string;
  successMessage: string;
  submitText: string;
}
export const Form = ({
  children,
  //   onsubmit,
  className = "",
  status = "idle",
  errorMessage = "Something went wrong",
  successMessage = "Success!",
  submitText = "Submit",
}: FormProps) => {
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // await onsubmit(e);
  // };
  return (
    <>
      <form
        // onSubmit={handleSubmit}
        className={`space-y-4 ${className}`}
        noValidate
      >
        <fieldset disabled={status === "submitting"} className="space-y-4">
          {children}

          {status === "error" && (
            <div className="text-red-600 py-2">{errorMessage}</div>
          )}

          {status === "success" && (
            <div className="text-green-600 py-2">{successMessage}</div>
          )}
        </fieldset>

        <Button
          type="submit"
          variant="primary"
          isLoading={status === "submitting"}
          disabled={status === "submitting"}
        >
          {submitText}
        </Button>
      </form>
    </>
  );
};
