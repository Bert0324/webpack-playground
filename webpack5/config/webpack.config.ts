import { Configuration, DefinePlugin } from 'webpack';
import { join } from 'path';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const sourcePath = join(__dirname, '../', 'src');
const imageInlineSizeLimit = 10000;
const getStyleLoaders = (cssModule?: boolean) => [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      esModule: false,
    },
  },
  {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      sourceMap: false,
      modules: {
        mode: cssModule ? 'local' : 'icss',
        getLocalIdent: cssModule ? (context: any, _localIdentName: any, localName: any) => {
          const hash = (() => {
            const timestamp = new Date().getTime().toString();
            const input = `${Buffer.from(localName + context.resourcePath).toString('base64')}`;
            let output = '';
            while (output.length < 8) {
              output += input[Math.floor(Math.random() * (input.length - 0))];
              output += timestamp[Math.floor(Math.random() * (timestamp.length - 0))];
            }
            return output.replace(/\W/g, '');
          })();
          return `${localName}_${hash}`;
        } : undefined,
      }
    },
  },
  {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        ident: 'postcss',
        plugins: [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
          'postcss-normalize',
        ],
      },
      sourceMap: false
    },
  },
  {
    loader: require.resolve('resolve-url-loader'),
    options: {
      sourceMap: false,
      root: sourcePath,
    },
  },
  {
    loader: require.resolve('less-loader'),
    options: {
      sourceMap: false,
      lessOptions: {
        javascriptEnabled: true
      },
      implementation: 'less'
    },
  }
];

export default {
  entry: './src/index',
  mode: 'production',
  devtool: false,
  output: {
    path: join(__dirname, '../dist'),
    clean: true,
    pathinfo: false,
    filename: `[name].[contenthash:8].js`,
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: true,
          ie8: false,
          keep_classnames: false,
          keep_fnames: false,
          output: {
            comments: false,
            ascii_only: true
          },
          safari10: true,
          sourceMap: false
        }
      }),
      new OptimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
            name: 'vendor',
            priority: 1,
            test: /node_modules/,
            minSize: 0,
            minChunks: 1
        },
        common: {
            name: 'common',
            priority: 0,
            minSize: 0,
            minChunks: 2
        }
    }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({ 
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
    new DefinePlugin({
			ENV: JSON.stringify('production')
		}),
    new HtmlWebpackPlugin({
			inject: 'body',
			template: join(__dirname, '../', 'public/index.html'),
      cache: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
		}),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
    modules: ['node_modules'],
    alias: { '@': sourcePath },
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false }},
      {
        oneOf: [
          {
            test: [/\.avif$/],
            type: 'asset',
            mimetype: 'image/avif',
            parser: {
              dataUrlCondition: {
                maxSize: imageInlineSizeLimit,
              },
            },
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: imageInlineSizeLimit,
              },
            },
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: require.resolve('@svgr/webpack'),
                options: {
                  prettier: false,
                  svgo: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              {
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/media/[name].[hash].[ext]',
                },
              },
            ],
            issuer: {
              and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
            },
          },
          {
            test: /(\.less|\.css)$/,
            resourceQuery: /modules/,
            use: getStyleLoaders(true),
            sideEffects: true,
          },
          {
            test: /(\.less|\.css)$/,
            use: getStyleLoaders(),
            sideEffects: true,
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: [ sourcePath ],
            exclude: /node_modules/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true,
              plugins: ['@umijs/babel-plugin-auto-css-modules'].map(v => require.resolve(v)).filter(Boolean),
              // 云构建不用cache
              cacheCompression: false,
              cacheDirectory: false,
              compact: true,
              configFile: false,
            },
          },
          {
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: 'asset/resource',
          },
        ].filter(Boolean)
      }
    ]
  }
} as Configuration;