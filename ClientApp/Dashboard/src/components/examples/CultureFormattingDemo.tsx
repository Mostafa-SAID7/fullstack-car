/**
 * Demo component showcasing culture-aware formatting capabilities
 * This component demonstrates how data formatting changes based on the selected culture
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FormattedDate, 
  FormattedNumber, 
  FormattedCurrency, 
  FormattedPercentage,
  FormattedFileSize,
  FormattedDuration,
  StatisticCard,
  DataTableCell
} from '../formatting/CultureAwareFormatting';
import { useCultureFormatting, SupportedCulture, SUPPORTED_CULTURES } from '../../utils/cultureFormatting';
import { changeLanguage } from '../../i18n';

export const CultureFormattingDemo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useCultureFormatting();
  const [selectedCulture, setSelectedCulture] = useState<SupportedCulture>('en-US');

  // Sample data for demonstration
  const sampleData = {
    date: new Date('2024-01-15T14:30:00Z'),
    number: 1234567.89,
    currency: 2500.75,
    percentage: 0.8542,
    fileSize: 1073741824, // 1GB
    duration: 3665, // 1 hour, 1 minute, 5 seconds
    statistics: [
      { title: 'Total Revenue', value: 125000, type: 'currency' as const },
      { title: 'Active Users', value: 45678, type: 'number' as const },
      { title: 'Conversion Rate', value: 0.1234, type: 'percentage' as const }
    ]
  };

  const handleCultureChange = async (culture: SupportedCulture) => {
    setSelectedCulture(culture);
    await changeLanguage(culture);
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold mb-2">Culture-Aware Formatting Demo</h1>
        <p className="text-muted-foreground">
          See how data formatting changes based on the selected culture and language
        </p>
      </div>

      {/* Culture Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Culture</h2>
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {Object.entries(SUPPORTED_CULTURES).map(([code, config]) => (
            <button
              key={code}
              onClick={() => handleCultureChange(code as SupportedCulture)}
              className={`p-3 rounded-lg border transition-colors ${
                selectedCulture === code
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-border'
              }`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg">{config.flag}</span>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="font-medium">{code}</div>
                  <div className="text-xs text-muted-foreground">{config.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Formatting Examples */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Formatting Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Date Formatting */}
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Date Formatting</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Short: </span>
                <FormattedDate date={sampleData.date} format="short" culture={selectedCulture} />
              </div>
              <div>
                <span className="text-muted-foreground">Medium: </span>
                <FormattedDate date={sampleData.date} format="medium" culture={selectedCulture} />
              </div>
              <div>
                <span className="text-muted-foreground">Long: </span>
                <FormattedDate date={sampleData.date} format="long" culture={selectedCulture} />
              </div>
              <div>
                <span className="text-muted-foreground">With Time: </span>
                <FormattedDate date={sampleData.date} format="datetime" culture={selectedCulture} />
              </div>
            </div>
          </div>

          {/* Number Formatting */}
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Number Formatting</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Standard: </span>
                <FormattedNumber value={sampleData.number} culture={selectedCulture} />
              </div>
              <div>
                <span className="text-muted-foreground">Compact: </span>
                <FormattedNumber value={sampleData.number} culture={selectedCulture} compact />
              </div>
              <div>
                <span className="text-muted-foreground">Percentage: </span>
                <FormattedPercentage value={sampleData.percentage} culture={selectedCulture} />
              </div>
              <div>
                <span className="text-muted-foreground">File Size: </span>
                <FormattedFileSize bytes={sampleData.fileSize} culture={selectedCulture} />
              </div>
            </div>
          </div>

          {/* Currency Formatting */}
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Currency Formatting</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Local Currency: </span>
                <FormattedCurrency 
                  amount={sampleData.currency} 
                  culture={selectedCulture} 
                  useLocalCurrency 
                />
              </div>
              <div>
                <span className="text-muted-foreground">USD: </span>
                <FormattedCurrency 
                  amount={sampleData.currency} 
                  culture={selectedCulture} 
                  currency="USD" 
                />
              </div>
              <div>
                <span className="text-muted-foreground">EUR: </span>
                <FormattedCurrency 
                  amount={sampleData.currency} 
                  culture={selectedCulture} 
                  currency="EUR" 
                />
              </div>
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <FormattedDuration seconds={sampleData.duration} culture={selectedCulture} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleData.statistics.map((stat, index) => (
            <StatisticCard
              key={index}
              title={stat.title}
              value={stat.value}
              type={stat.type}
              culture={selectedCulture}
              trend={{
                value: Math.random() * 20 - 10, // Random trend between -10% and +10%
                isPositive: Math.random() > 0.5
              }}
            />
          ))}
        </div>
      </div>

      {/* Data Table Example */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Data Table Formatting</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className={`p-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>Type</th>
                <th className={`p-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>Raw Value</th>
                <th className={`p-3 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>Formatted</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Number</td>
                <td className="p-3 font-mono text-sm">1234567.89</td>
                <td className="p-3">
                  <DataTableCell 
                    value={1234567.89} 
                    type="number" 
                    culture={selectedCulture} 
                    compact 
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Currency</td>
                <td className="p-3 font-mono text-sm">2500.75</td>
                <td className="p-3">
                  <DataTableCell 
                    value={2500.75} 
                    type="currency" 
                    culture={selectedCulture} 
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Date</td>
                <td className="p-3 font-mono text-sm">2024-01-15T14:30:00Z</td>
                <td className="p-3">
                  <DataTableCell 
                    value={sampleData.date} 
                    type="date" 
                    culture={selectedCulture} 
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Percentage</td>
                <td className="p-3 font-mono text-sm">0.8542</td>
                <td className="p-3">
                  <DataTableCell 
                    value={0.8542} 
                    type="percentage" 
                    culture={selectedCulture} 
                  />
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">File Size</td>
                <td className="p-3 font-mono text-sm">1073741824</td>
                <td className="p-3">
                  <DataTableCell 
                    value={1073741824} 
                    type="filesize" 
                    culture={selectedCulture} 
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3">Duration</td>
                <td className="p-3 font-mono text-sm">3665</td>
                <td className="p-3">
                  <DataTableCell 
                    value={3665} 
                    type="duration" 
                    culture={selectedCulture} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RTL Layout Demo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">RTL Layout Support</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Notice how the layout automatically adjusts for right-to-left languages (Arabic variants).
            Text alignment, flex directions, and spacing all adapt to provide a natural reading experience.
          </p>
          
          <div className={`flex items-center gap-4 p-4 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {SUPPORTED_CULTURES[selectedCulture].flag}
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="font-medium">Current Culture: {selectedCulture}</div>
              <div className="text-sm text-muted-foreground">
                Direction: {isRTL ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}
              </div>
            </div>
            <div className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              <FormattedCurrency amount={12345.67} culture={selectedCulture} useLocalCurrency />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureFormattingDemo;