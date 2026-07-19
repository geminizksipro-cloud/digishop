import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Eye, RefreshCw, Mail, Calendar, 
  CreditCard, Check, AlertTriangle, ShieldCheck, X, Trash2 
} from 'lucide-react';
import { Order } from '../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['paymentStatus']) => void;
  onDeleteOrder: (orderId: string) => void;
  currency: 'BDT' | 'USD';
}

export default function AdminOrders({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  currency
}: AdminOrdersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Order['paymentStatus'] | 'All'>('All');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Filter Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.userEmail && o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.customerWhatsapp && o.customerWhatsapp.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.invoiceId && o.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'All' || o.paymentStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyles = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'Paid':
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Pending':
      case 'Processing':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Refunded':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Cancelled':
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl px-3.5 py-1.5 flex-1 max-w-md shadow-inner">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Email, Name, WhatsApp, or Invoice ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-transparent outline-none"
          />
        </div>

        {/* Status Tab list */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl text-[10px] font-extrabold text-slate-500">
          {(['All', 'Pending', 'Processing', 'Paid', 'Delivered', 'Cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${
                selectedStatus === status 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Checkout Date</th>
                <th className="p-4">Gateway Used</th>
                <th className="p-4 text-center">Amount (BDT/USD)</th>
                <th className="p-4 text-center">Receipt Status</th>
                <th className="p-4 text-right pr-6">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Order ID */}
                  <td className="p-4 pl-6">
                    <span className="font-mono text-[11px] text-blue-600 font-black">#{o.id}</span>
                  </td>

                  {/* Customer Email */}
                  <td className="p-4 font-bold text-slate-900 truncate max-w-[200px]">
                    {o.userEmail || o.userId}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-slate-400 font-medium">
                    {new Date(o.date).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  {/* Gateway */}
                  <td className="p-4 font-extrabold text-slate-600">
                    {o.paymentMethod}
                  </td>

                  {/* Total */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-slate-900">৳{o.totalBDT.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400">${o.totalUSD}</span>
                    </div>
                  </td>

                  {/* Status Change Selector */}
                  <td className="p-4 text-center">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['paymentStatus'])}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wide outline-none cursor-pointer transition-all ${getStatusBadgeStyles(o.paymentStatus)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Paid">Paid</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Refunded">Refunded</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Inspect Details Button */}
                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectingOrder(o)}
                        className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg border border-transparent hover:border-blue-100 transition-colors cursor-pointer"
                        title="Inspect order receipts & license keys"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setDeletingOrderId(o.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                        title="Delete this order permanently"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-semibold">
                    No purchase logs match your active status filters or query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Drawer Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-[140] bg-slate-950/40 backdrop-blur-md flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Order Receipt</span>
                <h3 className="text-sm font-black text-slate-900 font-mono mt-0.5">#{inspectingOrder.id}</h3>
              </div>
              
              <button 
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-800">
              {/* Customer summary */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5 border border-slate-100/60">
                <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <Mail size={12} />
                  <span>Customer Credentials</span>
                </div>
                <div className="font-bold text-slate-900 select-all leading-tight">{inspectingOrder.userId}</div>
                
                {inspectingOrder.customerName && (
                  <div className="flex justify-between text-[11px] border-t border-slate-100 pt-2 pb-1">
                    <span className="text-slate-400 font-extrabold">Name:</span>
                    <span className="font-extrabold text-slate-800">{inspectingOrder.customerName}</span>
                  </div>
                )}
                {inspectingOrder.customerWhatsapp && (
                  <div className="flex justify-between text-[11px] border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-extrabold">WhatsApp:</span>
                    <span className="font-mono font-black text-slate-800 select-all">{inspectingOrder.customerWhatsapp}</span>
                  </div>
                )}

                <div className="flex justify-between text-[10px] text-slate-400 pt-1.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar size={10} />
                    Date: {new Date(inspectingOrder.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <CreditCard size={10} />
                    Gateway: {inspectingOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items Ordered */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Items Purchased ({inspectingOrder.items.length})</span>
                <div className="space-y-2">
                  {inspectingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-900 leading-tight block">{item.productTitle}</span>
                        <span className="font-black text-blue-600 shrink-0 ml-4">৳{item.priceBDT.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span className="capitalize">{item.license} License</span>
                        <span>${item.priceUSD} USD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* License Keys Release Panel */}
              <div className="space-y-2.5 bg-blue-50/40 p-4 rounded-2xl border border-blue-100/30">
                <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-500">
                  <ShieldCheck size={12} />
                  <span>Product License Keys</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  These unique codes are automatically generated during SSLCommerz/bKash checkout confirmation and delivered to the user profile dashboard.
                </p>

                <div className="space-y-2 pt-1.5">
                  {inspectingOrder.items.map((item, idx) => {
                    const key = inspectingOrder.licenseKeys[item.productId] || 'LICENSE-PENDING-KEY-FULFILLMENT';
                    return (
                      <div key={idx} className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold block truncate">{item.productTitle}</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-900 text-slate-100 text-[10px] font-mono p-1.5 rounded-lg flex-1 overflow-x-auto scrollbar-thin select-all leading-none">{key}</code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{inspectingOrder.totalBDT.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Tax (Simulated)</span>
                  <span className="text-slate-400">৳0</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-50">
                  <span>Gross checkout BDT</span>
                  <span className="text-blue-600">৳{inspectingOrder.totalBDT.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold justify-end">
                  <span>Total USD equivalent: ${inspectingOrder.totalUSD}</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2.5">
              <select
                value={inspectingOrder.paymentStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as Order['paymentStatus'];
                  onUpdateOrderStatus(inspectingOrder.id, newStatus);
                  setInspectingOrder({ ...inspectingOrder, paymentStatus: newStatus });
                }}
                className={`w-full px-4 h-10 rounded-xl text-xs font-black uppercase tracking-wider outline-none cursor-pointer transition-all ${getStatusBadgeStyles(inspectingOrder.paymentStatus)}`}
              >
                <option value="Pending">Change status: Pending</option>
                <option value="Processing">Change status: Processing</option>
                <option value="Paid">Change status: Paid</option>
                <option value="Delivered">Change status: Delivered</option>
                <option value="Refunded">Change status: Refunded</option>
                <option value="Cancelled">Change status: Cancelled</option>
              </select>

              <button
                onClick={() => setDeletingOrderId(inspectingOrder.id)}
                className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center gap-2 border border-red-200/50 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Order Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting Orders */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-[150] bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="stroke-red-600" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Confirm Order Deletion</h3>
                <p className="text-[10px] text-slate-400 font-bold">অর্ডার মুছে ফেলার নিশ্চয়তা দিন</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                আপনি কি নিশ্চিত যে আপনি অর্ডার <span className="font-extrabold text-slate-800 font-mono">#{deletingOrderId}</span> সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrderId(null)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteOrder(deletingOrderId);
                  setDeletingOrderId(null);
                  if (inspectingOrder?.id === deletingOrderId) {
                    setInspectingOrder(null);
                  }
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/10 transition-all cursor-pointer animate-pulse"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
