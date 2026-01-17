const path = require('path');

/**
 * Custom Webpack Configuration for Angular 19
 * 
 * Optimizes code splitting, lazy loading, bundle performance, and tree shaking
 */
module.exports = {
  // Mode-specific optimizations
  mode: process.env['NODE_ENV'] === 'production' ? 'production' : 'development',
  
  // Optimization configuration for better code splitting and tree shaking
  optimization: {
    // Advanced code splitting configuration
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 20KB minimum chunk size
      maxSize: 250000, // 250KB maximum chunk size
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000, // 50KB enforcement threshold
      
      cacheGroups: {
        // Runtime chunk - highest priority
        runtime: {
          name: 'runtime',
          chunks: 'all',
          test: /[\\/]webpack[\\/]runtime/,
          priority: 100,
          enforce: true,
          reuseExistingChunk: true
        },

        // Angular framework - critical path
        angular: {
          name: 'angular',
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          chunks: 'all',
          priority: 90,
          reuseExistingChunk: true,
          enforce: true
        },

        // Angular UI libraries (CDK, Material)
        angularUI: {
          name: 'angular-ui',
          test: /[\\/]node_modules[\\/]@angular[\\/](cdk|material)[\\/]/,
          chunks: 'all',
          priority: 85,
          reuseExistingChunk: true
        },

        // RxJS - separate chunk for reactive programming
        rxjs: {
          name: 'rxjs',
          test: /[\\/]node_modules[\\/]rxjs[\\/]/,
          chunks: 'all',
          priority: 80,
          reuseExistingChunk: true
        },

        // Large third-party libraries
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/](lodash|moment|chart\.js|d3|three)[\\/]/,
          chunks: 'all',
          priority: 70,
          reuseExistingChunk: true
        },

        // UI and styling libraries
        ui: {
          name: 'ui-libs',
          test: /[\\/]node_modules[\\/](tailwindcss|@headlessui|@heroicons|@hugeicons)[\\/]/,
          chunks: 'all',
          priority: 65,
          reuseExistingChunk: true
        },

        // Utility libraries
        utils: {
          name: 'utils',
          test: /[\\/]node_modules[\\/](date-fns|validator|uuid|crypto-js|lodash-es)[\\/]/,
          chunks: 'all',
          priority: 60,
          reuseExistingChunk: true
        },

        // Translation and i18n libraries
        i18n: {
          name: 'i18n',
          test: /[\\/]node_modules[\\/](@ngx-translate|@angular[\\/]localize)[\\/]/,
          chunks: 'all',
          priority: 55,
          reuseExistingChunk: true
        },

        // Core application services
        core: {
          name: 'core',
          test: /[\\/]src[\\/]app[\\/]core[\\/]/,
          chunks: 'all',
          priority: 50,
          minChunks: 2,
          reuseExistingChunk: true
        },

        // Shared components
        shared: {
          name: 'shared',
          test: /[\\/]src[\\/]app[\\/]shared[\\/]/,
          chunks: 'all',
          priority: 45,
          minChunks: 2,
          reuseExistingChunk: true
        },

        // Feature modules - async loading with dynamic names
        features: {
          name(module) {
            const featureName = module.context?.match(/[\\/]features[\\/]([^[\\/]]*)/);
            return featureName ? `feature-${featureName[1]}` : 'features';
          },
          test: /[\\/]src[\\/]app[\\/]features[\\/]/,
          chunks: 'async',
          priority: 40,
          minChunks: 1,
          reuseExistingChunk: true
        },

        // Layout components
        layout: {
          name: 'layout',
          test: /[\\/]src[\\/]app[\\/]layout[\\/]/,
          chunks: 'all',
          priority: 35,
          minChunks: 1,
          reuseExistingChunk: true
        },

        // Common vendor libraries
        common: {
          name: 'common',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 20,
          minChunks: 2,
          maxSize: 200000, // 200KB max for common chunks
          reuseExistingChunk: true
        },

        // Default chunk for remaining modules
        default: {
          name: 'default',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
          maxSize: 150000 // 150KB max for default chunks
        }
      }
    },
    
    // Runtime chunk optimization
    runtimeChunk: {
      name: 'runtime'
    },
    
    // Module concatenation for better tree shaking
    concatenateModules: true,
    
    // Minimize bundle size in production
    minimize: process.env['NODE_ENV'] === 'production',
    
    // Tree shaking optimization
    usedExports: true,
    sideEffects: false,
    
    // Remove empty chunks
    removeEmptyChunks: true,
    
    // Merge duplicate chunks
    mergeDuplicateChunks: true,
    
    // Remove modules from chunks when they are already included in parent chunks
    removeAvailableModules: true,
    
    // Flag chunks as child of another chunk
    flagIncludedChunks: true
  },
  
  // Module resolution optimization
  resolve: {
    // Path aliases for cleaner imports and better bundling
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@core': path.resolve(__dirname, 'src/app/core'),
      '@features': path.resolve(__dirname, 'src/app/features'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@environments': path.resolve(__dirname, 'src/environments'),
      
      // Optimize library imports for better tree shaking
      'lodash': 'lodash-es',
      'rxjs/Rx': 'rxjs',
      'moment': 'date-fns' // Suggest date-fns as lighter alternative
    },
    
    // Optimize module resolution
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    
    // Prefer ES modules for better tree shaking
    mainFields: ['es2015', 'module', 'main'],
    
    // Extensions to resolve
    extensions: ['.ts', '.js', '.json', '.mjs'],
    
    // Symlinks resolution
    symlinks: false
  },
  
  // Performance hints and budgets
  performance: {
    hints: process.env['NODE_ENV'] === 'production' ? 'warning' : false,
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000, // 500KB
    assetFilter: function(assetFilename) {
      // Only check JS and CSS files for performance budgets
      return /\.(js|css)$/.test(assetFilename);
    }
  },
  
  // Source maps configuration
  devtool: process.env['NODE_ENV'] === 'production' ? 'source-map' : 'eval-source-map',
  
  // Module rules for better optimization
  module: {
    rules: [
      // TypeScript optimization with tree shaking
      {
        test: /\.ts$/,
        use: [
          {
            loader: '@angular-devkit/build-angular/src/babel/webpack-loader',
            options: {
              aot: true,
              buildOptimizer: true,
              // Enable tree shaking for TypeScript
              sideEffects: false
            }
          }
        ],
        exclude: /node_modules/
      },
      
      // CSS optimization with tree shaking
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
              // Enable CSS tree shaking
              esModule: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  // PurgeCSS for removing unused CSS
                  ...(process.env['NODE_ENV'] === 'production' ? [
                    require('@fullhuman/postcss-purgecss')({
                      content: ['./src/**/*.{html,ts}'],
                      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
                    })
                  ] : [])
                ]
              }
            }
          }
        ]
      },
      
      // SCSS optimization
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              esModule: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      
      // Asset optimization
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB - inline smaller images
          }
        },
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]'
        }
      },
      
      // Font optimization
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  
  // Plugins for additional optimizations
  plugins: [
    // Add any custom plugins here for further optimization
  ],
  
  // Cache configuration for faster rebuilds
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  // Experiments for cutting-edge optimizations
  experiments: {
    // Enable top-level await
    topLevelAwait: true,
    
    // Enable CSS as modules
    css: true
  },
  
  // Stats configuration for better build analysis
  stats: {
    chunks: true,
    chunkModules: true,
    chunkOrigins: true,
    modules: false,
    reasons: true,
    usedExports: true,
    providedExports: true,
    optimizationBailout: true,
    errorDetails: true,
    colors: true,
    hash: true,
    version: true,
    timings: true,
    builtAt: true,
    
    // Exclude verbose information in production
    ...(process.env['NODE_ENV'] === 'production' && {
      modules: false,
      chunks: false,
      chunkModules: false,
      reasons: false
    })
  },
  
  // Externals for CDN optimization (optional)
  externals: process.env['USE_CDN'] === 'true' ? {
    // Example: Load large libraries from CDN in production
    // 'lodash': '_',
    // 'moment': 'moment'
  } : {}
};