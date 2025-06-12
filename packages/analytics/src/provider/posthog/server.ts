import type { PostHog as ServerPostHog } from 'posthog-node';

import { keys } from '../../../keys';
import type { AnalyticsProvider } from '../types';

class PostHogServerAnalyticsProvider implements AnalyticsProvider {
  private serverPostHog: ServerPostHog | undefined;
  private userId: string | undefined;
  private isInitialized = false;

  public async identify(
    userIdentifier: string,
    traits?: Record<string, string>
  ): Promise<void> {
    await this.initialize();
    this.userId = userIdentifier;
    const server = await this.initializeOrGetServerPostHog();
    server.capture({
      event: '$identify',
      distinctId: userIdentifier,
      properties: traits,
    });
  }

  public async trackPageView(url: string): Promise<void> {
    await this.initialize();
    if (!this.userId) {
      throw new Error(
        `Please identify the user using the identify method before tracking page views on the server`
      );
    }
    const server = await this.initializeOrGetServerPostHog();
    server.capture({
      event: '$pageview',
      distinctId: this.userId,
      properties: { $current_url: url },
    });
  }

  public async trackEvent(
    eventName: string,
    eventProperties?: Record<string, string | string[]>
  ): Promise<void> {
    await this.initialize();
    if (!this.userId) {
      throw new Error(
        `Please identify the user using the identify method before tracking events on the server`
      );
    }
    const server = await this.initializeOrGetServerPostHog();
    server.capture({
      event: eventName,
      distinctId: this.userId,
      properties: eventProperties,
    });
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;
    if (!posthogKey) {
      console.warn('PostHog server key not provided, skipping initialization');
      return;
    }

    const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST;
    if (!posthogHost) {
      console.warn('PostHog server host not provided, skipping initialization');
      return;
    }

    await this.initializeOrGetServerPostHog();
    this.isInitialized = true;
  }

  private async initializeOrGetServerPostHog(): Promise<ServerPostHog> {
    if (!this.serverPostHog) {
      const { PostHog } = await import('posthog-node');

      const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST!;
      const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;

      this.serverPostHog = new PostHog(posthogKey, {
        host: posthogHost,
        flushAt: 1,
        flushInterval: 0,
      });
    }
    return this.serverPostHog;
  }
}

export default new PostHogServerAnalyticsProvider();
