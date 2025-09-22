/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./public'],
  server: './server.ts',
  serverBuildPath: 'build/index.js',
  serverModuleFormat: 'cjs',
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverPlatform: 'node',
  tailwind: false,
  postcss: false,
};