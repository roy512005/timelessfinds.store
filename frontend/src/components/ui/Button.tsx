import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
        secondary: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500', // Color psychology: urgency/action
        outline: 'border-2 border-gray-200 hover:border-black text-black bg-transparent',
        ghost: 'hover:bg-gray-100 text-gray-700 bg-transparent',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : null}
            {children}
        </motion.button>
    );
};
