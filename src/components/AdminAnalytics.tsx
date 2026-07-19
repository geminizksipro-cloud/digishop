import React, { useState } from 'react';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, 
  ShoppingBag, Package, Users, Download, Percent, Clock, ChevronRight
} from 'lucide-react';
import { Product, Order, UserProfile } from '../types';

interface AdminAnalyticsProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  currency: 'BDT' | 'USD';
  onNavigateToTab: (tab: string) => void;
}

export default function AdminAnalytics({ 
  products, 
  orders, 
  users, 
  currency,
  onNavigateToTab 
}: AdminAnalyticsProps) {
  const [selectedChartRange, setSelectedChartRange] = useState<'7d' | '30d' | '12m'>('30d');

  // Calculations
  const completedOrders = orders.filter(o => o.paymentStatus === 'Paid' || o.paymentStatus === 'Delivered');
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'Pending' || o.paymentStatus === 'Processing').length;

  const totalRevenueUSD = completedOrders.reduce((sum, o) => sum + o.totalUSD, 0);
  const totalRevenueBDT = completedOrders.reduce((sum, o) => sum + o.totalBDT, 0);

  const formatRevenue = (usdVal: number, bdtVal: number) => {
    if (currency === 'BDT') {
      return `৳${bdtVal.toLocaleString()}`;
    }
    return `$${usdVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const totalSalesCount = products.reduce((sum, p) => sum + p.salesCount, 0);

  // Growth rates (compared to hypothetical last period)
  const stats = [
    {
      label: 'Gross Revenue',
      value: formatRevenue(totalRevenueUSD, totalRevenueBDT),
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-blue-500/10 text-blue-600 border-blue-100',
      description: 'Paid & Delivered checkout volume'
    },
    {
      label: 'Total Orders',
      value: orders.length,
      change: '+8.4%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-100',
      description: `${pendingOrdersCount} orders currently pending action`
    },
    {
      label: 'Digital Assets',
      value: products.length,
      change: `+${products.filter(p => p.salesCount === 0).length} new`,
      isPositive: true,
      icon: Package,
      color: 'bg-sky-500/10 text-sky-600 border-sky-100',
      description: 'Active catalog templates & scripts'
    },
    {
      label: 'Active Customers',
      value: users.length,
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
      description: 'Registered developer accounts'
    }
  ];

  // Mock sales trend data for the Line/Area Charts
  const salesTrendData = [
    { label: 'Jan', usd: 4200, bdt: 490000, orders: 84 },
    { label: 'Feb', usd: 5800, bdt: 680000, orders: 112 },
    { label: 'Mar', usd: 5100, bdt: 590000, orders: 101 },
    { label: 'Apr', usd: 7200, bdt: 850000, orders: 145 },
    { label: 'May', usd: 8900, bdt: 1040000, orders: 180 },
    { label: 'Jun', usd: 11200, bdt: 1320000, orders: 232 },
    { label: 'Jul', usd: 12400, bdt: 1460000, orders: 260 }
  ];

  const maxUSD = Math.max(...salesTrendData.map(d => d.usd)) * 1.15;
  const maxBDT = Math.max(...salesTrendData.map(d => d.bdt)) * 1.15;
  const maxVal = currency === 'USD' ? maxUSD : maxBDT;

  // Render Line SVG Helper
  const chartHeight = 160;
  const chartWidth = 500;
  const points = salesTrendData.map((d, index) => {
    const val = currency === 'USD' ? d.usd : d.bdt;
    const x = (index / (salesTrendData.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxVal) * chartHeight;
    return { x, y, label: d.label, val };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Category sales breakdown for the Bar Chart
  const categoryBreakdown = products.reduce((acc, p) => {
    const foundIdx = acc.findIndex(c => c.category === p.category);
    const revUSD = p.salesCount * p.priceUSD;
    const revBDT = p.salesCount * p.priceBDT;
    
    if (foundIdx > -1) {
      acc[foundIdx].sales += p.salesCount;
      acc[foundIdx].revenueUSD += revUSD;
      acc[foundIdx].revenueBDT += revBDT;
    } else {
      acc.push({
        category: p.category,
        sales: p.salesCount,
        revenueUSD: revUSD,
        revenueBDT: revBDT
      });
    }
    return acc;
  }, [] as { category: string; sales: number; revenueUSD: number; revenueBDT: number }[]);

  const maxCatRev = Math.max(...categoryBreakdown.map(c => currency === 'USD' ? c.revenueUSD : c.revenueBDT)) || 1;

  return (
    <div className="space-y-6">
      {/* Overview Stats Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white/70 backdrop-blur-md border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <IconComponent size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    from last month
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-50 mt-4 pt-3 text-[10px] text-slate-400 font-semibold leading-none flex items-center gap-1">
                <span>{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts - Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart (Area Chart) */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Sales Volume & Performance
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Simulated {currency === 'BDT' ? 'BDT' : 'USD'} revenue trends for DigiMarkt BD
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-[10px] font-extrabold">
              {(['7d', '30d', '12m'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedChartRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedChartRange === range 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full pt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00"/>
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3" />

              {/* Area Under Line */}
              <path d={areaPath} fill="url(#blueGradient)" />

              {/* Line Path */}
              <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Plot Circles */}
              {points.map((p, i) => (
                <g key={i} className="group/dot cursor-pointer">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    fill="#ffffff" 
                    stroke="#2563eb" 
                    strokeWidth="2" 
                    className="transition-transform duration-100 group-hover/dot:scale-150" 
                  />
                  <foreignObject 
                    x={p.x - 30} 
                    y={p.y - 28} 
                    width="60" 
                    height="24" 
                    className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none"
                  >
                    <div className="bg-slate-900/90 text-white text-[8px] font-bold py-0.5 px-1 rounded shadow text-center">
                      {currency === 'BDT' ? `৳${Math.round(p.val/1000)}k` : `$${p.val}`}
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
            
            {/* Chart X Labels */}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
              {salesTrendData.map((d, i) => (
                <span key={i}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Category breakdown (Bar Chart) */}
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
              Top Categories
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Sales revenue shares by division
            </p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {categoryBreakdown.map((item, index) => {
              const val = currency === 'USD' ? item.revenueUSD : item.revenueBDT;
              const percent = Math.min(100, Math.round((val / maxCatRev) * 100)) || 5;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">
                      {item.category}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {currency === 'BDT' ? `৳${(item.revenueBDT/1000).toFixed(1)}k` : `$${item.revenueUSD.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="h-2.5 w-full bg-slate-100/80 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{item.sales} transactions</span>
                    <span>{percent}% depth</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Bottom - Recent Actions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Insights List */}
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-sm col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
              Analytics Health Check
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Daily metrics health and indicators
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                <Clock size={14} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-700 block">Average Order Turnaround</span>
                <span className="text-xs font-black text-blue-600 mt-0.5 block">2.4 Minutes</span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-1">Automatic download key release is instantaneous.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                <Percent size={14} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-700 block">Cart Conversion Index</span>
                <span className="text-xs font-black text-emerald-600 mt-0.5 block">4.82% Average</span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-1">Highly motivated bKash/Nagad checkout flow.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-2xl border border-slate-100">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
                <Download size={14} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-700 block">Assets Bandwidth Pull</span>
                <span className="text-xs font-black text-indigo-600 mt-0.5 block">14.8 GB Served</span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-1">Secure cloud storage link distribution active.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 mt-4 flex justify-end">
            <button 
              onClick={() => onNavigateToTab('settings')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Verify server keys</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Recent Purchase Ledger
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Latest transactions waiting fulfillment
              </p>
            </div>
            
            <button 
              onClick={() => onNavigateToTab('orders')}
              className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 border border-blue-100 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Full Orders Register
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold text-[10px] uppercase">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">User Email</th>
                  <th className="pb-3">Gate</th>
                  <th className="pb-3">Total BDT</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-mono text-[10px] text-blue-600 font-extrabold">#{order.id}</td>
                    <td className="py-2.5 font-semibold text-slate-900 truncate max-w-[140px]">{order.userEmail || (order.userId.length > 10 ? 'User Registration' : order.userId)}</td>
                    <td className="py-2.5 font-bold">{order.paymentMethod}</td>
                    <td className="py-2.5 font-black">৳{order.totalBDT.toLocaleString()}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        order.paymentStatus === 'Paid' || order.paymentStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : order.paymentStatus === 'Pending' || order.paymentStatus === 'Processing'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                      No customer checkouts recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
