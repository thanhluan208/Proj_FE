import React from 'react';
import { MonthlyFinancial } from '../mock-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinancialSummaryProps {
  data: MonthlyFinancial[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ data }) => {
  // Format data for chart if needed, but MonthlyFinancial matches well
  // { month: '2024-01', income: 45000000, expense: 12000000 }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border text-sm">
          <p className="font-bold mb-2">{label}</p>
          <p className="text-green-500">
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-red-500">
            Expense: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Financial Summary (Last 12 Months)</h2>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => value.split('-')[1]} 
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `${value / 1000000}M`}
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)', opacity: 0.4 }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#22c55e" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
            <Bar 
              dataKey="expense" 
              name="Expense" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialSummary;
