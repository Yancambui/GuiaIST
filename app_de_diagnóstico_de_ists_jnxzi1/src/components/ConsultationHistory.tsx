import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function ConsultationHistory() {
  const consultations = useQuery(api.consultations.getUserConsultations);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  if (consultations === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <p className="text-gray-500">Nenhuma consulta realizada ainda.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getSymptomLabel = (symptom: string) => {
    const labels: Record<string, string> = {
      corrimento_vaginal: "Corrimento vaginal",
      corrimento_uretral: "Corrimento uretral",
      corrimento_purulento: "Corrimento purulento",
      corrimento_espumoso: "Corrimento espumoso",
      lesao_genital: "Lesão genital",
      lesao_indolor: "Lesão indolor",
      lesao_dolorosa: "Lesão dolorosa",
      vesiculas: "Vesículas",
      odor_caracteristico: "Odor característico",
      prurido_intenso: "Prurido intenso",
      disuria: "Disúria",
      dispareunia: "Dispareunia",
      dor_pelvica: "Dor pélvica",
      sangramento_pos_coito: "Sangramento pós-coito",
      febre: "Febre",
      mal_estar: "Mal-estar geral",
      linfadenopatia_inguinal: "Linfadenopatia inguinal",
      urgencia_urinaria: "Urgência urinária",
      hiperemia_vulvar: "Hiperemia vulvar",
      irritacao_vulvar: "Irritação vulvar"
    };
    return labels[symptom] || symptom;
  };

  if (selectedConsultation) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes da Consulta</h2>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                ← Voltar ao histórico
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              Realizada em {formatDate(selectedConsultation._creationTime)}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Symptoms */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Sintomas Principais</h3>
              <div className="flex flex-wrap gap-2">
                {selectedConsultation.symptoms.map((symptom: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {getSymptomLabel(symptom)}
                  </span>
                ))}
              </div>
            </div>

            {/* Discharge Info */}
            {selectedConsultation.discharge_info && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Características do Corrimento</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedConsultation.discharge_info.color && (
                    <div>
                      <span className="font-medium">Cor:</span> {selectedConsultation.discharge_info.color}
                    </div>
                  )}
                  {selectedConsultation.discharge_info.odor && (
                    <div>
                      <span className="font-medium">Odor:</span> {selectedConsultation.discharge_info.odor}
                    </div>
                  )}
                  {selectedConsultation.discharge_info.consistency && (
                    <div>
                      <span className="font-medium">Consistência:</span> {selectedConsultation.discharge_info.consistency}
                    </div>
                  )}
                  {selectedConsultation.discharge_info.amount && (
                    <div>
                      <span className="font-medium">Quantidade:</span> {selectedConsultation.discharge_info.amount}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lesion Info */}
            {selectedConsultation.lesion_info && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Características das Lesões</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedConsultation.lesion_info.type && (
                    <div>
                      <span className="font-medium">Tipo:</span> {selectedConsultation.lesion_info.type}
                    </div>
                  )}
                  {selectedConsultation.lesion_info.location && (
                    <div>
                      <span className="font-medium">Localização:</span> {selectedConsultation.lesion_info.location}
                    </div>
                  )}
                  {selectedConsultation.lesion_info.pain !== undefined && (
                    <div>
                      <span className="font-medium">Dor:</span> {selectedConsultation.lesion_info.pain ? 'Presente' : 'Ausente'}
                    </div>
                  )}
                  {selectedConsultation.lesion_info.number && (
                    <div>
                      <span className="font-medium">Número:</span> {selectedConsultation.lesion_info.number}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Symptoms */}
            {selectedConsultation.additional_symptoms.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sintomas Adicionais</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultation.additional_symptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {getSymptomLabel(symptom)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedConsultation.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedConsultation.notes}
                </p>
              </div>
            )}

            {/* Results */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Resultados da Análise</h3>
              <div className="space-y-3">
                {selectedConsultation.results.map((result: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{result.disease}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.probability >= 70 ? 'bg-red-100 text-red-800' :
                        result.probability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.probability}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Critérios correspondentes:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {result.matching_criteria.map((criteria: string, idx: number) => (
                          <li key={idx}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Histórico de Consultas</h2>
        <p className="text-gray-600 mt-1">Suas consultas diagnósticas anteriores</p>
      </div>

      <div className="divide-y">
        {consultations.map((consultation) => (
          <div
            key={consultation._id}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedConsultation(consultation)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(consultation._creationTime)}
                  </span>
                  {consultation.results.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {consultation.results.length} resultado(s)
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {consultation.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {getSymptomLabel(symptom)}
                    </span>
                  ))}
                  {consultation.symptoms.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{consultation.symptoms.length - 3} mais
                    </span>
                  )}
                </div>

                {consultation.results.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Principal suspeita:</span> {consultation.results[0].disease} ({consultation.results[0].probability}%)
                  </div>
                )}
              </div>
              
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
