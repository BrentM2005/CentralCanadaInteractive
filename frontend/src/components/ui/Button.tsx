import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const baseStyle = "flex items-center justify-center gap-x-2 px-6 py-4 rounded-3xl transition-all duration-200 disabled:opacity-50 font-semibold active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#E4002B]/50";
    
    const variants = {
      primary: "bg-white text-[#0A0A0A] hover:bg-white/90 shadow-xl shadow-white/10",
      success: "bg-gradient-to-r from-[#E4002B] to-red-600 text-white hover:brightness-110 shadow-2xl shadow-[#E4002B]/30",
      outline: "border-2 border-white/30 text-white hover:border-[#E4002B] hover:bg-white/10 w-full text-left justify-start",
    };

    return (
      <button 
        ref={ref}
        className={classNames(baseStyle, variants[variant], className)} 
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";