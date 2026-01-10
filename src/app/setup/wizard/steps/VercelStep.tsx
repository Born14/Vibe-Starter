"use client";

interface SessionData {
  hasVercel: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
}

export default function VercelStep({ sessionId, session, onNext }: StepProps) {
  const isConnected = session?.hasVercel;

  const handleConnect = () => {
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
          Vercel puts your app on the internet. Push code, site updates automatically.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Vercel Connected</span>
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
          <button
            onClick={handleConnect}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Connect with Vercel
          </button>

          <p className="text-center text-sm text-white/60 mb-2">
            <strong>Tip:</strong> Sign up with your GitHub account for easiest setup.
          </p>

          <p className="text-center text-sm text-white/40 mb-8">
            Don&apos;t have a Vercel account? You&apos;ll create one when you click above.
          </p>
        </>
      )}

      {/* Trust Box */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">WHAT VERCEL DOES:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Hosts your app for free (generous free tier)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Auto-deploys when you push to GitHub</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Gives you a URL like your-app.vercel.app</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
