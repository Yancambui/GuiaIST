import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const initializeDiseases = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if diseases are already initialized
    const existingDiseases = await ctx.db.query("diseases").first();
    if (existingDiseases) {
      return "Diseases already initialized";
    }

    const diseases = [
      {
        name: "Sífilis Primária",
        category: "lesoes",
        agent: "Treponema pallidum",
        symptoms: ["lesao_genital", "lesao_indolor"],
        lesion_characteristics: {
          type: ["ulcera", "cancro_duro"],
          location: ["genital", "anal", "oral"],
          pain: false,
          number: ["unica", "multiplas"]
        },
        additional_symptoms: ["linfadenopatia_inguinal"],
        diagnostic_tests: ["VDRL", "FTA-ABS", "campo_escuro"],
        treatment_notes: "Penicilina G benzatina 2.4 milhões UI, IM, dose única",
        complications: ["progressao_sifilis_secundaria", "sifilis_terciaria"]
      },
      
      {
        name: "Herpes Genital (HSV-1/HSV-2)",
        category: "lesoes",
        agent: "Vírus Herpes Simplex tipo 1 ou 2",
        symptoms: ["lesao_genital", "lesao_dolorosa", "vesiculas"],
        lesion_characteristics: {
          type: ["vesiculas", "ulceras_rasas", "crostas"],
          location: ["genital", "anal", "oral"],
          pain: true,
          number: ["multiplas", "agrupadas"]
        },
        additional_symptoms: ["febre", "mal_estar", "disuria", "linfadenopatia"],
        diagnostic_tests: ["PCR", "cultura_viral", "sorologia"],
        treatment_notes: "Aciclovir 400mg VO 3x/dia por 7-10 dias",
        complications: ["recidivas", "transmissao_neonatal", "meningite_aseptica"]
      },

      {
        name: "Clamídia",
        category: "corrimento",
        agent: "Chlamydia trachomatis",
        symptoms: ["corrimento_vaginal", "corrimento_uretral"],
        discharge_characteristics: {
          color: ["amarelado", "esbranquicado"],
          odor: ["sem_odor", "odor_leve"],
          consistency: ["mucoso", "purulento"],
          amount: ["moderado", "abundante"]
        },
        additional_symptoms: ["disuria", "sangramento_pos_coito", "dor_pelvica"],
        diagnostic_tests: ["PCR", "teste_amplificacao_acidos_nucleicos"],
        treatment_notes: "Azitromicina 1g VO dose única ou Doxiciclina 100mg VO 2x/dia por 7 dias",
        complications: ["DIP", "infertilidade", "gravidez_ectopica", "conjuntivite_neonatal"]
      },

      {
        name: "Gonorreia",
        category: "corrimento",
        agent: "Neisseria gonorrhoeae",
        symptoms: ["corrimento_vaginal", "corrimento_uretral", "corrimento_purulento"],
        discharge_characteristics: {
          color: ["amarelo_esverdeado", "amarelo"],
          odor: ["fetido", "forte"],
          consistency: ["purulento", "espesso"],
          amount: ["abundante"]
        },
        additional_symptoms: ["disuria", "urgencia_urinaria", "dor_pelvica"],
        diagnostic_tests: ["cultura", "PCR", "coloracao_gram"],
        treatment_notes: "Ceftriaxona 500mg IM dose única + Azitromicina 1g VO",
        complications: ["DIP", "artrite_gonococcica", "oftalmia_neonatal", "infertilidade"]
      },

      {
        name: "Tricomoníase",
        category: "corrimento",
        agent: "Trichomonas vaginalis",
        symptoms: ["corrimento_vaginal", "corrimento_espumoso"],
        discharge_characteristics: {
          color: ["amarelo_esverdeado", "verde"],
          odor: ["fetido", "forte"],
          consistency: ["espumoso", "bolhoso"],
          amount: ["abundante"]
        },
        additional_symptoms: ["prurido_intenso", "disuria", "dispareunia", "hiperemia_vulvar"],
        diagnostic_tests: ["exame_a_fresco", "cultura", "PCR"],
        treatment_notes: "Metronidazol 2g VO dose única ou 500mg VO 2x/dia por 7 dias",
        complications: ["vaginite_recorrente", "parto_prematuro", "baixo_peso_nascimento"]
      },

      {
        name: "Vaginose Bacteriana",
        category: "corrimento",
        agent: "Gardnerella vaginalis e outras bactérias anaeróbias",
        symptoms: ["corrimento_vaginal", "odor_caracteristico"],
        discharge_characteristics: {
          color: ["acinzentado", "esbranquicado"],
          odor: ["peixe", "amina", "forte_apos_coito"],
          consistency: ["homogeneo", "fluido"],
          amount: ["moderado", "abundante"]
        },
        additional_symptoms: ["prurido_leve", "irritacao_vulvar"],
        diagnostic_tests: ["criterios_amsel", "coloracao_gram", "pH_vaginal"],
        treatment_notes: "Metronidazol 500mg VO 2x/dia por 7 dias ou gel vaginal",
        complications: ["recidivas", "DIP", "parto_prematuro", "infeccoes_pos_cirurgicas"]
      },

      {
        name: "Candidíase Vulvovaginal",
        category: "corrimento",
        agent: "Candida albicans (principalmente)",
        symptoms: ["corrimento_vaginal", "prurido_intenso"],
        discharge_characteristics: {
          color: ["branco", "esbranquicado"],
          odor: ["sem_odor", "adocicado_leve"],
          consistency: ["grumoso", "tipo_queijo_cottage"],
          amount: ["variavel"]
        },
        additional_symptoms: ["prurido_vulvar_intenso", "ardor", "dispareunia", "hiperemia_vulvar"],
        diagnostic_tests: ["exame_a_fresco_KOH", "cultura_fungos", "pH_vaginal"],
        treatment_notes: "Fluconazol 150mg VO dose única ou antifúngicos tópicos",
        complications: ["candidíase_recorrente", "fissuras_vulvares", "infeccao_secundaria"]
      }
    ];

    for (const disease of diseases) {
      await ctx.db.insert("diseases", disease);
    }

    return "Diseases initialized successfully";
  },
});

export const getAllDiseases = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("diseases").collect();
  },
});

export const getDiseasesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diseases")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});
