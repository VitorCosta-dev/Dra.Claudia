export const QUESTIONNAIRE_VERSION = "historico-clinico-v1";

export const yesNoQuestions = [
  ["medical_treatment", "Atualmente está sob tratamento médico?", "Qual o motivo?"],
  ["medications", "Está tomando algum medicamento (anti-inflamatório, antibiótico, corticoide etc.)?", "Qual(is)?"],
  ["blood_donor", "É doador(a) de sangue?", "Quando foi a última doação?"],
  ["medication_allergy", "Tem alergia a algum medicamento?", "Qual(is)?"],
  ["other_allergy", "Possui alguma outra alergia?", "Qual(is)?"],
  ["recent_vaccine", "Tomou alguma vacina nos últimos 30 dias?", "Qual e quando?"],
  ["anticoagulants", "Está em uso de anticoagulante (AAS, aspirina ou outros)?", "Qual(is)?"],
  ["migraine", "Costuma ter crises de enxaqueca?", "Descreva, se necessário"],
  ["pacemaker", "É portador(a) de marca-passo?", ""],
  ["blood_pressure", "Tem problemas de pressão arterial?", "Informe se é baixa/alta e se está compensada"],
  ["injectable_drugs", "Faz uso de drogas endovenosas?", "Qual(is)?"],
  ["dental_anesthesia", "Já tomou anestesia em tratamento odontológico?", ""],
  ["anesthesia_reaction", "Já passou mal com anestesia odontológica?", "O que sentiu?"],
  ["smoker", "Fuma?", "Frequência"],
  ["alcohol", "Consome bebidas alcoólicas frequentemente?", "Frequência"],
  ["antidepressants", "Faz uso de antidepressivos ou ansiolíticos?", "Qual(is)?"],
  ["pregnant", "Está grávida ou com suspeita de gestação?", ""],
  ["botox_or_filler", "Já realizou preenchimento facial e/ou aplicação de toxina botulínica?", "Qual procedimento e quando foi a última vez?"],
  ["hormones", "Utiliza anticoncepcionais, testosterona ou análogos?", "Qual(is)?"],
  ["skin_acids", "Usa ou já usou ácidos na pele?", "Qual(is)?"],
  ["daily_sunscreen", "Utiliza protetor solar diariamente?", "Informe a frequência"],
  ["healing_difficulty", "Possui dificuldade de cicatrização ou tendência à formação de queloide?", "Detalhes"],
  ["sugar_habit", "Tem hábito frequente de consumir açúcar ou doces?", ""],
  ["bruises", "Apresenta facilidade em formar hematomas?", ""],
  ["skincare", "Realiza cuidados estéticos diários (skin care)?", "Quais?"],
  ["roaccutane", "Fez uso de Roacutan nos últimos seis meses?", "Quando encerrou?"],
  ["herpes", "Tem ou já teve herpes?", "Local e última ocorrência"],
  ["esthetic_treatment", "Já realizou algum tratamento estético ou dermatológico?", "Qual(is)?"],
  ["water_intake", "Ingere no mínimo 2 litros de água por dia?", ""],
  ["photo_authorization", "Autoriza a divulgação de fotos de antes e depois do tratamento?", ""],
] as const;

export const pathologyOptions = [
  "Tireoide", "Diabetes", "Cardiopatia", "Psoríase", "Dermatite", "Lúpus",
  "Osteoporose", "Vitiligo", "Epilepsia", "Doença autoimune",
  "Doença infectocontagiosa", "Intolerância à lactose", "Doença metabólica",
  "Doença imunossupressora", "Alergia à lactose", "Bronquite ou asma",
  "Reumatismo ou febre reumática", "Anemia", "Portador(a) de marca-passo",
  "Doença renal", "Doença hepática", "Tuberculose", "Disfunção hormonal", "Estresse",
] as const;

export const questionLabels = Object.fromEntries([
  ["treatment_expectation", "O que espera do tratamento?"],
  ["birth_date", "Data de nascimento"],
  ["phone", "Celular"],
  ["address", "Endereço"],
  ["neighborhood", "Bairro"],
  ...yesNoQuestions.map(([key, label]) => [key, label]),
  ["pathologies", "Patologias existentes"],
  ["other_health_problems", "Outros problemas de saúde"],
  ["blood_type", "Tipo sanguíneo"],
]);

