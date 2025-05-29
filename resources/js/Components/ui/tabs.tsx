import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: '', onValueChange: () => {} });

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  className,
  children,
  ...props
}) => {
  const [value, setValue] = React.useState(defaultValue || '');
  const actualValue = controlledValue ?? value;

  return (
    <TabsContext.Provider value={{ value: actualValue, onValueChange: setValue }}>
      <div className={twMerge('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ className, children, ...props }) => (
  <div
    className={twMerge('inline-flex items-center justify-center rounded-lg bg-muted p-1', className)}
    {...props}
  >
    {children}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...props }) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (selectedValue !== value) return null;

  return (
    <div
      className={twMerge('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}; 