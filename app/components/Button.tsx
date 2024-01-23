import * as React from "react";
import clsx from "clsx";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button = (
  {
    type = "button",
    fullWidth,
    children,
    secondary,
    danger,
    disabled,
    className = "",
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  return (
    <button
      type={type}
      disabled={disabled}
      ref={ref}
      {...props}
      className={clsx(
        `
        flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold 
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        `,
        disabled && "opacity-50 cursor-not-allowed",
        fullWidth && "w-full",
        secondary ? "text-gray-900" : "text-white",
        danger &&
          "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600",
        className
      )}
    >
      {children}
    </button>
  );
};

export default React.forwardRef(Button);
