/* eslint-disable import/prefer-default-export */
export function getPreloadChunkList(stats) {
  return Array.from(new Set(Object.keys(stats)
    .filter(item => /^.\/pages\//.test(item))
    .reduce(
      (acc, cur) => [
        ...acc,
        ...stats[cur]
          .map(i => i.publicPath)
          .filter(p => /\.chunk\.js$/.test(p)),
      ],
      [],
    )))
}
