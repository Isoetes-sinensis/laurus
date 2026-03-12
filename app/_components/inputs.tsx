interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function Input({ className, ...rest }: InputProps) {
    return (
        <input
            {...rest}
            className={'p-1 border-2 disabled:border-gray-400 rounded-md ' + className}
        />
    );
}