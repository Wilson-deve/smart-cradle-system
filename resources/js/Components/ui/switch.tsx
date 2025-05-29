import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  className,
  checked,
  onCheckedChange,
  ...props
}) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={() => onCheckedChange?.(!checked)}
      className={twMerge(
        'inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-input',
        className
      )}
      {...props}
    >
      <span
        data-state={checked ? 'checked' : 'unchecked'}
        className={twMerge(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}; 