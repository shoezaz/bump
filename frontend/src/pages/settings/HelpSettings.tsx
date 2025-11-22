import { HelpCircle, Mail, MessageCircle, Book, ExternalLink } from 'lucide-react';

export const HelpSettings = () => {
  const faqs = [
    {
      question: 'How do I transfer ownership of a watch?',
      answer:
        'Go to the watch details page and click "Transfer Ownership". Generate a QR code and have the buyer scan it with their Watch Passport account.',
    },
    {
      question: 'What happens when I report a watch as stolen?',
      answer:
        'A permanent, immutable record is created on the blockchain. All dealers and manufacturers in our network are notified, and the watch is flagged in our global database.',
    },
    {
      question: 'How is my data protected?',
      answer:
        'We use industry-standard encryption, secure JWT authentication, and follow GDPR compliance. Your data is stored securely and never shared without your consent.',
    },
    {
      question: 'How long does KYC verification take?',
      answer:
        'KYC verification typically takes 1-3 business days. You\'ll receive an email notification once your verification is complete.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <MessageCircle className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Need help? Our support team is here to assist you.
        </p>

        <div className="space-y-3">
          <a
            href="mailto:support@watchpassport.com"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Email Support</p>
              <p className="text-sm text-gray-600">support@watchpassport.com</p>
            </div>
          </a>

          <button className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Live Chat</p>
              <p className="text-sm text-gray-600">Available Mon-Fri, 9am-6pm CET</p>
            </div>
          </button>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Book className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
        </div>

        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Getting Started Guide</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">API Documentation</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Security Best Practices</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mt-4"
        >
          View all FAQs
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Version</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform</span>
            <span className="font-medium text-gray-900">Watch Passport</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-900">November 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
