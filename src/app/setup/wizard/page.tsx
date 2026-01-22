"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

// Step components
import WelcomeStep from "./steps/WelcomeStep";
import GitHubStep from "./steps/GitHubStep";
import VercelStep from "./steps/VercelStep";
import ClerkStep from "./steps/ClerkStep";
import NeonStep from "./steps/NeonStep";
import AIStep from "./steps/AIStep";
import AppNameStep from "./steps/AppNameStep";
import DeployStep from "./steps/DeployStep";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
      <div className={`min-h-screen bg-white text-black flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className={`min-h-screen bg-white text-black flex items-center justify-center px-6 ${inter.className}`}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Session Error</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <a
            href="/setup"
            className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Enter License Key
          </a>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  return (
    <div className={`min-h-screen bg-white text-black ${inter.className}`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              VIBE STARTER
            </Link>
            <div className="text-sm text-gray-500">
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
                    ? "bg-black"
                    : step.id === currentStep
                    ? "bg-gray-400"
                    : "bg-gray-200"
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
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
        <div className={`min-h-screen bg-white text-black flex items-center justify-center ${inter.className}`}>
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
