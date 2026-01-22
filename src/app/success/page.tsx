'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Check, Copy, ArrowRight } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

function SuccessContent() {
  const searchParams = useSearchParams();
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    // Move setState calls into async context to avoid cascading renders
    const validateSession = async () => {
      if (!sessionId) {
        setError('No session found. Please try purchasing again.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/stripe-success?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success) {
          setLicenseKey(data.licenseKey);
          setEmail(data.email);
        } else {
          setError(data.error || 'Failed to generate license key');
        }
      } catch {
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [searchParams]);

  const copyToClipboard = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/"
          className="text-black underline hover:no-underline"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-8 w-8 text-white" strokeWidth={3} />
      </div>

      <h1 className="text-3xl font-bold mb-2">You&apos;re in!</h1>
      <p className="text-gray-600 mb-8">
        Here&apos;s your license key. Copy it and head to setup.
      </p>

      {/* License key display */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Your License Key</p>
        <div className="flex items-center justify-center gap-3">
          <code className="text-2xl font-mono font-bold tracking-wider">
            {licenseKey}
          </code>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        {email && (
          <p className="text-xs text-gray-400 mt-4">
            Also sent to {email}
          </p>
        )}
      </div>

      {/* CTA to setup */}
      <Link
        href="/setup"
        className="flex items-center justify-center w-full bg-black text-white h-12 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors"
      >
        Continue to Setup
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>

      <p className="text-xs text-gray-400 mt-4">
        Keep this key safe. You&apos;ll need it to start the wizard.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md px-4 py-16">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
