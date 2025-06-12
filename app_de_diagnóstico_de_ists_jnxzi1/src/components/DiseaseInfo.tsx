import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DiseaseInfo({ diseaseName }: { diseaseName: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const diseases = useQuery(api.diseases.getAllDiseases);
  
  const disease = diseases?.find(d => d.name === diseaseName);
  
  if (!disease) return null;
  
  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {showDetails ? "Ocultar" : "Ver"} informações clínicas
      </button>
      
      {showDetails && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Agente etiológico:</span>
            <p className="text-gray-600">{disease.agent}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Exames diagnósticos:</span>
            <ul className="text-gray-600 list-disc list-inside">
              {disease.diagnostic_tests.map((test, idx) => (
                <li key={idx}>{test}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Tratamento:</span>
            <p className="text-gray-600 bg-blue-50 p-2 rounded">{disease.treatment_notes}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Possíveis complicações:</span>
            <ul className="text-gray-600 list-disc list-inside">
              {disease.complications.map((complication, idx) => (
                <li key={idx}>{complication}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
