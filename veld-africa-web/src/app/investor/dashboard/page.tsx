'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Wallet,
  Home,
  PieChart,
  FileText,
  Bell,
  Settings,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// Mock data - would come from API
const PORTFOLIO_DATA = {
  totalValue: 125000000,
  totalInvested: 100000000,
  totalReturns: 25000000,
  roi: 25,
  activeInvestments: 5,
  properties: [
    {
      id: '1',
      title: 'Luxury Villa in Lekki',
      location: 'Lekki Phase 1, Lagos',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      investedAmount: 75000000,
      currentValue: 95000000,
      unrealizedGain: 20000000,
      roi: 26.7,
      status: 'ACTIVE',
      nextPayout: '2026-04-15',
      income: 1250000,
    },
    {
      id: '2',
      title: 'FarmVille Estate Unit',
      location: 'Ogun State',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      investedAmount: 15000000,
      currentValue: 18000000,
      unrealizedGain: 3000000,
      roi: 20,
      status: 'ACTIVE',
      nextPayout: '2026-04-01',
      income: 450000,
    },
    {
      id: '3',
      title: 'Commercial Plaza Unit',
      location: 'Ikoyi, Lagos',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      investedAmount: 10000000,
      currentValue: 12000000,
      unrealizedGain: 2000000,
      roi: 20,
      status: 'ACTIVE',
      nextPayout: '2026-03-30',
      income: 300000,
    },
  ],
  transactions: [
    {
      id: '1',
      type: 'DIVIDEND',
      property: 'Luxury Villa in Lekki',
      amount: 1250000,
      date: '2026-03-01',
      status: 'COMPLETED',
    },
    {
      id: '2',
      type: 'INVESTMENT',
      property: 'Commercial Plaza Unit',
      amount: 10000000,
      date: '2026-02-15',
      status: 'COMPLETED',
    },
    {
      id: '3',
      type: 'DIVIDEND',
      property: 'FarmVille Estate',
      amount: 450000,
      date: '2026-02-01',
      status: 'COMPLETED',
    },
  ],
  documents: [
    { name: 'Investment Agreement - Villa', type: 'AGREEMENT', date: '2026-01-15' },
    { name: 'Q1 2026 Statement', type: 'STATEMENT', date: '2026-03-31' },
    { name: 'FarmVille Certificate', type: 'CERTIFICATE', date: '2026-02-01' },
  ],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InvestorDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1Y');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'portfolio', label: 'Portfolio', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <header className="bg-[#1B4D3E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[#C9A227] text-sm font-medium mb-1">Investor Portal\u003c/p>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {session?.user?.name || 'Investor'}\u003c/h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#1B4D3E] font-bold">
                {session?.user?.name?.charAt(0) || 'I'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Portfolio Value"
            value={formatCurrency(PORTFOLIO_DATA.totalValue)}
            change={+12.5}
            changeLabel="vs last month"
            icon={Wallet}
          />
          <StatCard
            title="Total Invested"
            value={formatCurrency(PORTFOLIO_DATA.totalInvested)}
            change={+5.2}
            changeLabel="YTD"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Returns"
            value={formatCurrency(PORTFOLIO_DATA.totalReturns)}
            change={PORTFOLIO_DATA.roi}
            changeLabel="ROI"
            isPercentage
            icon={PieChart}
          />
          <StatCard
            title="Active Properties"
            value={PORTFOLIO_DATA.activeInvestments.toString()}
            changeLabel="Properties"
            icon={Home}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex gap-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#1B4D3E] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab data={PORTFOLIO_DATA} />}
            {activeTab === 'portfolio' && <PortfolioTab data={PORTFOLIO_DATA} />}
            {activeTab === 'transactions' && <TransactionsTab data={PORTFOLIO_DATA} />}
            {activeTab === 'documents' && <DocumentsTab data={PORTFOLIO_DATA} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, changeLabel, isPercentage, icon: Icon }: {
  title: string;
  value: string;
  change?: number;
  changeLabel: string;
  isPercentage?: boolean;
  icon: any;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-[#1B4D3E]/10">
          <Icon className="w-6 h-6 text-[#1B4D3E]" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="font-medium">{isPercentage ? `${change}%` : `${change}%`}\u003c/span>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{title}\u003c/p>
      <p className="text-2xl font-bold text-gray-900">{value}\u003c/p>
      <p className="text-gray-400 text-xs mt-1">{changeLabel}\u003c/p>
    </motion.div>
  );
}

// Overview Tab
function OverviewTab({ data }: { data: typeof PORTFOLIO_DATA }) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionButton label="New Investment" icon={TrendingUp} href="/properties" />
        <QuickActionButton label="Withdraw" icon={Wallet} href="#" />
        <QuickActionButton label="Download Report" icon={Download} href="#" />
        <QuickActionButton label="Schedule Call" icon={Calendar} href="#" />
      </div>

      {/* Recent Activity & Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Transactions\u003c/h3>
            <Link href="#" className="text-[#1B4D3E] text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.transactions.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'DIVIDEND' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {tx.type === 'DIVIDEND' ? <TrendingUp className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.type === 'DIVIDEND' ? 'Dividend' : 'Investment'}\u003c/p>
                    <p className="text-sm text-gray-500">{tx.property}\u003c/p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    tx.type === 'DIVIDEND' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.type === 'DIVIDEND' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-400">{tx.date}\u003c/p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Holdings */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Your Holdings\u003c/h3>
            <Link href="#" className="text-[#1B4D3E] text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.properties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{property.title}\u003c/p>
                  <p className="text-sm text-gray-500">{formatCurrency(property.currentValue)}\u003c/p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{property.roi}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Portfolio Tab
function PortfolioTab({ data }: { data: typeof PORTFOLIO_DATA }) {
  return (
    <div className="space-y-6">
      {data.properties.map((property) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={property.image}
              alt={property.title}
              className="w-full md:w-48 h-48 object-cover"
            />
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}\u003c/h3>
                  <p className="text-gray-500">{property.location}\u003c/p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {property.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Invested\u003c/p>
                  <p className="font-semibold">{formatCurrency(property.investedAmount)}\u003c/p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Value\u003c/p>
                  <p className="font-semibold">{formatCurrency(property.currentValue)}\u003c/p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unrealized Gain\u003c/p>
                  <p className="font-semibold text-green-600">+{formatCurrency(property.unrealizedGain)}\u003c/p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Income\u003c/p>
                  <p className="font-semibold">{formatCurrency(property.income)}\u003c/p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">Next payout: {property.nextPayout}\u003c/p>
                <div className="flex gap-2 ml-auto">
                  <button className="px-4 py-2 text-sm font-medium text-[#1B4D3E] border border-[#1B4D3E] rounded-lg hover:bg-[#1B4D3E] hover:text-white transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#1B4D3E] rounded-lg hover:bg-[#2D6A4F] transition-colors">
                    Download Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Transactions Tab
function TransactionsTab({ data }: { data: typeof PORTFOLIO_DATA }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['7D', '1M', '3M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {range}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1B4D3E] border border-[#1B4D3E] rounded-lg hover:bg-[#1B4D3E] hover:text-white transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date\u003c/th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type\u003c/th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Property\u003c/th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Amount\u003c/th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Status\u003c/th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{tx.date}\u003c/td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'DIVIDEND'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{tx.property}\u003c/td>
                <td className={`px-6 py-4 text-right text-sm font-medium ${
                  tx.type === 'DIVIDEND' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {tx.type === 'DIVIDEND' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Documents Tab
function DocumentsTab({ data }: { data: typeof PORTFOLIO_DATA }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.documents.map((doc, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-[#1B4D3E]/10">
              <FileText className="w-8 h-8 text-[#1B4D3E]" />
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">{doc.name}\u003c/h3>
          <p className="text-sm text-gray-500">{doc.type}\u003c/p>
          <p className="text-xs text-gray-400 mt-2">Generated on {doc.date}\u003c/p>
        </motion.div>
      ))}
    </div>
  );
}

// Quick Action Button
function QuickActionButton({ label, icon: Icon, href }: {
  label: string;
  icon: any;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="p-3 rounded-lg bg-[#1B4D3E] mb-2">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}\u003c/span>
      </div>
    </Link>
  );
}
