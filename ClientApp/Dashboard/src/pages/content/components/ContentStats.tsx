import { FileText, MessageSquare, Flag, TrendingUp } from 'lucide-react';

export const ContentStats: React.FC = () => {
  const stats = [
    { title: 'Total Posts', value: '1,234', icon: FileText, color: 'blue' },
    { title: 'Total Comments', value: '5,678', icon: MessageSquare, color: 'green' },
    { title: 'Pending Reports', value: '23', icon: Flag, color: 'red' },
    { title: 'Engagement Rate', value: '78%', icon: TrendingUp, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-card-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};