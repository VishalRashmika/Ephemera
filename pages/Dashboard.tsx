
import React, { useMemo } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Tag as TagIcon,
  LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Bookmark, ViewMode, Category } from '../types';
import BookmarkCard from '../components/BookmarkCard';

interface DashboardProps {
  bookmarks: Bookmark[];
  categories: Category[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditTags: (bookmark: Bookmark) => void;
  onNavigate?: (page: string) => void;
  onClick?: (bookmark: Bookmark) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookmarks, categories, onAdd, onDelete, onToggleFavorite, onEditTags, onNavigate, onClick }) => {
  // Calculate actual statistics from bookmarks
  const { weeklyData, pieData, stats, weeklyBookmarksCount } = useMemo(() => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
    
    // Count bookmarks added this week
    const thisWeekBookmarks = bookmarks.filter(b => b.createdAt >= oneWeekAgo);
    const lastWeekBookmarks = bookmarks.filter(b => b.createdAt >= twoWeeksAgo && b.createdAt < oneWeekAgo);
    
    // Count bookmarks added this month
    const nowDate = new Date(now);
    const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1).getTime();
    const thisMonthBookmarks = bookmarks.filter(b => b.createdAt >= startOfMonth);
    
    // Calculate weekly trend
    const weeklyGrowth = lastWeekBookmarks.length > 0 
      ? ((thisWeekBookmarks.length - lastWeekBookmarks.length) / lastWeekBookmarks.length * 100).toFixed(0)
      : thisWeekBookmarks.length > 0 ? '+100' : '0';
    
    // Count unique tags
    const allTags = new Set<string>();
    bookmarks.forEach(b => b.tags?.forEach(tag => allTags.add(tag)));
    const uniqueTagCount = allTags.size;
    
    // Generate weekly activity chart data (last 7 days)
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const count = bookmarks.filter(b => b.createdAt >= dayStart && b.createdAt < dayEnd).length;
      const dayIndex = new Date(dayStart).getDay();
      weeklyData.push({ name: days[dayIndex], value: count });
    }
    
    // Generate category distribution for pie chart
    const categoryCount: { [key: string]: number } = {};
    
    // Count bookmarks per category
    bookmarks.forEach(b => {
      if (b.categoryId) {
        categoryCount[b.categoryId] = (categoryCount[b.categoryId] || 0) + 1;
      } else {
        categoryCount['Uncategorized'] = (categoryCount['Uncategorized'] || 0) + 1;
      }
    });
    
    // Get top 4 categories for pie chart
    const sortedCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
    
    const totalCategorized = sortedCategories.reduce((sum, [, count]) => sum + count, 0);
    const pieData = sortedCategories.map(([categoryId, count]) => {
      // Find category name by ID
      const category = categories.find(c => c.id === categoryId);
      const name = category ? category.name : (categoryId === 'Uncategorized' ? 'Uncategorized' : 'Unknown');
      
      return {
        name,
        value: totalCategorized > 0 ? Math.round((count / totalCategorized) * 100) : 0
      };
    });
    
    // Ensure percentages add up to 100
    if (pieData.length > 0) {
      const sum = pieData.reduce((s, d) => s + d.value, 0);
      if (sum < 100 && pieData.length > 0) {
        pieData[0].value += (100 - sum);
      }
    }
    
    const stats = [
      { 
        label: 'Total Bookmarks', 
        value: bookmarks.length, 
        icon: LayoutGrid, 
        trend: weeklyGrowth !== '0' ? `${weeklyGrowth.startsWith('-') ? '' : '+'}${weeklyGrowth}% this week` : 'No change' 
      },
      { 
        label: 'Active Tags', 
        value: uniqueTagCount, 
        icon: TagIcon, 
        trend: `${uniqueTagCount} tags` 
      },
      { 
        label: 'This Week', 
        value: thisWeekBookmarks.length, 
        icon: TrendingUp, 
        trend: `${thisWeekBookmarks.length} saved` 
      },
      { 
        label: 'This Month', 
        value: thisMonthBookmarks.length, 
        icon: Clock, 
        trend: `${thisMonthBookmarks.length} saved` 
      },
    ];
    
    return { weeklyData, pieData, stats, weeklyBookmarksCount: thisWeekBookmarks.length };
  }, [bookmarks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning!</h1>
          <p className="text-slate/70 dark:text-lightgrey/70 mt-1">You've saved {weeklyBookmarksCount} new {weeklyBookmarksCount === 1 ? 'item' : 'items'} this week.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-navy/80 transition-all active:scale-95 shadow-lg shadow-navy/10 dark:bg-teal dark:text-ink dark:shadow-teal/10 dark:hover:bg-teal/80"
        >
          <Plus size={18} />
          Add New
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gold/20 flex flex-col justify-between dark:bg-deepslate dark:border-steel/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gold/10 rounded-lg dark:bg-steel/20">
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-sage/20 text-sage dark:bg-teal/20 dark:text-teal' : 'bg-burnt/20 text-burnt'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-slate/60 dark:text-lightgrey/60 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/20 dark:bg-deepslate dark:border-steel/30">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-sm">Saving Activity</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-navy dark:bg-teal" />
                  <span>Bookmarks</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D3557" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1D3557" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorValueDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A8DADC" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#A8DADC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#4A4E69' }}
                    axisLine={{ stroke: '#E9C46A' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#4A4E69' }}
                    axisLine={{ stroke: '#E9C46A' }}
                    tickLine={false}
                    label={{ 
                      value: 'Bookmarks', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: '#4A4E69' }
                    }}
                    allowDecimals={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9C46A" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value} bookmark${value !== 1 ? 's' : ''}`, 'Saved']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1D3557" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold/20 dark:bg-deepslate dark:border-steel/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-sm">Recently Added</h3>
              <button 
                onClick={() => onNavigate?.('bookmarks')}
                className="text-xs text-navy dark:text-teal font-medium flex items-center gap-1 hover:underline"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookmarks.slice(0, 4).map(bookmark => (
                <BookmarkCard 
                  key={bookmark.id} 
                  bookmark={bookmark} 
                  viewMode={ViewMode.GRID} 
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onEditTags={onEditTags}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/20 dark:bg-deepslate dark:border-steel/30">
            <h3 className="text-sm font-semibold mb-6 text-center">Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#1D3557', '#8AB17D', '#E9C46A', '#457B9D'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate dark:text-lightgrey">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#1D3557', '#8AB17D', '#E9C46A', '#457B9D'][i] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
