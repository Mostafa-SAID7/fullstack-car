import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Clock, 
  DollarSign,
  MapPin,
  Shield,
  Zap
} from 'lucide-react';
import type { Service } from '../types';

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onView: (service: Service) => void;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'text-green-600 bg-green-50';
      case 0: return 'text-gray-600 bg-gray-50';
      case 2: return 'text-red-600 bg-red-50';
      case 3: return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 1: return <Shield className="w-4 h-4" />;
      case 2: return <Edit className="w-4 h-4" />;
      case 3: return <Eye className="w-4 h-4" />;
      case 4: return <Zap className="w-4 h-4" />;
      case 5: return <MapPin className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {service.imageUrl && (
                      <img
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        src={service.imageUrl}
                        alt={service.title}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {service.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {service.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(service.type)}
                    <span className="ml-2 text-sm text-foreground">
                      {service.typeName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {service.serviceProviderName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-foreground">
                      {service.basePrice}
                      {service.maxPrice && service.maxPrice !== service.basePrice && (
                        <span className="text-muted-foreground"> - {service.maxPrice}</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-foreground">
                      {service.estimatedDuration}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-foreground">
                      {service.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({service.totalReviews})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                    {service.statusName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(service)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(service)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {services.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No services found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new service.
          </p>
        </div>
      )}
    </div>
  );
};