import { TestBed } from '@angular/core/testing';
import { CoreWebVitalsService } from './core-web-vitals.service';

// Mock the dependent services
const mockLCPService = {
  currentLCP: jest.fn(() => null),
  clearMetrics: jest.fn(),
  optimizeCriticalRenderingPath: jest.fn(),
  addCriticalResource: jest.fn(),
  addResourceHint: jest.fn(),
};

const mockFIDService = {
  getCurrentMetrics: jest.fn(() => ({
    currentFID: 0,
    averageFID: 0,
    maxFID: 0,
    sampleCount: 0,
    inputEventCount: 0,
    averageProcessingTime: 0,
    mainThreadBlockedTime: 0,
    optimizationScore: 100,
    timestamp: Date.now()
  })),
  resetMetrics: jest.fn(),
  enableOptimization: jest.fn(),
  disableOptimization: jest.fn(),
  updateConfig: jest.fn(),
  addTask: jest.fn(),
  appliedOptimizations: jest.fn(() => []),
};

const mockCLSService = {
  getCurrentMetrics: jest.fn(() => ({
    totalCLS: 0,
    largestShift: 0,
    shiftCount: 0,
    averageShift: 0,
    lastShiftTime: 0,
    worstOffenders: []
  })),
  resetMetrics: jest.fn(),
  startMonitoring: jest.fn(),
};

