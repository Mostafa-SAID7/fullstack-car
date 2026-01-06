import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  Image,
  Video,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ContentPlanning: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const contentItems = [
    {
      id: 1,
      title: 'Summer Car Maintenance Tips',
      type: 'blog',
      status: 'published',
      scheduledDate: '2024-01-07',
      platforms: ['facebook', 'instagram', 'twitter'],
      tags: ['maintenance', 'summer', 'tips'],
      author: 'Marketing Team'
    },
    {
      id: 2,
      title: 'Electric Vehicle Comparison Video',
      type: 'video',
      status: 'in-review',
      scheduledDate: '2024-01-08',
      platforms: ['youtube', 'instagram', 'facebook'],
      tags: ['electric', 'comparison', 'review'],
      author: 'Video Team'
    },
    {
      id: 3,
      title: 'Customer Success Story - John\'s Journey',
      type: 'story',
      status: 'draft',
      scheduledDate: '2024-01-09',
      platforms: ['linkedin', 'facebook'],
      tags: ['customer', 'success', 'testimonial'],
      author: 'Content Writer'
    },
    {
      id: 4,
      title: 'New Year Car Deals Infographic',
      type: 'image',
      status: 'scheduled',
      scheduledDate: '2024-01-10',
      platforms: ['instagram', 'pinterest', 'facebook'],
      tags: ['deals', 'infographic', 'new-year'],
      author: 'Design Team'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in-review': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'blog': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderCalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Content Calendar</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              Previous
            </button>
            <span className="px-4 py-1 font-medium">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button className="px-3 py-1 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dateStr = day ? `2024-01-${day.toString().padStart(2, '0')}` : '';
            const dayContent = day ? contentItems.filter(item => item.scheduledDate === dateStr) : [];
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-border rounded-lg ${
                  day ? 'bg-background hover:bg-muted/30 cursor-pointer' : ''
                } transition-colors`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className="space-y-1">
                      {dayContent.map(item => (
                        <div
                          key={item.id}
                          className={`text-xs p-1 rounded text-center ${getStatusColor(item.status)}`}
                        >
                          {item.title.substring(0, 20)}...
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {contentItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(item.scheduledDate).toLocaleDateString()}
                  </span>
                  <span>By {item.author}</span>
                  <span className="capitalize">{item.type}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Platforms:</span>
                  {item.platforms.map(platform => (
                    <span key={platform} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Planning</h1>
          <p className="text-muted-foreground">Plan and schedule your content across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              List
            </button>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Content', value: contentItems.length.toString(), icon: FileText, color: 'blue' },
          { label: 'Published', value: contentItems.filter(i => i.status === 'published').length.toString(), icon: CheckCircle, color: 'green' },
          { label: 'Scheduled', value: contentItems.filter(i => i.status === 'scheduled').length.toString(), icon: Clock, color: 'purple' },
          { label: 'In Review', value: contentItems.filter(i => i.status === 'in-review').length.toString(), icon: AlertCircle, color: 'orange' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content View */}
      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
    </motion.div>
  );
};
export default ContentPlanning;