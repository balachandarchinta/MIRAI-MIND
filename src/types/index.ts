export interface AnalysisData {
  user1: string;
  user2: string;
  user3_moe: string;
  user3_dense: string;
  comparative: {
    rows: {
      dimension: string;
      t1: string;
      t2: string;
      t3: string;
    }[];
    summary: string;
    evolutionPath: string[];
  };
  simulations: {
    title: string;
    status: string;
    timeline: string;
    focusArea: string;
    predictedOutcome: string;
    primaryRisk: string;
    suggestedIntervention: string;
    aiInterpretation: string;
    severity: string;
  }[];
  predictiveEscalationPath: string[];
  isFallback?: boolean;
}

export interface ModelData {
  id: string;
  name: string;
  type: string;
  target: string;
  capabilities: {
    thinking: string;
    longContext: string;
    image: string;
    video: string;
    multimodal: string;
    functionCalling: string;
    coding: string;
    multilingual: string;
    audio: string;
    scores?: { subject: string; value: number }[];
    benchmarks?: { metric: string; value: number }[];
  };
}
