'use client';

import type { PostHog as ClientPostHog } from 'posthog-js';

import { keys } from '../../../keys';
import type { AnalyticsProvider } from '../types';

class PostHogClientAnalyticsProvider implements AnalyticsProvider {
  private clientPostHog: ClientPostHog | undefined;
  private isInitialized = false;

  public async identify(
    userIdentifier: string,
    traits?: Record<string, string>
  ): Promise<void> {
    await this.initialize();
    const client = await this.initializeOrGetClientPostHog();
    client.identify(userIdentifier, traits);
  }

  public async trackPageView(url: string): Promise<void> {
    await this.initialize();
    const client = await this.initializeOrGetClientPostHog();
    client.capture('$pageview', { $current_url: url });
  }

  public async trackEvent(
    eventName: string,
    eventProperties?: Record<string, string | string[]>
  ): Promise<void> {
    await this.initialize();
    const client = await this.initializeOrGetClientPostHog();
    client.capture(eventName, eventProperties);
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;
    if (!posthogKey) {
      console.warn('PostHog client key not provided, skipping initialization');
      return;
    }

    const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST;
    if (!posthogHost) {
      console.warn('PostHog client host not provided, skipping initialization');
      return;
    }

    await this.initializeOrGetClientPostHog();
    this.isInitialized = true;
  }

  private async initializeOrGetClientPostHog(): Promise<ClientPostHog> {
    if (!this.clientPostHog) {
      const { posthog } = await import('posthog-js');

      const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;
      const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST!;

      posthog.init(posthogKey, {
        api_host: posthogHost,
        ui_host: posthogHost,
        persistence: 'localStorage+cookie',
        person_profiles: 'always',
        capture_pageview: false,
        capture_pageleave: true,
      });
      this.clientPostHog = posthog;
    }
    return this.clientPostHog;
  }
}

export default new PostHogClientAnalyticsProvider();
