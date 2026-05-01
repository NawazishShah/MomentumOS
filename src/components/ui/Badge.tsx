import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'indigo' | 'green' | 'amber' | 'red' | 'gray';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color = 'gray', children, ...props }, ref) => {
    const colors = {
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      green: 'bg-green-50 text-green-700 border-green-100',
      amber: 'bg-amber-50 text-amber-700 border-amber-100',
      red: 'bg-red-50 text-red-700 border-red-100',
      gray: 'bg-slate-50 text-slate-700 border-slate-100',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          colors[color],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
