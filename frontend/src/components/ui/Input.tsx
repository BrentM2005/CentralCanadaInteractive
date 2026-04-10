import { type InputHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input 
        ref={ref}
        className={classNames(
          "w-full px-6 py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#E4002B] focus:bg-white/20 transition-all shadow-inner",
          className
        )} 
        {...props} 
      />
    );
  }
);
Input.displayName = "Input";