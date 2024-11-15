export type JsonObject = Record<string, unknown>;

export function isJsonObject(data: unknown): data is JsonObject {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
