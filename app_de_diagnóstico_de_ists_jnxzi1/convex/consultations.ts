import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createConsultation = mutation({
  args: {
    symptoms: v.array(v.string()),
    discharge_info: v.optional(v.object({
      color: v.optional(v.string()),
      odor: v.optional(v.string()),
      consistency: v.optional(v.string()),
      amount: v.optional(v.string())
    })),
    lesion_info: v.optional(v.object({
      type: v.optional(v.string()),
      location: v.optional(v.string()),
      pain: v.optional(v.boolean()),
      number: v.optional(v.string())
    })),
    additional_symptoms: v.array(v.string()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Get all diseases for analysis
    const diseases = await ctx.db.query("diseases").collect();
    
    // Analyze symptoms and generate results
    const results = analyzeSymptomsForDiseases(args, diseases);

    const consultationId = await ctx.db.insert("consultations", {
      userId,
      symptoms: args.symptoms,
      discharge_info: args.discharge_info,
      lesion_info: args.lesion_info,
      additional_symptoms: args.additional_symptoms,
      results,
      notes: args.notes
    });

    return consultationId;
  },
});

export const getUserConsultations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("consultations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const getLatestConsultation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("consultations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});

export const getConsultation = query({
  args: { consultationId: v.id("consultations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation || consultation.userId !== userId) {
      throw new Error("Consultation not found or access denied");
    }

    return consultation;
  },
});

function analyzeSymptomsForDiseases(consultation: any, diseases: any[]) {
  const results = [];

  for (const disease of diseases) {
    let score = 0;
    let maxScore = 0;
    const matchingCriteria = [];

    // Check main symptoms
    for (const symptom of disease.symptoms) {
      maxScore += 3;
      if (consultation.symptoms.includes(symptom)) {
        score += 3;
        matchingCriteria.push(`Sintoma: ${symptom}`);
      }
    }

    // Check discharge characteristics if applicable
    if (disease.discharge_characteristics && consultation.discharge_info) {
      const discharge = disease.discharge_characteristics;
      const patientDischarge = consultation.discharge_info;

      if (discharge.color && patientDischarge.color) {
        maxScore += 2;
        if (discharge.color.includes(patientDischarge.color)) {
          score += 2;
          matchingCriteria.push(`Cor do corrimento: ${patientDischarge.color}`);
        }
      }

      if (discharge.odor && patientDischarge.odor) {
        maxScore += 2;
        if (discharge.odor.includes(patientDischarge.odor)) {
          score += 2;
          matchingCriteria.push(`Odor: ${patientDischarge.odor}`);
        }
      }

      if (discharge.consistency && patientDischarge.consistency) {
        maxScore += 2;
        if (discharge.consistency.includes(patientDischarge.consistency)) {
          score += 2;
          matchingCriteria.push(`Consistência: ${patientDischarge.consistency}`);
        }
      }
    }

    // Check lesion characteristics if applicable
    if (disease.lesion_characteristics && consultation.lesion_info) {
      const lesion = disease.lesion_characteristics;
      const patientLesion = consultation.lesion_info;

      if (lesion.type && patientLesion.type) {
        maxScore += 2;
        if (lesion.type.includes(patientLesion.type)) {
          score += 2;
          matchingCriteria.push(`Tipo de lesão: ${patientLesion.type}`);
        }
      }

      if (lesion.pain !== undefined && patientLesion.pain !== undefined) {
        maxScore += 2;
        if (lesion.pain === patientLesion.pain) {
          score += 2;
          matchingCriteria.push(`Dor: ${patientLesion.pain ? 'presente' : 'ausente'}`);
        }
      }

      if (lesion.location && patientLesion.location) {
        maxScore += 1;
        if (lesion.location.includes(patientLesion.location)) {
          score += 1;
          matchingCriteria.push(`Localização: ${patientLesion.location}`);
        }
      }
    }

    // Check additional symptoms
    for (const additionalSymptom of disease.additional_symptoms) {
      maxScore += 1;
      if (consultation.additional_symptoms.includes(additionalSymptom)) {
        score += 1;
        matchingCriteria.push(`Sintoma adicional: ${additionalSymptom}`);
      }
    }

    // Calculate probability
    const probability = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    if (probability > 0) {
      results.push({
        disease: disease.name,
        probability,
        matching_criteria: matchingCriteria
      });
    }
  }

  // Sort by probability (highest first)
  return results.sort((a, b) => b.probability - a.probability);
}
