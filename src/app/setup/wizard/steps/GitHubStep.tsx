"use client";

interface SessionData {
  hasGithub: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
}

export default function GitHubStep({ sessionId, session, onNext }: StepProps) {
  const isConnected = session?.hasGithub;

  const handleConnect = () => {
    window.location.href = `/api/auth/github?session=${sessionId}`;
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Connect GitHub</h2>
        <p className="text-white/60">
          GitHub is where your code lives. Think of it like Google Drive for code.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-orange-400/20 text-orange-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">GitHub Connected</span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleConnect}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Connect with GitHub
          </button>

          <p className="text-center text-sm text-white/40 mb-8">
            Don&apos;t have a GitHub account? You&apos;ll create one when you click above.
          </p>
        </>
      )}

      {/* Trust Box */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">WE WILL NEVER:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">✓</span>
            <span>Read your other repos or private code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">✓</span>
            <span>Make changes without your explicit approval</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">✓</span>
            <span>Store your credentials after setup completes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
