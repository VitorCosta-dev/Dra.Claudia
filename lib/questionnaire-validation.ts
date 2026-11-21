import { z } from "zod";

const answerRecordSchema = z.record(
  z.string().regex(/^[a-z0-9_]{1,100}$/),
  z.string().max(4000),
).refine((answers) => Object.keys(answers).length <= 100, "Muitos campos enviados.");

const yesNoKeys = [
  "medical_treatment",
  "medications",
  "medication_allergy",
  "anticoagulants",
  "pregnant",
  "healing_difficulty",
  "infectious_condition",
] as const;

export function validateQuestionnaireAnswers(
  answers: Record<string, string>,
  requiredKeys: readonly string[],
) {
  const parsed = answerRecordSchema.safeParse(answers);
  if (!parsed.success) return "Confira o tamanho e o formato das respostas.";

  if (new Blob([JSON.stringify(answers)]).size > 65_536) {
    return "As respostas ultrapassaram o tamanho permitido.";
  }

  for (const key of requiredKeys) {
    if (!answers[key]?.trim()) return "Responda todos os campos obrigatórios antes de continuar.";
  }
  for (const key of yesNoKeys) {
    if (answers[key] !== "Sim" && answers[key] !== "Não") {
      return "Responda todas as perguntas de segurança com Sim ou Não.";
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(answers.birth_date ?? "")) {
    return "Informe uma data de nascimento válida.";
  }
  if (!/^[0-9+() .-]{8,20}$/.test(answers.phone ?? "")) {
    return "Informe um número de celular válido.";
  }
  return null;
}

