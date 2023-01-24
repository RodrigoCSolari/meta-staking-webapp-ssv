import { Metrics } from "./getMetrics.types";

export const getMetrics = async (): Promise<Metrics> => {
  const url = "https://validators.narwallets.com/metrics_json";
  const result = await fetch(url);
  const metrics = await result.json();
  return metrics;
};
