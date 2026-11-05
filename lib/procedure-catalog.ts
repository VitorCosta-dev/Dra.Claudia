export type ProcedureCategory = "Facial" | "Corporal" | "Capilar" | "Tecnologias";

export type ProcedureCatalogItem = {
  id: string;
  name: string;
  category: ProcedureCategory;
  summary: string;
  accent: string;
  questions: readonly (readonly [key: string, label: string, detail?: string])[];
};

const facialQuestions = [
  ["facial_previous", "Já realizou algum procedimento facial anteriormente?", "Qual e quando?"],
  ["facial_product_reaction", "Já apresentou reação a cosméticos, anestésicos ou produtos injetáveis?", "Descreva"],
  ["facial_active_lesion", "Possui lesão, inflamação ou infecção ativa na área a tratar?", "Informe a região"],
] as const;

const injectableQuestions = [
  ...facialQuestions,
  ["injectable_anticoagulants", "Usa anticoagulante, anti-inflamatório ou medicamento que favoreça sangramentos?", "Qual?"],
  ["injectable_filler", "Possui produto permanente ou preenchimento prévio na área?", "Produto, região e data"],
] as const;

const corporalQuestions = [
  ["body_previous", "Já realizou tratamento corporal anteriormente?", "Qual, região e data?"],
  ["body_goal", "Qual região deseja tratar?", "Informe também seu principal objetivo"],
  ["body_circulation", "Possui varizes, trombose ou alteração circulatória?", "Descreva"],
  ["body_sensitivity", "Possui alteração de sensibilidade na região?", "Descreva"],
] as const;

const capillaryQuestions = [
  ["hair_complaint", "Qual é a principal queixa capilar?", "Informe há quanto tempo percebe a alteração"],
  ["hair_diagnosis", "Possui diagnóstico capilar ou dermatológico?", "Qual?"],
  ["hair_chemical", "Realiza química, coloração ou outro tratamento no cabelo?", "Qual e com que frequência?"],
  ["hair_medication", "Utiliza medicamento ou suplemento para queda capilar?", "Qual?"],
] as const;

export const procedureCatalog: ProcedureCatalogItem[] = [
  { id: "toxina-botulinica-a", name: "Toxina Botulínica", category: "Facial", summary: "Suavização de linhas de expressão após avaliação individual.", accent: "TB", questions: injectableQuestions },
  { id: "preenchimento-facial", name: "Preenchimento Facial", category: "Facial", summary: "Reposição de volume e harmonização de áreas faciais.", accent: "PF", questions: injectableQuestions },
  { id: "preenchimento-labial", name: "Preenchimento Labial", category: "Facial", summary: "Contorno, hidratação e volume labial planejados individualmente.", accent: "PL", questions: injectableQuestions },
  { id: "bioestimulador-colageno", name: "Bioestimulador de Colágeno", category: "Facial", summary: "Estímulo gradual da produção natural de colágeno.", accent: "BC", questions: injectableQuestions },
  { id: "skinbooster", name: "Skinbooster", category: "Facial", summary: "Tratamento injetável voltado à hidratação e qualidade da pele.", accent: "SK", questions: injectableQuestions },
  { id: "harmonizacao-full-face", name: "Harmonização Facial Full Face", category: "Facial", summary: "Planejamento facial integrado, respeitando proporções e necessidades individuais.", accent: "HF", questions: injectableQuestions },
  { id: "limpeza-de-pele", name: "Limpeza de Pele", category: "Facial", summary: "Higienização profunda e cuidados personalizados para a pele.", accent: "LP", questions: facialQuestions },
  { id: "peeling-quimico", name: "Peeling Químico", category: "Facial", summary: "Renovação controlada para textura, tonalidade e marcas superficiais.", accent: "PQ", questions: facialQuestions },
  { id: "jato-de-plasma", name: "Jato de Plasma", category: "Tecnologias", summary: "Tecnologia para estímulo de renovação e melhora da aparência da pele.", accent: "JP", questions: facialQuestions },
  { id: "ultrassom-micro-macrofocado", name: "Ultrassom Micro e Macrofocado", category: "Tecnologias", summary: "Tecnologia de ultrassom aplicada conforme a profundidade e área tratada.", accent: "UM", questions: [...facialQuestions, ...corporalQuestions] },
  { id: "remocao-de-sinais", name: "Remoção de Sinais", category: "Facial", summary: "Avaliação e remoção estética de sinais elegíveis para o procedimento.", accent: "RS", questions: facialQuestions },
  { id: "laser-lavieen", name: "Laser Lavieen", category: "Tecnologias", summary: "Laser para renovação, uniformidade e melhora global da pele.", accent: "LV", questions: facialQuestions },
  { id: "lipoenzimatica", name: "Lipoenzimática", category: "Corporal", summary: "Aplicação direcionada para gordura localizada após avaliação corporal.", accent: "LE", questions: corporalQuestions },
  { id: "intradermoterapia-facial", name: "Intradermoterapia Facial", category: "Facial", summary: "Aplicação intradérmica de ativos selecionados para o objetivo facial.", accent: "IF", questions: injectableQuestions },
  { id: "intradermoterapia-corporal", name: "Intradermoterapia Corporal", category: "Corporal", summary: "Aplicação intradérmica de ativos conforme a avaliação corporal.", accent: "IC", questions: corporalQuestions },
  { id: "eletroterapia-estetica", name: "Eletroterapia Estética", category: "Tecnologias", summary: "Recursos elétricos selecionados para objetivos faciais ou corporais.", accent: "EE", questions: corporalQuestions },
  { id: "microagulhamento", name: "Microagulhamento", category: "Facial", summary: "Microperfurações controladas para estímulo de renovação da pele.", accent: "MA", questions: facialQuestions },
  { id: "peim", name: "PEIM — Microvasos", category: "Corporal", summary: "Procedimento estético injetável para microvasos selecionados.", accent: "PE", questions: corporalQuestions },
  { id: "depilacao-a-laser", name: "Depilação a Laser", category: "Tecnologias", summary: "Redução progressiva dos pelos com parâmetros individualizados.", accent: "DL", questions: [...facialQuestions, ["laser_sun", "Houve exposição solar recente na área?", "Informe quando"], ["laser_hair_removal", "Usou cera, pinça ou outro método de arrancamento recentemente?", "Qual e quando?"]] },
  { id: "criolipolise", name: "Criolipólise", category: "Corporal", summary: "Resfriamento controlado para redução de gordura localizada.", accent: "CR", questions: corporalQuestions },
  { id: "hidrolipoclasia", name: "Hidrolipoclasia", category: "Corporal", summary: "Procedimento corporal invasivo indicado somente após avaliação clínica.", accent: "HL", questions: corporalQuestions },
  { id: "terapia-capilar", name: "Terapia Capilar", category: "Capilar", summary: "Avaliação do couro cabeludo e plano de cuidado capilar individualizado.", accent: "TC", questions: capillaryQuestions },
];

export const procedureById = Object.fromEntries(procedureCatalog.map((item) => [item.id, item]));

export const procedureCategories = ["Todos", "Facial", "Corporal", "Capilar", "Tecnologias"] as const;
