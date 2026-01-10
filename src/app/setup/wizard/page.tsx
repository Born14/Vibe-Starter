"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Step components
import WelcomeStep from "./steps/WelcomeStep";
import GitHubStep from "./steps/GitHubStep";
import VercelStep from "./steps/VercelStep";
import ClerkStep from "./steps/ClerkStep";
import NeonStep from "./steps/NeonStep";
import AIStep from "./steps/AIStep";
import AppNameStep from "./steps/AppNameStep";
import DeployStep from "./steps/DeployStep";

const STEPS = [
  { id: 1, name: "Welcome", component: WelcomeStep },
  { id: 2, name: "GitHub", component: GitHubStep },
  { id: 3, name: "Vercel", component: VercelStep },
  { id: 4, name: "Clerk", component: ClerkStep },
  { id: 5, name: "Neon", component: NeonStep },
  { id: 6, name: "AI", component: AIStep },
  { id: 7, name: "Name", component: AppNameStep },
  { id: 8, name: "Deploy", component: DeployStep },
];

interface SessionData {
  id: string;
  currentStep: number;
  hasGithub: boolean;
  hasVercel: boolean;
  hasClerk: boolean;
  hasNeon: boolean;
  hasAi: boolean;
  appName: string | null;
}

function WizardContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load session on mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("wizardSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchSession(storedSessionId);
    } else {
      setLoading(false);
      setError("No session found. Please enter your license key.");
    }
  }, []);

  // Handle OAuth callbacks
  useEffect(() => {
    const githubSuccess = searchParams.get("github_success");
    const vercelSuccess = searchParams.get("vercel_success");
    const oauthError = searchParams.get("error");

    if (githubSuccess && sessionId) {
      fetchSession(sessionId);
    }
    if (vercelSuccess && sessionId) {
      fetchSession(sessionId);
    }
    if (oauthError) {
      setError(`OAuth error: ${oauthError}`);
    }
  }, [searchParams, sessionId]);

  const fetchSession = async (id: string) => {
    try {
      const response = await fetch(`/api/session?id=${id}`);
      const data = await response.json();

      if (response.ok) {
        setSession(data);
        setCurrentStep(data.currentStep);
        setError(null);
      } else {
        setError(data.error || "Failed to load session");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const refreshSession = () => {
    if (sessionId) {
      fetchSession(sessionId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">!</div>
          <h1 className="text-2xl font-bold mb-4">Session Error</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <a
            href="/setup"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
          >
            Enter License Key
          </a>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold tracking-tight">
              vibe<span className="text-emerald-400">starter</span>
            </div>
            <div className="text-sm text-white/60">
              Step {currentStep} of {STEPS.length}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step.id < currentStep
                    ? "bg-emerald-400"
                    : step.id === currentStep
                    ? "bg-white"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {CurrentStepComponent && (
            <CurrentStepComponent
              sessionId={sessionId!}
              session={session}
              onNext={nextStep}
              onRefresh={refreshSession}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
