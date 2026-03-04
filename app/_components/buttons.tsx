interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className="p-4 border rounded-md border-black border-dotted text-black text-5xl cursor-pointer"
        >
            {children}
        </button>
    );
}