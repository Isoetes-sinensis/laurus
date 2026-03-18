interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    submitted: boolean;
    correct: boolean;
    correctAnswer: string;
}

export function RightWrongInput({ className, submitted, correct, correctAnswer, ...rest }: InputProps) {
    let borderClass = 'border-2 disabled:border-gray-400';
    let textClass = '';

    // Show whether correct or not after submission.
    if (submitted) {
        if (correct) {
            borderClass = 'border-2 border-laurus-green';
            textClass = 'text-laurus-green';
        }
        else {
            borderClass = 'border-red-400';
            textClass = 'text-red-400 line-through';
        };
    }
    const finalClass = `p-1 border-2 ${borderClass} rounded-md ${className}`;

    if (submitted) return (
        <div className={finalClass}>
            {/* overlay for multiple text styles */}
            <div>
                <span className={textClass}>{rest.value}</span>
                {submitted && !correct ? <span className="text-laurus-green">{' ' + correctAnswer}</span> : null}
            </div>

            {/* hidden input */}
            <input
                {...rest}
                className="hidden bg-transparent text-transparent"
            />
        </div>
    );
    else return (
        <input
            {...rest}
            className={finalClass}
        />
    );
}