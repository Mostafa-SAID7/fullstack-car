interface SkeletonProps {
  type?: 'text' | 'card' | 'list' | 'circle' | 'rectangle';
  lines?: number[];
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

const SkeletonLine = ({ width = '100%' }: { width?: string | number }) => (
  <div
    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-loading rounded"
    style={{ width: typeof width === 'number' ? `${width}%` : width }}
  />
);

const SkeletonText = ({ lines = [100, 90, 95] }: { lines?: number[] }) => (
  <div className="space-y-3">
    {lines.map((width, index) => (
      <SkeletonLine key={index} width={width} />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-loading" />
    <div className="p-4 space-y-3">
      <SkeletonLine width="75%" />
      <SkeletonLine width="100%" />
      <SkeletonLine width="85%" />
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-loading" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="25%" />
          <SkeletonLine width="100%" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonCircle = ({ size = 48 }: { size?: number }) => (
  <div
    className="rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-loading"
    style={{ width: size, height: size }}
  />
);

const SkeletonRectangle = ({ width = 200, height = 100 }: { width?: number; height?: number }) => (
  <div
    className="rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-loading"
    style={{ width, height }}
  />
);

export const SkeletonScreen = ({
  type = 'text',
  lines,
  size,
  width,
  height,
  className = ''
}: SkeletonProps) => {
  return (
    <div className={className} role="status" aria-label="Loading content">
      {type === 'text' && <SkeletonText lines={lines} />}
      {type === 'card' && <SkeletonCard />}
      {type === 'list' && <SkeletonList />}
      {type === 'circle' && <SkeletonCircle size={size} />}
      {type === 'rectangle' && <SkeletonRectangle width={width} height={height} />}
    </div>
  );
};
