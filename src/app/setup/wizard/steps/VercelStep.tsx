"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Connect Vercel</h2>
        <p className="text-white/60">
          Vercel puts your app on the internet — for free.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">
              Vercel Connected{vercelUser ? ` as ${vercelUser}` : ""}
            </span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          {/* One-click OAuth connection */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-400 text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-semibold">Connect your Vercel account</h4>
            </div>
            <p className="text-sm text-white/70 ml-11">
              Click the button below to authorize Vibe Starter to deploy apps to your Vercel account.
              If you don&apos;t have a Vercel account yet, you&apos;ll be prompted to create one.
            </p>
          </div>

          {/* Important note about project access */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <p className="text-amber-400 text-sm">
              <strong>When Vercel asks about project access:</strong> Select <strong>&quot;All Projects&quot;</strong> —
              we need this to create your NEW project. We only use it once to deploy, then delete our access immediately.
            </p>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors mb-6 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Connect with Vercel →
          </button>

          {/* What is Vercel? */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>What is Vercel?</strong> It&apos;s free web hosting that automatically
              updates your site whenever you push code to GitHub. No server setup needed.
            </p>
          </div>
        </>
      )}

      {/* Security note */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">SECURITY:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>We only request permission to create projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Used only to deploy YOUR app to YOUR account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Access deleted immediately after setup completes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
