"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

interface SessionData {
  hasVercel: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function VercelStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const searchParams = useSearchParams();
  const vercelSuccess = searchParams.get("vercel_success");
  const vercelUser = searchParams.get("vercel_user");

  const isConnected = session?.hasVercel || vercelSuccess === "true";

  // Refresh session when we get back from OAuth
  useEffect(() => {
    if (vercelSuccess === "true") {
      onRefresh();
    }
  }, [vercelSuccess, onRefresh]);

  const handleConnect = () => {
    // Redirect to Vercel OAuth
    window.location.href = `/api/auth/vercel?session=${sessionId}`;
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Connect Vercel</h2>
        <p className="text-gray-500">
          Vercel puts your app on the internet — for free.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              Vercel Connected{vercelUser ? ` as ${vercelUser}` : ""}
            </span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          {/* One-click OAuth connection */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-semibold">Connect your Vercel account</h4>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              Click the button below to authorize Vibe Starter to deploy apps to your Vercel account.
              If you don&apos;t have a Vercel account yet, you&apos;ll be prompted to create one.
            </p>
          </div>

          {/* Important note about project access */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-700 text-sm">
              <strong>When Vercel asks about project access:</strong> Select <strong>&quot;All Projects&quot;</strong> —
              we need this to create your NEW project. We only use it once to deploy, then delete our access immediately.
            </p>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors mb-6 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Connect with Vercel
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* What is Vercel? */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm">
              <strong>What is Vercel?</strong> It&apos;s free web hosting that automatically
              updates your site whenever you push code to GitHub. No server setup needed.
            </p>
          </div>
        </>
      )}

      {/* Security note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-gray-500 mb-3">SECURITY:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-black mt-0.5">✓</span>
            <span>We only request permission to create projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black mt-0.5">✓</span>
            <span>Used only to deploy YOUR app to YOUR account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black mt-0.5">✓</span>
            <span>Access deleted immediately after setup completes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
