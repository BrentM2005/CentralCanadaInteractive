import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea 
        ref={ref}
        className={classNames(
          "w-full px-6 py-5 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#E4002B] focus:bg-white/20 transition-all resize-y shadow-inner",
          className
        )} 
        {...props} 
      />
    );
  }
);
TextArea.displayName = "TextArea";