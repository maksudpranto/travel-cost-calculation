"use client";

import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Trip } from '../type';

interface DashboardChartsProps {
    trip: Trip;
}

const COLORS = ['#10B17D', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const DashboardCharts = ({ trip }: DashboardChartsProps) => {
    // 1. Data for Recent Spending (last 7 expenses)
    const barData = useMemo(() => {
        return trip.expenses.slice(-7).map(e => ({
            name: e.item.length > 10 ? e.item.substring(0, 8) + '..' : e.item,
            amount: e.amount,
            fullItem: e.item
        }));
    }, [trip.expenses]);

    // 2. Data for Expense Splitting (by percentage)
    const pieData = useMemo(() => {
        const categories = trip.expenses.reduce((acc: any, e) => {
            acc[e.item] = (acc[e.item] || 0) + e.amount;
            return acc;
        }, {});

        return Object.keys(categories).map(key => ({
            name: key,
            value: categories[key]
        })).sort((a, b) => b.value - a.value).slice(0, 5);
    }, [trip.expenses]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Bar Chart: Recent Expenses */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[350px] md:h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-gray-900">Recent Spending</h3>
                        <p className="text-xs text-gray-400 font-medium tracking-tight">Daily expense breakdown</p>
                    </div>
                </div>

                <div className="h-[calc(100%-80px)] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F9FAF8' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="amount" fill="#10B17D" radius={[6, 6, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Distribution */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[350px] md:h-[400px]">
                <div className="mb-8">
                    <h3 className="text-lg font-black text-gray-900">Expense Splitting</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-tight">Top expense distribution</p>
                </div>

                <div className="h-[calc(100%-80px)] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
