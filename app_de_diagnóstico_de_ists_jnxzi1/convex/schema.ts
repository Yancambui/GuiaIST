import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  diseases: defineTable({
    name: v.string(),
    category: v.string(), // "corrimento" ou "lesoes"
    agent: v.string(),
    symptoms: v.array(v.string()),
    discharge_characteristics: v.optional(v.object({
      color: v.array(v.string()),
      odor: v.array(v.string()),
      consistency: v.array(v.string()),
      amount: v.array(v.string())
    })),
    lesion_characteristics: v.optional(v.object({
      type: v.array(v.string()),
      location: v.array(v.string()),
      pain: v.boolean(),
      number: v.array(v.string())
    })),
    additional_symptoms: v.array(v.string()),
    diagnostic_tests: v.array(v.string()),
    treatment_notes: v.string(),
    complications: v.array(v.string())
  }),
  
  consultations: defineTable({
    userId: v.id("users"),
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
    results: v.array(v.object({
      disease: v.string(),
      probability: v.number(),
      matching_criteria: v.array(v.string())
    })),
    notes: v.optional(v.string())
  }).index("by_user", ["userId"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
