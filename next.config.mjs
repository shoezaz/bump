import withBundleAnalyzer from '@next/bundle-analyzer';
import { createSecureHeaders } from 'next-secure-headers';

const bundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZER === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  images: {
    domains: []
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        locale: false,
        source: '/(.*)',
        headers: createSecureHeaders({
          frameGuard: 'deny',
          noopen: 'noopen',
          nosniff: 'nosniff',
          xssProtection: 'sanitize',
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true }
          ],
          referrerPolicy: 'same-origin'
        })
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/home',
        permanent: false
      },
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: false
      },
      {
        source: '/dashboard',
        destination: '/dashboard/home',
        permanent: false
      },
      {
        source: '/dashboard/settings',
        destination: '/dashboard/settings/account/profile',
        permanent: false
      },
      {
        source: '/dashboard/settings/account',
        destination: '/dashboard/settings/account/profile',
        permanent: false
      },
      {
        source: '/dashboard/settings/organization',
        destination: '/dashboard/settings/organization/information',
        permanent: false
      }
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

export default bundleAnalyzerConfig(nextConfig);
