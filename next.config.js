/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const removeImports = require('next-remove-imports')();

const withRemoveImports = removeImports({
  experimental: { esmExternals: true },
});

const bundleAnalyzer = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
});

/**
 * @type {import('next').NextConfig}
 */
module.exports = { ...bundleAnalyzer, ...withRemoveImports };
