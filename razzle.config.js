module.exports = {
  // do something to config
  modify: (config, { target, dev }) => {
    if (dev || target !== 'web') {
      return config
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
    }
    return newConfig
  },
}
