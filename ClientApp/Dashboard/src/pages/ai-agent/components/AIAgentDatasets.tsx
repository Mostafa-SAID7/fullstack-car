import { motion } from 'framer-motion';
import { 
  Upload, 
  BookOpen, 
  Database, 
  Eye 
} from 'lucide-react';
import type { Dataset } from '../../../types/datasets';

export const AIAgentDatasets: React.FC = () => {
  const datasets: Dataset[] = [
    {
      id: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      name: 'Car Knowledge Base',
      samples: 15000,
      size: '45.2 MB',
      type: 'Q&A',
      lastUpdated: '2 days ago',
      accuracy: 94.2,
      tags: ['automotive', 'knowledge'],
      metadata: {
        format: 'json',
        encoding: 'utf-8',
        language: 'en',
        domain: 'automotive',
        source: 'internal',
        version: '1.0'
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
          totalSamples: 15000,
          averageLength: 250,
          minLength: 10,
          maxLength: 1000,
          uniqueTokens: 50000,
          duplicates: 0,
          emptyEntries: 0,
          languageDistribution: { en: 15000 }
        }
      }
    },
    {
      id: '2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-08T00:00:00Z',
      name: 'Customer Service',
      samples: 25000,
      size: '78.5 MB',
      type: 'Conversation',
      lastUpdated: '1 week ago',
      accuracy: 91.8,
      tags: ['customer-service', 'conversations'],
      metadata: {
        format: 'json',
        encoding: 'utf-8',
        language: 'en',
        domain: 'customer-service',
        source: 'internal',
        version: '1.0'
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
          totalSamples: 25000,
          averageLength: 300,
          minLength: 15,
          maxLength: 1500,
          uniqueTokens: 75000,
          duplicates: 0,
          emptyEntries: 0,
          languageDistribution: { en: 25000 }
        }
      }
    },
    {
      id: '3',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z',
      name: 'Maintenance Guide',
      samples: 8000,
      size: '23.1 MB',
      type: 'Instructions',
      lastUpdated: '3 days ago',
      accuracy: 89.5,
      tags: ['maintenance', 'instructions'],
      metadata: {
        format: 'json',
        encoding: 'utf-8',
        language: 'en',
        domain: 'maintenance',
        source: 'internal',
        version: '1.0'
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
          totalSamples: 8000,
          averageLength: 200,
          minLength: 20,
          maxLength: 800,
          uniqueTokens: 40000,
          duplicates: 0,
          emptyEntries: 0,
          languageDistribution: { en: 8000 }
        }
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dataset Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border transition-all duration-300 rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Dataset Management</h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" />
              Upload Dataset
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors">
              <BookOpen className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span className="font-medium">{dataset.name}</span>
                </div>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Samples:</span>
                  <span className="font-medium">{dataset.samples.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{dataset.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{dataset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-medium text-green-500">{dataset.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span className="text-muted-foreground">{dataset.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors">
                  Edit
                </button>
                <button className="flex-1 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};