import type { ConditionConfig } from "@/lib/blocks/core/config-types"
import { getProperty } from "dot-prop"

export function evaluateCondition(
  condition: ConditionConfig,
  values: Record<string, unknown>
): boolean {
  const fieldValue = getProperty(values, condition.field) as unknown

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value

    case "not_equals":
      return fieldValue !== condition.value

    case "contains":
      if (typeof fieldValue === "string" && typeof condition.value === "string") {
        return fieldValue.includes(condition.value)
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value)
      }
      return false

    case "exists":
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== ""

    case "greater_than":
      return Number(fieldValue) > Number(condition.value)

    case "less_than":
      return Number(fieldValue) < Number(condition.value)

    default:
      console.warn(`Unknown condition operator: ${condition.operator}`)
      return true
  }
}

export function evaluateConditions(
  conditions: ConditionConfig[],
  values: Record<string, any>,
  operator: "and" | "or" = "and"
): boolean {
  if (conditions.length === 0) return true

  if (operator === "and") {
    return conditions.every((condition) => evaluateCondition(condition, values))
  } else {
    return conditions.some((condition) => evaluateCondition(condition, values))
  }
}
