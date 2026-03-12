interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function HollowButton({ children, className, ...rest }: ButtonProps) {
    return (
        <div className="p-1 rounded-full bg-gradient-to-r from-laurus-green to-laurus-purple">
            <div className="rounded-full bg-white">
                <button
                    {...rest}
                    className={"p-4 rounded-full bg-gradient-to-r from-laurus-green to-laurus-purple bg-clip-text text-5xl text-transparent cursor-pointer " + className}
                >
                    {children}
                </button>
            </div>
        </div>
    );
}

export function PrimaryButton({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={"p-1 rounded-full bg-laurus-green text-white text-transparent cursor-pointer " + className}
        >
            {children}
        </button>
    );
}