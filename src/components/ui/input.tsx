import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`border border-gray-300 rounded px-3 py-2 ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
