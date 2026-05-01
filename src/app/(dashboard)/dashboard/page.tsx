import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <Badge color="green">System Online</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          title="Welcome to MomentumOS" 
          className="md:col-span-2 lg:col-span-3"
        >
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              Your operating system is ready. 
              Modules will appear here as you build them.
            </p>
            <div className="flex gap-2">
              <Badge color="indigo">Core Ready</Badge>
              <Badge color="amber">Auth Configured</Badge>
              <Badge color="gray">v1.0.0</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
