const { ReactLoadablePlugin } = require('react-loadable/webpack')

module.exports = {
  // do something to config
  modify: (config, { target, dev }) => {
    const plugins = target === 'web' ? [
      ...config.plugins,
      new ReactLoadablePlugin({
        filename: './build/react-loadable.json',
      }),
    ] : [...config.plugins]


    if (dev || target !== 'web') {
      return {
        ...config,
        devServer: {
          ...config.devServer,
        },
        plugins,
      }
    }
    const newConfig = {
      ...config,
      optimization: {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          automaticNameDelimiter: '~',
          cacheGroups: {
            // 首先: 打包node_modules中的文件
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 10,
            },
          },
        },
      },
      plugins,
    }
    return newConfig
  },
}
