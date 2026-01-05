import React, { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  Link,
  FileText,
  Globe,
  AlertTriangle,
  BarChart3,
  Target,
  RefreshCw,
  Download,
  Zap
} from 'lucide-react';
import type { SEOMetrics as SEOMetricsType } from '../../services/analytics';
import { analyticsService } from '../../services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/layout/cards/Card';
import { Button } from '../../components/forms/buttons/Button';
import Progress from '../../components/feedback/progress/Progress';
import Badge from '../../components/data-display/badges/Badge';
import { Input } from '../../components/forms/inputs/Input';
import { ChartSkeleton } from '../../components/feedback/skeletons/ChartSkeleton';
import { StatsSkeleton } from '../../components/feedback/skeletons/StatsSkeleton';
import { useToast } from '../../hooks';

interface SEOScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  loading?: boolean;
}

const SEOScoreCard: React.FC<SEOScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  status,
  icon,
  loading = false
}) => {
  if (loading) {
    return <StatsSkeleton count={1} />;
  }

  const percentage = (score / maxScore) * 100;
  const statusColors = {
    good: 'text-green-500 bg-green-50',
    warning: 'text-yellow-500 bg-yellow-50',
    critical: 'text-red-500 bg-red-50'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-full ${statusColors[status]}`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(percentage)}</div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold mt-1">{score} / {maxScore}</p>
          <Badge
            variant={status === 'good' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
            className="mt-2"
          >
            {status === 'good' ? 'Good' : status === 'warning' ? 'Needs Work' : 'Critical'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

interface KeywordRankingProps {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: number;
  url: string;
}

const KeywordRanking: React.FC<KeywordRankingProps> = ({
  keyword,
  position,
  previousPosition,
  searchVolume,
  difficulty,
  url
}) => {
  const positionChange = previousPosition - position;
  const isImproved = positionChange > 0;
  const isDeclined = positionChange < 0;

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{keyword}</span>
          {isImproved && <TrendingUp className="w-4 h-4 text-green-500" />}
          {isDeclined && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Position: #{position}</span>
          <span>Volume: {searchVolume.toLocaleString()}</span>
          <span>Difficulty: {difficulty}%</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate">
          {url}
        </div>
      </div>
    </div>
  );
};

export const SEOAnalysis: React.FC = () => {
  const [seoData, setSeoData] = useState<SEOMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState(window.location.hostname);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordResults, setKeywordResults] = useState<any[]>([]);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadSEOData();
  }, [domain]);

  const loadSEOData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getSEOMetrics(domain);
      setSeoData(data);
    } catch (err) {
      toastError('Failed to load SEO data');
      console.error('SEO data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkKeywords = async () => {
    if (!keywordInput.trim()) return;

    try {
      const keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k);
      const results = await analyticsService.getKeywordRankings(keywords);
      setKeywordResults(results);
      success(`Checked rankings for ${keywords.length} keywords`);
    } catch (err) {
      toastError('Failed to check keyword rankings');
    }
  };

  const exportSEOReport = () => {
    if (!seoData) return;

    const reportData = {
      domain,
      generatedAt: new Date().toISOString(),
      onPageSEO: seoData.onPage,
      technicalSEO: seoData.technical,
      keywords: seoData.keywords,
      backlinks: seoData.backlinks
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${domain}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    success('SEO report exported successfully!');
  };

  if (loading || !seoData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <StatsSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Calculate overall SEO score
  const calculateOverallScore = () => {
    const onPageScore = (
      (seoData.onPage.titleOptimization.optimized / seoData.onPage.titleOptimization.totalPages) * 25 +
      (seoData.onPage.metaDescription.optimized / seoData.onPage.metaDescription.totalPages) * 25 +
      (seoData.onPage.images.withAlt / seoData.onPage.images.totalImages) * 20 +
      (seoData.onPage.contentQuality.readabilityScore / 100) * 15 +
      ((seoData.onPage.headings.h1.total - seoData.onPage.headings.h1.missing) / seoData.onPage.headings.h1.total) * 15
    );

    const technicalScore = (
      ((seoData.technical.indexability.indexedPages / (seoData.technical.indexability.indexedPages + seoData.technical.indexability.notIndexedPages)) * 100) * 0.4 +
      ((seoData.technical.mobileFriendliness.mobileFriendly / (seoData.technical.mobileFriendliness.mobileFriendly + seoData.technical.mobileFriendliness.notMobileFriendly)) * 100) * 0.3 +
      (seoData.technical.structuredData.valid / (seoData.technical.structuredData.valid + seoData.technical.structuredData.invalid) * 100) * 0.3
    );

    return Math.round((onPageScore + technicalScore) / 2);
  };

  const overallScore = calculateOverallScore();
  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive SEO analysis and optimization insights
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain"
              className="w-48"
            />
          </div>

          <Button variant="outline" onClick={loadSEOData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Analyze
          </Button>

          <Button variant="outline" onClick={exportSEOReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall SEO Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${overallScore}, 100`}
                  className="text-muted"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={
                    overallScore >= 80 ? 'text-green-500' :
                      overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }
                  strokeDasharray="100, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${overallScore >= 80 ? 'text-green-500' :
                    overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                  {overallScore}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Overall SEO Score</h3>
            <Badge
              variant={getScoreStatus(overallScore) === 'good' ? 'default' :
                getScoreStatus(overallScore) === 'warning' ? 'secondary' : 'destructive'}
            >
              {getScoreStatus(overallScore) === 'good' ? 'Excellent' :
                getScoreStatus(overallScore) === 'warning' ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* SEO Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SEOScoreCard
          title="On-Page SEO"
          score={Math.round(
            (seoData.onPage.titleOptimization.optimized / seoData.onPage.titleOptimization.totalPages +
              seoData.onPage.metaDescription.optimized / seoData.onPage.metaDescription.totalPages +
              seoData.onPage.images.withAlt / seoData.onPage.images.totalImages) / 3 * 100
          )}
          status={getScoreStatus(
            (seoData.onPage.titleOptimization.optimized / seoData.onPage.titleOptimization.totalPages +
              seoData.onPage.metaDescription.optimized / seoData.onPage.metaDescription.totalPages +
              seoData.onPage.images.withAlt / seoData.onPage.images.totalImages) / 3 * 100
          )}
          icon={<FileText className="w-5 h-5" />}
        />

        <SEOScoreCard
          title="Technical SEO"
          score={Math.round(
            (seoData.technical.indexability.indexedPages / (seoData.technical.indexability.indexedPages + seoData.technical.indexability.notIndexedPages) +
              seoData.technical.mobileFriendliness.mobileFriendly / (seoData.technical.mobileFriendliness.mobileFriendly + seoData.technical.mobileFriendliness.notMobileFriendly)) / 2 * 100
          )}
          status={getScoreStatus(
            (seoData.technical.indexability.indexedPages / (seoData.technical.indexability.indexedPages + seoData.technical.indexability.notIndexedPages) +
              seoData.technical.mobileFriendliness.mobileFriendly / (seoData.technical.mobileFriendliness.mobileFriendly + seoData.technical.mobileFriendliness.notMobileFriendly)) / 2 * 100
          )}
          icon={<Zap className="w-5 h-5" />}
        />

        <SEOScoreCard
          title="Content Quality"
          score={Math.round(seoData.onPage.contentQuality.readabilityScore)}
          status={getScoreStatus(seoData.onPage.contentQuality.readabilityScore)}
          icon={<BarChart3 className="w-5 h-5" />}
        />

        <SEOScoreCard
          title="Backlink Profile"
          score={Math.round((seoData.backlinks.dofollow / seoData.backlinks.total) * 100)}
          status={getScoreStatus((seoData.backlinks.dofollow / seoData.backlinks.total) * 100)}
          icon={<Link className="w-5 h-5" />}
        />
      </div>

      {/* On-Page SEO Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Title Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Optimized Titles</span>
                <span className="text-sm font-medium">
                  {seoData.onPage.titleOptimization.optimized} / {seoData.onPage.titleOptimization.totalPages}
                </span>
              </div>
              <Progress
                value={(seoData.onPage.titleOptimization.optimized / seoData.onPage.titleOptimization.totalPages) * 100}
                className="h-2"
              />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-500">
                    {seoData.onPage.titleOptimization.missing}
                  </div>
                  <div className="text-xs text-muted-foreground">Missing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-500">
                    {seoData.onPage.titleOptimization.tooLong}
                  </div>
                  <div className="text-xs text-muted-foreground">Too Long</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-500">
                    {seoData.onPage.titleOptimization.duplicate}
                  </div>
                  <div className="text-xs text-muted-foreground">Duplicate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Optimized Descriptions</span>
                <span className="text-sm font-medium">
                  {seoData.onPage.metaDescription.optimized} / {seoData.onPage.metaDescription.totalPages}
                </span>
              </div>
              <Progress
                value={(seoData.onPage.metaDescription.optimized / seoData.onPage.metaDescription.totalPages) * 100}
                className="h-2"
              />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-500">
                    {seoData.onPage.metaDescription.missing}
                  </div>
                  <div className="text-xs text-muted-foreground">Missing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-500">
                    {seoData.onPage.metaDescription.tooLong}
                  </div>
                  <div className="text-xs text-muted-foreground">Too Long</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-500">
                    {seoData.onPage.metaDescription.duplicate}
                  </div>
                  <div className="text-xs text-muted-foreground">Duplicate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Enter keywords separated by commas"
                className="flex-1"
              />
              <Button onClick={checkKeywords}>
                <Search className="w-4 h-4 mr-2" />
                Check Rankings
              </Button>
            </div>

            {keywordResults.length > 0 && (
              <div className="space-y-2">
                {keywordResults.slice(0, 5).map((result: any, index: number) => (
                  <KeywordRanking key={index} {...result} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backlink Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Backlink Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {seoData.backlinks.total.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Backlinks</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {seoData.backlinks.domains}
              </div>
              <p className="text-sm text-muted-foreground">Referring Domains</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {Math.round((seoData.backlinks.dofollow / seoData.backlinks.total) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Dofollow Links</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Top Referring Domains</h4>
            <div className="space-y-2">
              {seoData.backlinks.topDomains.map((domainItem: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="font-medium">{domainItem.domain}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{domainItem.backlinks} links</span>
                    <span className="text-xs text-muted-foreground ml-2">DA: {domainItem.domainAuthority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical SEO Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seoData.technical.mobileFriendliness.mobileIssues.map((issue: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">{issue.issue}</p>
                  <p className="text-sm text-red-700 mt-1">
                    {issue.pages} pages affected • Severity: {issue.severity}
                  </p>
                </div>
              </div>
            ))}

            {seoData.technical.crawlability.crawlErrors > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Crawl Errors Detected
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {seoData.technical.crawlability.crawlErrors} errors found that may prevent search engines from crawling your site properly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
