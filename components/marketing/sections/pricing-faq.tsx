import * as React from 'react';
import Link from 'next/link';

import { GridSection } from '@/components/marketing/fragments/grid-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { AppInfo } from '@/constants/app-info';
import { Routes } from '@/constants/routes';

const DATA = [
  {
    question: `What pricing plans does ${AppInfo.APP_NAME} offer?`,
    answer: (
      <>
        We offer three plans:
        <br /> - <strong>Free:</strong> A starter plan for individuals or small
        teams.\n- **Pro:** Advanced features for growing businesses.\n-
        **Enterprise:** Custom solutions for large organizations.\n\nEach plan
        is designed to scale with your needs.
      </>
    )
  },
  {
    question: 'What’s included in the Free plan?',
    answer: `The Free plan is perfect for getting started and includes:\n- AI Contact Scoring for 100 contacts/month\n- Smart Email Analysis for 1,000 emails/month\n- Access for up to 2 team members.`
  },
  {
    question: 'What features are in the Pro plan?',
    answer: `The Pro plan is ideal for growing teams and includes:\n- Unlimited AI Contact Scoring and Email Analysis\n- Advanced Lead Predictions\n- Real-time Sentiment Analysis\n- Up to 120 team members.`
  },
  {
    question: 'What does the Enterprise plan offer?',
    answer: `The Enterprise plan is fully customizable and includes:\n- AI Contact Scoring and Email Analysis with custom limits\n- Custom AI models for Lead Predictions\n- Advanced storage solutions\n- 24/7 Enterprise Support\n- Unlimited team members.\n\nContact us to discuss your organization’s needs.`
  },
  {
    question: 'What happens if I upgrade or downgrade my plan?',
    answer: `If you upgrade, you'll be charged a prorated amount for the remaining time in your billing cycle. If you downgrade, the changes will take effect at the end of your current billing cycle.`
  },
  {
    question: 'Is there a setup fee?',
    answer: `No, there are no setup fees. You can start using ${AppInfo.APP_NAME} immediately after signing up.`
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: `If you exceed your plan limits, you’ll receive an alert and can either upgrade to a higher plan or adjust your usage to stay within your current plan.`
  }
];

export function PricingFAQ(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%]">
              Have questions about our pricing or plans?{' '}
              <Link
                href={Routes.Contact}
                className="font-normal text-inherit underline hover:text-foreground"
              >
                Contact us
              </Link>{' '}
              - we're here to help you find the perfect fit for your needs.
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <Accordion
              type="single"
              collapsible
            >
              {DATA.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                >
                  <AccordionTrigger className="text-left text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
