import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, padding = 'md', children, ...props }, ref) => {
    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn('bg-surface border border-surface-border rounded-lg shadow-sm', className)}
        {...props}
      >
        {title && (
          <div className="border-b border-surface-border px-6 py-4">
            <h3 className="font-semibold text-slate-900">{title}</h3>
          </div>
        )}
        <div className={cn(paddings[padding])}>{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export default Card;
