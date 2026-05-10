import React, { useEffect, useState } from 'react';
import { Activity, CreditCard, ShieldAlert, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="card p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 text-accent-success mr-1" />
        <span className="text-accent-success font-medium">{trend}</span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalTransactions: 0, fraudulentTransactions: 0, fraudPercentage: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for chart since we don't have historical timeline API yet
  const chartData = [
    { name: 'Mon', total: 4000, fraud: 240 },
    { name: 'Tue', total: 3000, fraud: 139 },
    { name: 'Wed', total: 2000, fraud: 980 },
    { name: 'Thu', total: 2780, fraud: 390 },
    { name: 'Fri', total: 1890, fraud: 480 },
    { name: 'Sat', total: 2390, fraud: 380 },
    { name: 'Sun', total: 3490, fraud: 430 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get('/transactions/stats'),
          api.get('/transactions/recent')
        ]);
        setStats(statsRes.data);
        setRecentTransactions(recentRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-white text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={stats.totalTransactions.toLocaleString()} 
          icon={Activity} 
          colorClass="bg-primary-500" 
          trend="+12.5%"
        />
        <StatCard 
          title="Fraudulent Activities" 
          value={stats.fraudulentTransactions.toLocaleString()} 
          icon={ShieldAlert} 
          colorClass="bg-accent-danger" 
          trend="-2.4%"
        />
        <StatCard 
          title="Fraud Rate" 
          value={`${stats.fraudPercentage.toFixed(2)}%`} 
          icon={TrendingUp} 
          colorClass="bg-accent-warning"
        />
      </div>

      {/* Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Transaction Volume & Fraud Detection</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" name="Total Vol" />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" fillOpacity={1} fill="url(#colorFraud)" name="Fraud Vol" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="card p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Alerts</h3>
            <button className="text-sm text-primary-500 hover:text-primary-400">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center p-3 rounded-lg bg-dark-900 border border-dark-700">
                <div className={`p-2 rounded-full mr-3 ${tx.isFraud ? 'bg-accent-danger/20 text-accent-danger' : 'bg-primary-500/20 text-primary-500'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.merchant}</p>
                  <p className="text-xs text-gray-400 truncate">{new Date(tx.transactionDate).toLocaleString()}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-white">${tx.amount}</p>
                  {tx.isFraud && <span className="text-[10px] font-bold text-accent-danger uppercase bg-accent-danger/10 px-1.5 py-0.5 rounded">Fraud</span>}
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No recent transactions.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
