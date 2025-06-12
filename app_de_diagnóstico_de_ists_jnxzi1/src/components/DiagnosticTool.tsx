import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { DiseaseInfo } from "./DiseaseInfo";

export function DiagnosticTool() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [dischargeInfo, setDischargeInfo] = useState({
    color: "",
    odor: "",
    consistency: "",
    amount: ""
  });
  const [lesionInfo, setLesionInfo] = useState({
    type: "",
    location: "",
    pain: undefined as boolean | undefined,
    number: ""
  });
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const createConsultation = useMutation(api.consultations.createConsultation);
  const initializeDiseases = useMutation(api.diseases.initializeDiseases);
  const diseases = useQuery(api.diseases.getAllDiseases);
  const latestConsultation = useQuery(api.consultations.getLatestConsultation);

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms([...symptoms, symptom]);
    } else {
      setSymptoms(symptoms.filter(s => s !== symptom));
    }
  };

  const handleAdditionalSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setAdditionalSymptoms([...additionalSymptoms, symptom]);
    } else {
      setAdditionalSymptoms(additionalSymptoms.filter(s => s !== symptom));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (symptoms.length === 0) {
      toast.error("Selecione pelo menos um sintoma principal");
      return;
    }

    try {
      const consultationData = {
        symptoms,
        discharge_info: symptoms.some(s => s.includes("corrimento")) ? dischargeInfo : undefined,
        lesion_info: symptoms.some(s => s.includes("lesao")) ? lesionInfo : undefined,
        additional_symptoms: additionalSymptoms,
        notes: notes || undefined
      };

      await createConsultation(consultationData);
      
      toast.success("Análise realizada com sucesso!");
      setShowResults(true);
      
    } catch (error) {
      toast.error("Erro ao processar a consulta");
      console.error(error);
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setDischargeInfo({ color: "", odor: "", consistency: "", amount: "" });
    setLesionInfo({ type: "", location: "", pain: undefined, number: "" });
    setAdditionalSymptoms([]);
    setNotes("");
    setResults([]);
    setShowResults(false);
  };

  // Initialize diseases if not done yet
  if (diseases?.length === 0) {
    initializeDiseases();
  }

  const mainSymptoms = [
    { id: "corrimento_vaginal", label: "Corrimento vaginal" },
    { id: "corrimento_uretral", label: "Corrimento uretral" },
    { id: "corrimento_purulento", label: "Corrimento purulento" },
    { id: "corrimento_espumoso", label: "Corrimento espumoso" },
    { id: "lesao_genital", label: "Lesão genital" },
    { id: "lesao_indolor", label: "Lesão indolor" },
    { id: "lesao_dolorosa", label: "Lesão dolorosa" },
    { id: "vesiculas", label: "Vesículas" },
    { id: "odor_caracteristico", label: "Odor característico" },
    { id: "prurido_intenso", label: "Prurido intenso" }
  ];

  const additionalSymptomsOptions = [
    { id: "disuria", label: "Disúria (dor ao urinar)" },
    { id: "dispareunia", label: "Dispareunia (dor durante relação)" },
    { id: "dor_pelvica", label: "Dor pélvica" },
    { id: "sangramento_pos_coito", label: "Sangramento pós-coito" },
    { id: "febre", label: "Febre" },
    { id: "mal_estar", label: "Mal-estar geral" },
    { id: "linfadenopatia_inguinal", label: "Linfadenopatia inguinal" },
    { id: "urgencia_urinaria", label: "Urgência urinária" },
    { id: "hiperemia_vulvar", label: "Hiperemia vulvar" },
    { id: "irritacao_vulvar", label: "Irritação vulvar" }
  ];

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Resultados da Análise</h2>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Nova Consulta
            </button>
          </div>
          
          <div className="space-y-4">
            {latestConsultation?.results && latestConsultation.results.length > 0 ? (
              latestConsultation.results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{result.disease}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.probability >= 70 ? 'bg-red-100 text-red-800' :
                      result.probability >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {result.probability}% compatibilidade
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
                  
                  <DiseaseInfo diseaseName={result.disease} />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma correspondência encontrada com os sintomas informados.
              </p>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Esta ferramenta é apenas um auxílio ao diagnóstico. 
              Sempre considere o quadro clínico completo, exames complementares e diretrizes 
              clínicas atualizadas para o diagnóstico definitivo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Nova Consulta Diagnóstica</h2>
        <p className="text-gray-600 mt-1">Selecione os sintomas observados para análise</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Main Symptoms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sintomas Principais</h3>
          <div className="grid grid-cols-2 gap-3">
            {mainSymptoms.map((symptom) => (
              <label key={symptom.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={symptoms.includes(symptom.id)}
                  onChange={(e) => handleSymptomChange(symptom.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Discharge Characteristics */}
        {symptoms.some(s => s.includes("corrimento")) && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Características do Corrimento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                <select
                  value={dischargeInfo.color}
                  onChange={(e) => setDischargeInfo({...dischargeInfo, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="branco">Branco</option>
                  <option value="esbranquicado">Esbranquiçado</option>
                  <option value="amarelado">Amarelado</option>
                  <option value="amarelo">Amarelo</option>
                  <option value="amarelo_esverdeado">Amarelo-esverdeado</option>
                  <option value="verde">Verde</option>
                  <option value="acinzentado">Acinzentado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odor</label>
                <select
                  value={dischargeInfo.odor}
                  onChange={(e) => setDischargeInfo({...dischargeInfo, odor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="sem_odor">Sem odor</option>
                  <option value="odor_leve">Odor leve</option>
                  <option value="fetido">Fétido</option>
                  <option value="forte">Forte</option>
                  <option value="peixe">Odor de peixe</option>
                  <option value="amina">Odor de amina</option>
                  <option value="adocicado_leve">Adocicado leve</option>
                  <option value="forte_apos_coito">Forte após coito</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consistência</label>
                <select
                  value={dischargeInfo.consistency}
                  onChange={(e) => setDischargeInfo({...dischargeInfo, consistency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="mucoso">Mucoso</option>
                  <option value="purulento">Purulento</option>
                  <option value="espesso">Espesso</option>
                  <option value="espumoso">Espumoso</option>
                  <option value="bolhoso">Bolhoso</option>
                  <option value="homogeneo">Homogêneo</option>
                  <option value="fluido">Fluido</option>
                  <option value="grumoso">Grumoso</option>
                  <option value="tipo_queijo_cottage">Tipo queijo cottage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <select
                  value={dischargeInfo.amount}
                  onChange={(e) => setDischargeInfo({...dischargeInfo, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="escasso">Escasso</option>
                  <option value="moderado">Moderado</option>
                  <option value="abundante">Abundante</option>
                  <option value="variavel">Variável</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Lesion Characteristics */}
        {symptoms.some(s => s.includes("lesao") || s.includes("vesiculas")) && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Características das Lesões</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={lesionInfo.type}
                  onChange={(e) => setLesionInfo({...lesionInfo, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="ulcera">Úlcera</option>
                  <option value="cancro_duro">Cancro duro</option>
                  <option value="vesiculas">Vesículas</option>
                  <option value="ulceras_rasas">Úlceras rasas</option>
                  <option value="crostas">Crostas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <select
                  value={lesionInfo.location}
                  onChange={(e) => setLesionInfo({...lesionInfo, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="genital">Genital</option>
                  <option value="anal">Anal</option>
                  <option value="oral">Oral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dor</label>
                <select
                  value={lesionInfo.pain === undefined ? "" : lesionInfo.pain.toString()}
                  onChange={(e) => setLesionInfo({...lesionInfo, pain: e.target.value === "" ? undefined : e.target.value === "true"})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="true">Dolorosa</option>
                  <option value="false">Indolor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <select
                  value={lesionInfo.number}
                  onChange={(e) => setLesionInfo({...lesionInfo, number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="unica">Única</option>
                  <option value="multiplas">Múltiplas</option>
                  <option value="agrupadas">Agrupadas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Additional Symptoms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sintomas Adicionais</h3>
          <div className="grid grid-cols-2 gap-3">
            {additionalSymptomsOptions.map((symptom) => (
              <label key={symptom.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={additionalSymptoms.includes(symptom.id)}
                  onChange={(e) => handleAdditionalSymptomChange(symptom.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações Adicionais (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva outros achados relevantes..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Analisar Sintomas
          </button>
        </div>
      </form>
    </div>
  );
}
