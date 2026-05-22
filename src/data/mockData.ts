export const mockData = {
  goldPrices: {
    '24K': 6250,
    '22K': 5729,
    '18K': 4688,
  },
  brands: [
    { id: '1', name: 'MMTC-PAMP', trustScore: 99, verified: true, color: 'bg-gradient-to-br from-blue-900 to-black' },
    { id: '2', name: 'Tanishq', trustScore: 98, verified: true, color: 'bg-gradient-to-br from-yellow-900 to-black' },
    { id: '3', name: 'Augmont', trustScore: 96, verified: true, color: 'bg-gradient-to-br from-purple-900 to-black' },
    { id: '4', name: 'SafeGold', trustScore: 95, verified: true, color: 'bg-gradient-to-br from-emerald-900 to-black' },
  ],
  categories: [
    { id: '1', name: '24K Coins', count: 124, icon: 'Coins', purity: '24K' },
    { id: '2', name: '22K Jewellery', count: 840, icon: 'Gem', purity: '22K' },
    { id: '3', name: 'Gold ETF', count: 12, icon: 'TrendingUp', purity: '99.9%' },
    { id: '4', name: 'Digital Gold', count: 1, icon: 'Smartphone', purity: '24K' },
    { id: '5', name: 'Gold Bonds', count: 5, icon: 'FileText', purity: 'Govt.' },
    { id: '6', name: 'Gold Bars', count: 45, icon: 'Box', purity: '24K' },
  ],
  userHoldings: [
    { id: '1', name: 'Digital Gold 24K', weight: 15.5, value: 96875, change: '+12.4%' },
    { id: '2', name: 'MMTC-PAMP 10g Coin', weight: 10, value: 62500, change: '+5.2%' },
  ],
  recentTransactions: [
    { id: '1', type: 'Buy', item: 'Digital Gold', amount: 5000, date: '12 Oct, 2023', status: 'Completed' },
    { id: '2', type: 'SIP', item: 'Auto-invest', amount: 2000, date: '01 Oct, 2023', status: 'Completed' },
    { id: '3', type: 'Sell', item: '22K Chain', amount: 45000, date: '28 Sep, 2023', status: 'Completed' },
  ],
  notifications: [
    { id: '1', title: 'Price Alert', message: 'Gold price dropped by 1.2% today.', time: '2 hours ago', read: false },
    { id: '2', title: 'SIP Executed', message: 'Your monthly SIP of ₹2000 was successful.', time: '1 day ago', read: true },
  ]
};
