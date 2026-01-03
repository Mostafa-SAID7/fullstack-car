export const ContentSections: React.FC = () => {
  const recentPosts = [
    { title: "Car maintenance tips for winter", author: "John Doe", status: "Published", time: "2 hours ago" },
    { title: "Best practices for car washing", author: "Jane Smith", status: "Under Review", time: "4 hours ago" },
    { title: "Electric vehicle charging guide", author: "Mike Johnson", status: "Published", time: "6 hours ago" },
  ];

  const moderationQueue = [
    { content: "Inappropriate comment on car review", type: "Comment", reporter: "User123", severity: "High" },
    { content: "Spam post about car sales", type: "Post", reporter: "User456", severity: "Medium" },
    { content: "Offensive language in forum", type: "Comment", reporter: "User789", severity: "High" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Posts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                <p className="text-xs text-gray-500">{post.author} • {post.time}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Queue</h3>
        <div className="space-y-4">
          {moderationQueue.map((item, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">{item.type}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.severity}
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{item.content}</p>
              <p className="text-xs text-gray-500">Reported by {item.reporter}</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};