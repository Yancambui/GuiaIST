import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DiagnosticTool } from "./components/DiagnosticTool";
import { ConsultationHistory } from "./components/ConsultationHistory";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "history">("diagnostic");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-blue-600">IST Diagnostic</h2>
            <span className="text-sm text-gray-500">Ferramenta de Apoio ao Diagnóstico</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">
        <Content activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ activeTab, setActiveTab }: { 
  activeTab: "diagnostic" | "history", 
  setActiveTab: (tab: "diagnostic" | "history") => void 
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Authenticated>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Apoio ao Diagnóstico de ISTs
          </h1>
          <p className="text-gray-600">
            Bem-vindo(a), {loggedInUser?.email}. Esta ferramenta auxilia na identificação de ISTs baseada em sintomas clínicos.
          </p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("diagnostic")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "diagnostic"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nova Consulta
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Histórico
            </button>
          </nav>
        </div>

        {activeTab === "diagnostic" && <DiagnosticTool />}
        {activeTab === "history" && <ConsultationHistory />}
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Diagnóstico de ISTs
            </h1>
            <p className="text-gray-600">
              Faça login para acessar a ferramenta de apoio ao diagnóstico
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