describe('CoreWebVitalsService', () => {
  let service: CoreWebVitalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'LCPOptimizationService',
          useValue: mockLCPService
        },
        {
          provide: 'FIDOptimizationService', 
          useValue: mockFIDService
        },
        {
          provide: 'CLSMonitoringService',
          useValue: mockCLSService
        }
      ]
    });

    // Create service manually with mocked dependencies
    service = new CoreWebVitalsService();
    
    // Inject mocked services
    (service as any).lcpService = mockLCPService;
    (service as any).fidService = mockFIDService;
    (service as any).clsService = mockCLSService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with optimization enabled', () => {
    expect(service.isOptimizationEnabled()).toBe(true);
  });

  it('should have applied optimizations', () => {
    const optimizations = service.appliedOptimizations();
    expect(optimizations.length).toBeGreaterThan(0);
    expect(optimizations).toContain('LCP Resource Preloading');
    expect(optimizations).toContain('FID Event Optimization');
    expect(optimizations).toContain('CLS Layout Stabilization');
  });

  it('should return null metrics when no data available', () => {
    const metrics = service.getCurrentMetrics();
    expect(metrics).toBeNull();
  });

  it('should calculate metrics when data is available', () => {
    // Setup mock data
    mockLCPService.currentLCP.mockReturnValue({
      value: 2000,
      rating: 'good',
      timestamp: Date.now()
    });

    mockFIDService.getCurrentMetrics.mockReturnValue({
      currentFID: 50,
      averageFID: 60,
      maxFID: 80,
      sampleCount: 5,
      inputEventCount: 10,
      averageProcessingTime: 45,
      mainThreadBlockedTime: 0,
      optimizationScore: 95,
      timestamp: Date.now()
    });

    mockCLSService.getCurrentMetrics.mockReturnValue({
      totalCLS: 0.05,
      largestShift: 0.02,
      shiftCount: 3,
      averageShift: 0.017,
      lastShiftTime: Date.now(),
      worstOffenders: []
    });

    const metrics = service.getCurrentMetrics();
    
    expect(metrics).toBeTruthy();
    if (metrics) {
      expect(metrics.lcp.value).toBe(2000);
      expect(metrics.lcp.achieved).toBe(true);
      expect(metrics.fid.value).toBe(50);
      expect(metrics.fid.achieved).toBe(true);
      expect(metrics.cls.value).toBe(0.05);
      expect(metrics.cls.achieved).toBe(true);
      expect(metrics.overall.allTargetsMet).toBe(true);
    }
  });

  it('should identify when targets are not met', () => {
    // Setup mock data with poor performance
    mockLCPService.currentLCP.mockReturnValue({
      value: 5000, // Poor LCP
      rating: 'poor',
      timestamp: Date.now()
    });

    mockFIDService.getCurrentMetrics.mockReturnValue({
      currentFID: 200, // Poor FID
      averageFID: 180,
      maxFID: 250,
      sampleCount: 5,
      inputEventCount: 10,
      averageProcessingTime: 190,
      mainThreadBlockedTime: 100,
      optimizationScore: 40,
      timestamp: Date.now()
    });

    mockCLSService.getCurrentMetrics.mockReturnValue({
      totalCLS: 0.3, // Poor CLS
      largestShift: 0.15,
      shiftCount: 8,
      averageShift: 0.0375,
      lastShiftTime: Date.now(),
      worstOffenders: []
    });

    const metrics = service.getCurrentMetrics();
    
    expect(metrics).toBeTruthy();
    if (metrics) {
      expect(metrics.lcp.achieved).toBe(false);
      expect(metrics.fid.achieved).toBe(false);
      expect(metrics.cls.achieved).toBe(false);
      expect(metrics.overall.allTargetsMet).toBe(false);
      expect(metrics.overall.rating).toBe('poor');
    }
  });

  it('should provide recommendations for poor performance', () => {
    // Setup mock data with poor performance
    mockLCPService.currentLCP.mockReturnValue({
      value: 5000,
      rating: 'poor',
      timestamp: Date.now()
    });

    mockFIDService.getCurrentMetrics.mockReturnValue({
      currentFID: 400,
      averageFID: 350,
      maxFID: 500,
      sampleCount: 5,
      inputEventCount: 10,
      averageProcessingTime: 380,
      mainThreadBlockedTime: 200,
      optimizationScore: 20,
      timestamp: Date.now()
    });

    mockCLSService.getCurrentMetrics.mockReturnValue({
      totalCLS: 0.4,
      largestShift: 0.2,
      shiftCount: 12,
      averageShift: 0.033,
      lastShiftTime: Date.now(),
      worstOffenders: []
    });

    const recommendations = service.getRecommendations();
    
    expect(recommendations.length).toBeGreaterThan(0);
    
    // Should have critical recommendations for all metrics
    const criticalRecs = recommendations.filter(r => r.priority === 'critical');
    expect(criticalRecs.length).toBe(3); // One for each metric
    
    // Check specific recommendations
    expect(recommendations.some(r => r.metric === 'lcp')).toBe(true);
    expect(recommendations.some(r => r.metric === 'fid')).toBe(true);
    expect(recommendations.some(r => r.metric === 'cls')).toBe(true);
  });

  it('should reset all metrics', () => {
    service.resetMetrics();
    
    expect(mockLCPService.clearMetrics).toHaveBeenCalled();
    expect(mockFIDService.resetMetrics).toHaveBeenCalled();
    expect(mockCLSService.resetMetrics).toHaveBeenCalled();
  });

  it('should check if all targets are met', () => {
    // Initially no metrics, should return false
    expect(service.areAllTargetsMet()).toBe(false);
    
    // Setup good metrics
    mockLCPService.currentLCP.mockReturnValue({
      value: 2000,
      rating: 'good',
      timestamp: Date.now()
    });

    mockFIDService.getCurrentMetrics.mockReturnValue({
      currentFID: 50,
      averageFID: 60,
      maxFID: 80,
      sampleCount: 5,
      inputEventCount: 10,
      averageProcessingTime: 45,
      mainThreadBlockedTime: 0,
      optimizationScore: 95,
      timestamp: Date.now()
    });

    mockCLSService.getCurrentMetrics.mockReturnValue({
      totalCLS: 0.05,
      largestShift: 0.02,
      shiftCount: 3,
      averageShift: 0.017,
      lastShiftTime: Date.now(),
      worstOffenders: []
    });

    expect(service.areAllTargetsMet()).toBe(true);
  });

  it('should export performance data', () => {
    const exportedData = service.exportPerformanceData();
    
    expect(exportedData).toBeTruthy();
    expect(exportedData.timestamp).toBeTruthy();
    expect(exportedData.targets).toBeTruthy();
    expect(exportedData.appliedOptimizations).toBeTruthy();
    expect(exportedData.deviceInfo).toBeTruthy();
  });
});