-- Termos oficiais transcritos do documento clínico fornecido pela Dra. Claudia.
-- O PDF original permanece fora do repositório e não é publicado pelo site.
-- Fonte conferida em 2026-11-10. Laser Lavieen e Terapia Capilar permanecem
-- sem termo ativo porque o documento não contém TCLE específico para esses procedimentos.

begin;

update public.procedure_terms
set active = false
where procedure_id in (
  'toxina-botulinica-a',
  'preenchimento-facial',
  'preenchimento-labial',
  'bioestimulador-colageno',
  'skinbooster',
  'harmonizacao-full-face',
  'limpeza-de-pele',
  'peeling-quimico',
  'jato-de-plasma',
  'remocao-de-sinais',
  'ultrassom-micro-macrofocado',
  'lipoenzimatica',
  'intradermoterapia-facial',
  'intradermoterapia-corporal',
  'eletroterapia-estetica',
  'microagulhamento',
  'peim',
  'depilacao-a-laser',
  'criolipolise',
  'hidrolipoclasia',
  'laser-lavieen',
  'terapia-capilar'
);

insert into public.procedure_terms (procedure_id, title, version, content, active)
values
(
  'toxina-botulinica-a',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — TOXINA BOTULÍNICA TIPO A',
  'toxina-botulinica-a-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
A toxina botulínica do tipo A (TBA) é uma toxina produzida por uma bactéria chamada Clostridium botulinum. É a mesma bactéria
causadora da doença botulismo, mas a toxina botulínica industrializada é purificada e utilizada em pequenas doses que não causam a
doença.
As toxinas botulínicas industrializadas têm pequenas diferenças entre si e recebem subnomes como: OnabotulinumtoxinA (Botox®),
AbobotulinumtoxinA(Dysport®), RimabotulinumtoxinB (Myobloc® - não disponível no Brasil), IncobotulinumtoxinA (Xeomin®). É
importante destacar que a toxina possui subtipos como A, B, C, sendo que a utilizada na medicina e biomedicina é a do tipo A.
A toxina promove o efeito tensor sob a pele, e seu o uso estético se dá, em geral, para suavizar rugas e linhas de expressão na região da
face. Entre as linhas tratadas estão as rugas da testa, a glabela (espaço entre as sobrancelhas), os pés de galinha (rugas que se formam na
região dos olhos), sorriso gengival e arqueamento de sobrancelhas.
ORIENTAÇÕES E CUIDADOS PÓS PROCEDIMENTO TOXINA BOTULÍNICA TIPO A:
As complicações mais frequentes são:
•Sensação de corpo estranho, coceira, inchaço, vermelhidão e equimoses. Na ocorrência de qualquer complicação mais grave, informe
imediatamente ao profissional.
•A resposta ao tratamento é individual. Não é possível garantir um percentual de melhora.
•Após o procedimento, pelo período de 24 (vinte e quatro) horas não é permitido pegar sol e tampouco massagear o local de aplicação.
•Sensações como dores de cabeça ou dores locais também podem ocorrer após a aplicação da toxina botulínica, devido a tensão ocorrida
durante a realização do procedimento, desaparecendo em no máximo 24 horas. Evitar a ingestão de medicamentos para dores de cabeça
e/ou relaxantes musculares.
•Poderão ser necessárias mais de uma aplicação, que será realizada no retorno agendado no prazo de 15 (quinze) a 21 (vinte e um) dias da
primeira aplicação.
•A duração dos resultados do procedimento com a toxina botulínica é variável, dependendo do metabolismo e hábitos de cada cliente,
com duração média do efeito entre 3 (três) meses a 6 (seis) meses.
•Níveis altos de hormônios masculinos (testosterona) e uso de antiflamatorios e antibióticos antes 7 dias da aplicação e 15 dias após
podem afetar no efeito da toxina botulínica.
•Interferências no efeito por causa das vacinas contra o COVID, podendo diminuição do efeito.
Clientes em tratamento com antibióticos do tipo espectinomicina ou amino glicosídeos e que possuem enfermidades neuromusculares,
imunológicas e coagulopatias (ou ainda pessoas que utilizem anticoagulantes, amino glicosídeos e drogas que interfiram na transmissão
neuromuscular), grávidas ou em fase de amamentação, com infecção ou sinais de inflamação nos locais de aplicação não devem ser
submetidos ao tratamento com a toxina botulínica tipo A.
A toxina botulínica tipo A, assim como todo medicamento, é contraindicado para clientes que apresentam alergia a albumina (ovo) a
qualquer componente de sua formulação.
Hematomas (roxo) podem ocorrer naturalmente pela própria introdução da agulha que, em seu trajeto, poderá perfurar vasos sanguíneos
e promover pequenos e autolimitados sangramentos locais.
TERMO DE CONSENTIMENTO:
Eu, ___________________________________________________, inscrito no CPF nº. __________________ autorizo o (a) profissional
Dra._____________________________________ (a) no Concelho Regional de_______________________ N° _________ a realizar o procedimento
supramencionado. O profissional explicou-me a utilização do tratamento, compreendi e foram-me dadas oportunidades suficientes para
tirar quaisquer dúvidas e/ou preocupações, que confirmo terem sido satisfatoriamente abordadas.
Declaro por este meio que respondi rigorosamente a todas as perguntas sobre a minha saúde e quaisquer problemas médicos que me
afetam. Confirmo que o meu estado físico e mental é saudável e conducente ao prosseguimento do tratamento e que sou um(a)
candidato(a) adequado(a) para a realização do procedimento. Aceito inteiramente que o meu pedido para realizar este tratamento é
voluntário. Compreendo que a finalidade do tratamento é melhorar a aparência e que há a possibilidade de os resultados não
corresponderem às minhas expectativas. Estou ciente que podem ocorrer complicações gerais no procedimento como hiperpigmentação
pós inflamatória, eritema, edema, infecção ou reação alérgica, ptose da região.
Foi explicado que os resultados do tratamento não são permanentes e também compreendo que o tratamento poderá me afetar de
forma diferente e que os resultados poderão durar mais ou menos tempo do que o normal de acordo com a resposta do meu organismo
e minha colaboração como paciente pós procedimento.
Reservo-me o direito de revogar minha assinatura abaixo apenas antes que o procedimento se realize.
Eu, _________________________________________, DECLARO que expliquei detalhadamente para o cliente e/ou responsável, o propósito, os
benefícios, os riscos e as alternativas para o procedimento acima descrito, bem como que existiu tempo hábil para o cliente esclarecer
suas dúvidas ou procurar outra opinião profissional.
_____________________________,______/ ______ de 20_____.

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'preenchimento-facial',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — PREENCHEDORES FACIAIS',
  'preenchimento-facial-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PREENCHEDORES FACIAIS

O Ácido Hialurônico (substância utilizada para o preenchimento injetável) é uma substância naturalmente
presente no organismo. Procedimento realizado sob anestesia local injetável ou gel anestésico. Com efeito
imediato e sem risco de efeito vacina (quando o produto não é eficaz).

CUIDADOS
Compressas geladas para diminuir o processo inflamatório (por até 24 horas), não massagear área tratada dentro
de 12 horas não maquiar, dentro de 48 horas não realizar exercícios físicos e dormir com a cabeça mais elevada
que o corpo, evitando comprimir área tratada, dentro de 2 semanas é necessário evitar exposição prolongada ao
sol e raios infravermelhos, exposição à temperaturas muito baixas e saunas ou salas de vapor.
RISCOS
Pode ocorrer perda da expressão facial, linhas e rugas, queda ou flacidez (ptose) da boca, sobrancelha e/ou
pálpebra, cegueira, equimose, edema, dor, hematoma, sangramento, dor de cabeça, necrose, vermelhidão no
local da injeção, reações alérgicas, infecções, herpes, parada cardíaca, dormência, formigamento, paralisia ou
paralisia parcial, hipersensibilidade, cicatrizes. Pode haver riscos não especificados e riscos desconhecidos a
longo prazo.
Pode ocorrer disfagia (dificuldade de deglutição), disfonia (dificuldade de falar), fraqueza, dispneia (dificuldade
de respirar). Assimetria pode ocorrer durante 7 dias ou mais. Em pacientes de hipo ou hipertireodismo o material
pode ser absorvido mais rapidamente.

Estou ciente de que durante o procedimento outras conjunções podem ocorrer e necessitam ser tratadas, e
portanto, autorizo qualquer procedimento adicional. Estou ciente de que o tratamento pode ser sem efeito ou
duração menor que o planejado. Para obter um material adicional, será necessário um novo pagamento. Estou
ciente que nenhuma correção pode ser feita antes de 7 dias. Se caso eu desejar, posso escolher interromper o
procedimento em qualquer momento. Eu li, compreendi e concordei com o afirmado acima.
Eu, ___________________________________________________, inscrito (a) RG nº________________________ e no CPF nº_______________________________
autorizo a profissional a realizar o procedimento supramencionado. A profissional explicou-me a utilização do
tratamento, compreendi e foram-me dadas oportunidades suficientes para tirar quaisquer dúvidas e/ou
preocupações, que confirmo terem sido satisfatoriamente abordadas.

Eu, ____________________________________________________________, DECLARO que expliquei detalhadamente para o paciente e/ou
responsável, o propósito, os benefícios, os riscos e as alternativas para o procedimento acima descrito, bem
como que existiu tempo hábil para o cliente esclarecer suas dúvidas ou procurar outra opinião profissional.

_____________________________________________________________________________________________________
Assinatura

____________________, __________ de ____________________________ de ___________.
$official_term$,
  true
),
(
  'preenchimento-labial',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PREENCHIMENTO LABIAL',
  'preenchimento-labial-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PREENCHIMENTO LABIAL
Paciente: ____________________________________________________________________________
RG: _________________________________ CPF: ___________________________________________
Data de Nascimento: _____ /______ /_______ Telefone: _________________________________
Profissional Responsável: ___________________________________________________________
Registro Profissional (CRF/SP): ______________________________________________________
FINALIDADE DO PROCEDIMENTO
O procedimento de preenchimento labial com ácido hialurônico tem por finalidade promover o
aumento de volume, contorno, hidratação e simetria dos lábios, contribuindo para a estética facial e a
harmonia do sorriso, respeitando a anatomia e os limites naturais do rosto.
NATUREZA DO PRODUTO
O produto utilizado é um preenchedor à base de ácido hialurônico, substância biocompatível,
reabsorvível e aprovada pela ANVISA. O produto será aplicado em quantidade compatível com a
indicação estética e com a técnica segura.
ORIENTAÇÕES PRÉ-PROCEDIMENTO
( ) Estou ciente de que não devo utilizar anti-inflamatórios, anticoagulantes, bebidas alcoólicas ou
realizar atividades físicas intensas nas 24h que antecedem o procedimento, salvo orientação expressa do
profissional.
( ) Informei ao profissional qualquer histórico de alergias, doenças autoimunes, herpes labial, gestação
ou uso de medicamentos contínuos.
( ) Estou ciente de que devo informar se realizei procedimentos anteriores na região labial.
RISCOS E EFEITOS ADVERSOS
Estou ciente de que, mesmo com técnica segura, podem ocorrer reações como:
– Edema (inchaço), eritema (vermelhidão), dor leve ou hematomas na região aplicada;
– Formação de nódulos, assimetria temporária ou sensibilidade local;
– Raramente, podem ocorrer reações alérgicas, infecção ou necrose tecidual;
– Eventualmente pode haver necessidade de nova aplicação, ajuste ou remoção com hialuronidase.
RESULTADOS E DURAÇÃO
( ) Fui informado(a) de que o resultado do preenchimento labial é temporário e sua durabilidade
depende de fatores como metabolismo individual, estilo de vida e cuidados pós-procedimento.
( ) Estou ciente de que o resultado final poderá ser observado entre 5 a 15 dias após a aplicação, após a
redução do edema.
CUIDADOS PÓS-PROCEDIMENTO
Comprometo-me a seguir rigorosamente os cuidados pós-procedimento informados, tais como:
– Evitar calor excessivo (sol, sauna, exercícios intensos) por 48h;
– Não manipular a área tratada;
– Evitar uso de maquiagens na região por 24h;
– Retornar para reavaliação no prazo estipulado.
DECLARAÇÕES FINAIS
( ) Li e compreendi todas as informações acima, tive oportunidade de esclarecer minhas dúvidas e estou
de acordo com a realização do procedimento proposto.
( ) Autorizo, se necessário, o uso de imagens do meu procedimento para fins educativos e científicos,
sem divulgação de identidade.
( ) Estou ciente de que os resultados são subjetivos e variam de acordo com o organismo de cada
paciente, e que a estética é uma ciência de aprimoramento e não de exatidão.
Local: _____________________________ Data: ____ /_____ /______
Assinatura do(a) Paciente: ___________________________________________
Assinatura do(a) Profissional Responsável: _____________________________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'bioestimulador-colageno',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — BIOESTIMULADOR DE COLÁGENO',
  'bioestimulador-colageno-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE ESCLARECIDO BIOESTIMULADOR DE COLÁGENO

BIOESTIMULADOR DE COLÁGENO
O bioestimulador de colágeno consiste na aplicação de substâncias como ácido polilático, hidroxiapatita de cálcio ou
policaprolactona, que estimulam a produção natural de colágeno pelo organismo. Trata-se de um procedimento estético
minimamente invasivo indicado para melhora da flacidez, qualidade da pele, contorno facial e corporal.
Os produtos utilizados são regularizados pela ANVISA e aplicados em doses seguras, conforme protocolos técnicos e
normas do Ministério da Saúde. O efeito do bioestimulador ocorre de forma gradual, com resultados progressivos ao longo
das semanas, não sendo imediato.
O tratamento promove melhora da firmeza da pele, estímulo dérmico profundo e efeito rejuvenescedor. As áreas mais
tratadas incluem face, mandíbula, pescoço, colo, braços, abdômen e glúteos.
ORIENTAÇÕES E CUIDADOS PÓS PROCEDIMENTO BIOESTIMULADOR DE COLÁGENO
As complicações mais frequentes são sensação de dor local, inchaço, vermelhidão, hematomas, sensibilidade, prurido ou
pequenos nódulos transitórios. Na ocorrência de qualquer complicação mais grave, o profissional deverá ser comunicado
imediatamente.
A resposta ao tratamento é individual, não sendo possível garantir um percentual exato de melhora.
Após o procedimento, pelo período de 24 horas, não é permitido realizar atividades físicas intensas, exposição solar direta
ou manipulação excessiva da área tratada, salvo orientação profissional.
Em alguns casos, poderá ser necessário realizar massagens locais conforme orientação técnica específica.
Sensações como dor leve ou desconforto podem ocorrer após a aplicação, sendo geralmente autolimitadas.
Poderão ser necessárias mais de uma sessão para atingir o resultado desejado, respeitando o plano de tratamento
individualizado.
A duração dos resultados é variável, dependendo do metabolismo, idade, estilo de vida e cuidados do paciente, podendo
durar em média de 12 a 24 meses.
O uso de medicamentos anti-inflamatórios, imunossupressores ou condições clínicas específicas podem interferir na
resposta ao tratamento.
Pacientes com infecção ativa na área, doenças autoimunes não controladas, distúrbios de coagulação, gestantes, lactantes
ou com hipersensibilidade aos componentes da fórmula não devem realizar o procedimento.
Hematomas podem ocorrer devido à perfuração de pequenos vasos durante a aplicação, sendo geralmente transitórios.
TERMO DE CONSENTIMENTO
Eu, ___________________________________________________, inscrito(a) no CPF nº __________________________, autorizo o(a)
profissional __________________________________________, inscrito(a) no Conselho Regional de __________________ nº __________,
a realizar o procedimento de bioestimulação de colágeno.
Declaro que fui devidamente informado(a) sobre o procedimento, sua finalidade, benefícios, limitações, riscos e possíveis
complicações, tendo compreendido todas as informações prestadas e recebido esclarecimento adequado para todas as
minhas dúvidas.
Declaro que respondi com veracidade todas as informações relacionadas ao meu estado de saúde, incluindo histórico
médico, uso de medicamentos, alergias e condições pré-existentes, assumindo responsabilidade pelas informações
fornecidas.
Confirmo que meu estado físico e mental é compatível com a realização do procedimento e que estou ciente de que os
resultados podem variar de acordo com meu organismo, não sendo garantido resultado específico, caracterizando
obrigação de meio e não de resultado.
Estou ciente de que podem ocorrer efeitos adversos como edema, eritema, dor, hematomas, nódulos, assimetrias, infecção,
reações inflamatórias ou alérgicas, entre outros, sendo devidamente orientado(a) sobre como proceder em caso de
intercorrências.
Compreendo que os resultados não são permanentes e que poderão variar em duração e intensidade conforme resposta
individual e cuidados pós-procedimento.
Declaro que minha decisão é voluntária e que posso revogar este consentimento a qualquer momento antes da realização
do procedimento.
Autorizo o tratamento dos meus dados pessoais e sensíveis para fins de registro clínico e cumprimento das obrigações
legais, conforme a Lei Geral de Proteção de Dados Lei nº 13.709/2018.
Eu, _________________________________________, DECLARO que expliquei detalhadamente ao paciente o propósito, os
benefícios, os riscos e as alternativas do procedimento, bem como disponibilizei tempo suficiente para esclarecimento de
dúvidas.
_______________________________, ______ de __________________ de 20
Assinatura do paciente __________________________________________
Assinatura do profissional __________________________________________
$official_term$,
  true
),
(
  'skinbooster',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — SKINBOOSTER',
  'skinbooster-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
PROCEDIMENTO: SKINBOOSTER

Eu, ____________________________________________________________,
nacionalidade ___________________, estado civil ________________, profissão ___________________, portador(a)
do RG nº ___________________________ e CPF nº ___________________________, residente e domiciliado(a) à
___________________________________________,
DECLARO, PARA OS DEVIDOS FINS LEGAIS, que fui devidamente informado(a) pelo(a) profissional
responsável sobre a natureza, objetivos, riscos, benefícios e cuidados referentes ao procedimento estético
denominado Skinbooster.
1. ESCLARECIMENTOS SOBRE O PROCEDIMENTO
O Skinbooster é realizado através da aplicação de ácido hialurônico injetável em pequenas quantidades,
promovendo hidratação profunda, melhora da elasticidade, viço e qualidade da pele.
O número de sessões necessárias será definido pelo profissional de acordo com a avaliação clínica
individual.
O tratamento tem caráter estético, com resultados variáveis conforme a resposta do organismo, estilo de
vida e adesão aos cuidados recomendados.
2. POSSÍVEIS RISCOS E INTERCORRÊNCIAS
Dor, sensibilidade, vermelhidão ou pequenos hematomas nos pontos de aplicação.
Inchaço leve e transitório.
Reações alérgicas ou inflamatórias (raras).
Formação de nódulos ou irregularidades (geralmente reversíveis com acompanhamento profissional).
Resultados estéticos insatisfatórios em alguns casos, sendo necessário mais de uma sessão.
3. CUIDADOS PÓS-PROCEDIMENTO
Não massagear, coçar ou manipular a região tratada sem orientação profissional.
Evitar exposição solar, calor excessivo, saunas, piscinas e atividade física intensa por, no mínimo, 48 horas.
Utilizar protetor solar FPS ≥ 50 diariamente.
Manter a hidratação cutânea conforme recomendação do profissional.
Retornar para reavaliação nas datas estabelecidas.
4. DECLARAÇÃO DO PACIENTE
Declaro que:
Fui informado(a) de forma clara, detalhada e compreensível sobre os objetivos, técnicas, riscos, benefícios
e cuidados do procedimento.
Estou ciente de que os resultados variam conforme características individuais e não há garantia de efeito
definitivo.
Informei corretamente meu histórico de saúde, alergias, uso de medicamentos e procedimentos prévios.
Estou ciente de que este termo possui validade jurídica, resguardando tanto a minha segurança como a
responsabilidade técnica do(a) profissional.
Autorizo, de livre e espontânea vontade, a realização do procedimento de Skinbooster.
Local e Data: ___________________________________________
Assinatura do Paciente: __________________________________
Assinatura do Profissional: _______________________________
Carimbo/Identificação do Profissional: _____________________
$official_term$,
  true
),
(
  'harmonizacao-full-face',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — HARMONIZAÇÃO FACIAL FULL FACE',
  'harmonizacao-full-face-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
PROCEDIMENTO: HARMONIZAÇÃO FACIAL – FULL FACE (FEMININA E MASCULINA)

Eu, ________________________________________________________________,
RG: ____________________________ CPF: ____________________________,
declaro que recebi todas as informações referentes ao procedimento de Harmonização
Facial Full Face, compreendendo a sua natureza, objetivos, benefícios e possíveis riscos.
ESCLARECIMENTOS SOBRE O PROCEDIMENTO
O protocolo Full Face é um conjunto de técnicas que pode incluir preenchimento com ácido
hialurônico, bioestimuladores, toxina botulínica, fios de sustentação e outros recursos
adequados à necessidade do paciente.
O objetivo é promover harmonia facial, equilíbrio estético e rejuvenescimento global da face,
respeitando características femininas ou masculinas, conforme avaliação individual.
O número de sessões, técnicas e produtos utilizados dependerá da análise clínica e da
indicação personalizada feita pelo profissional responsável.
POSSÍVEIS REAÇÕES E RISCOS
Vermelhidão, inchaço, dor ou hematomas temporários nos locais de aplicação.
Assimetria transitória ou irregularidades leves, que tendem a melhorar com o tempo ou com
retoques.
Reações alérgicas ou inflamatórias, embora raras.
Risco de complicações como infecção, necrose tecidual ou embolia, ainda que incomuns,
podendo exigir tratamentos complementares.
Resultados variáveis de acordo com características individuais, estilo de vida e cuidados pós-
procedimento.
CUIDADOS PÓS-PROCEDIMENTO
Não massagear, coçar ou manipular a área tratada sem orientação profissional.
Evitar exposição solar, calor excessivo, atividades físicas intensas, saunas e piscinas por pelo
menos 48 horas.
Utilizar protetor solar diariamente.
Seguir corretamente as orientações de cuidados domiciliares indicados pelo profissional.
Retornar para avaliação conforme agendamento estabelecido.
DECLARAÇÃO DO PACIENTE
Declaro que:
Fui informado(a) de forma clara e compreensível sobre o procedimento, seus riscos,
benefícios e alternativas.
Estou ciente de que os resultados variam de pessoa para pessoa e não há garantia de
resultado estético definitivo.
Informei corretamente meu histórico de saúde, uso de medicamentos, alergias e
tratamentos prévios.
Concordo, de livre e espontânea vontade, com a realização do procedimento de
harmonização facial Full Face.
Local e Data: _____________________________________________
Assinatura do Paciente: ____________________________________
Assinatura do Profissional: __________________________________
$official_term$,
  true
),
(
  'limpeza-de-pele',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA LIMPEZA DE PELE',
  'limpeza-de-pele-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA LIMPEZA DE PELE

Eu, ________________________________________, RG nº ____________________,
CPF nº ____________________, residente à ________________________________________,
declaro que fui devidamente informado(a) sobre o procedimento de limpeza de pele,
seus benefícios, cuidados e possíveis reações adversas.
O profissional responsável, __________________________________, Registro Profissional nº
____________, esclareceu todos os detalhes do procedimento, incluindo suas etapas,
produtos utilizados e cuidados pós-procedimento.
1. OBJETIVO DO PROCEDIMENTO
A limpeza de pele tem como finalidade a remoção de impurezas, células mortas,
excesso de oleosidade e comedões (cravos), promovendo uma pele mais saudável e
revitalizada.
2. POSSÍVEIS REAÇÕES ADVERSAS
Vermelhidão e sensibilidade na área tratada.
Pequenos edemas ou descamação nos dias seguintes ao procedimento.
Possibilidade de reações alérgicas a algum produto utilizado, sendo recomendado o
teste de sensibilidade prévio.
3. CUIDADOS PÓS-PROCEDIMENTO
Evitar exposição solar direta nas primeiras 48 horas e utilizar protetor solar adequado.
Não manipular ou espremer a pele para evitar irritações e infecções.
Hidratar a pele conforme orientação do profissional.
Não utilizar produtos abrasivos ou ácidos sem recomendação profissional.
4. CIÊNCIA E CONSENTIMENTO
Estou ciente de que os resultados podem variar de acordo com meu tipo de pele e
hábitos diários. Também compreendo que complicações são raras, mas possíveis, e que
devo seguir todas as recomendações para garantir um melhor resultado.
Declaro que todas as informações foram devidamente esclarecidas, minhas dúvidas
foram sanadas e autorizo a realização do procedimento de limpeza de pele, assumindo
a responsabilidade pelos cuidados indicados.
Por estar de acordo, assino este termo de livre e espontânea vontade.
Paciente
Data: ____/____/____
Responsável Legal (se aplicável)
Data: ____/____/____
Profissional Responsável
Registro: _____________
Data: _____/_____/____

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'peeling-quimico',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PEELING QUÍMICO',
  'peeling-quimico-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PEELING QUÍMICO
Identificação do Paciente:
Nome Completo: __________________________________________CPF: ____________________________ • RG: ____________________________
Data de Nascimento: _____ /_______ /___________Endereço: ________________________________________________
Telefone/WhatsApp: ________________________________
Identificação do Profissional:
Nome: ____________________________________________________Profissão: ______________________________
Registro Profissional: ______________________________________
Finalidade do Procedimento
O peeling químico é um procedimento estético que promove a renovação da pele por meio da aplicação de substâncias químicas
específicas, visando melhorar a textura, uniformizar o tom da pele, atenuar manchas, linhas finas, cicatrizes de acne, entre outras
alterações cutâneas.
Descrição do Procedimento
O procedimento consiste na aplicação tópica de agentes químicos que causam uma esfoliação controlada da epiderme e/ou derme,
promovendo a regeneração celular. A profundidade do peeling (superficial, médio ou profundo) será definida conforme avaliação
prévia e necessidade individual do paciente.
Riscos e Possíveis Complicações
Estou ciente de que o peeling químico pode apresentar efeitos adversos, incluindo, mas não se limitando a:
Ardência, coceira e desconforto temporário
Eritema (vermelhidão) e edema (inchaço)
Descamação intensa e sensação de ressecamento
Hiperpigmentação ou hipopigmentação temporária ou permanente
Infecções, formação de crostas, quelóides ou cicatrizes em casos excepcionais
Reativação de herpes simples (em pacientes predispostos)
Entendo que os riscos serão minimizados com o seguimento rigoroso das orientações pré e pós-procedimento fornecidas.
Cuidados Pós-Procedimento
Estou ciente da importância de:
Evitar exposição solar direta por, no mínimo, 30 dias após o procedimento
Utilizar filtro solar de alto fator (FPS 50 ou superior) diariamente
Manter a pele hidratada conforme instruções do profissional
Não remover a pele descamada manualmente
Informar imediatamente qualquer reação adversa anormal
Contraindicações
Fui informado(a) de que o peeling químico é contraindicado em casos de:
Gravidez ou amamentação
Doenças cutâneas ativas no local do tratamento
Uso recente de isotretinoína oral (Roacutan)
Históricos de quelóides ou cicatrizes hipertróficas

Consentimento
Declaro que:
Recebi informações claras, completas e compreensíveis sobre o procedimento, seus objetivos, etapas, riscos, benefícios e alternativas.
Fui orientado(a) a sanar todas as dúvidas antes da assinatura deste termo.
Estou ciente de que os resultados podem variar de pessoa para pessoa.
Concordo livremente com a realização do peeling químico, isentando o(a) profissional de responsabilidade por eventuais
complicações decorrentes do descumprimento das orientações fornecidas ou de condições pré-existentes não informadas.
Disposições Finais
Este termo é firmado em conformidade com a legislação vigente, respeitando os princípios da ética profissional e os direitos do
consumidor, conforme disposto no Código de Defesa do Consumidor (Lei nº 8.078/1990) e no Código Civil Brasileiro (Lei nº
10.406/2002).

As partes elegem o foro da comarca de ____________________________________ para dirimir quaisquer controvérsias oriundas deste
instrumento, com exclusão de qualquer outro, por mais privilegiado que seja.

Local e Data: _____________________________, ______ /______ /_____

Assinatura do Paciente: ___________________________________________

Assinatura do Profissional: ________________________________________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'jato-de-plasma',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — JATO DE PLASMA',
  'jato-de-plasma-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE) - JATO DE PLASMA
IDENTIFICAÇÃO DO PACIENTE
Nome Completo: __________________________________________
Data de Nascimento: ___/___/____
Documento (RG/CPF): ______________________________________Telefone: ( ) ________________

INFORMAÇÕES SOBRE O PROCEDIMENTO O Jato de Plasma é um procedimento estético
minimamente invasivo que utiliza a ionização dos gases atmosféricos para promover a contração
da pele, estimulando a produção de colágeno e melhorando a aparência de rugas, flacidez,
cicatrizes e outras irregularidades na pele.
POSSÍVEIS EFEITOS COLATERAIS E RISCOS
Vermelhidão, inchaço e sensação de ardência na área tratada.
Formação de crostas ou pequenas lesões na pele, com descamação posterior.
Sensibilidade aumentada na área tratada.
Possibilidade de hiperpigmentação ou hipopigmentação, especialmente sem os devidos
cuidados.
Em casos raros, pode haver infecção, cicatrizes permanentes ou reações adversas.
CUIDADOS PÓS-PROCEDIMENTO
Não remover as crostas, permitindo sua queda natural.
Utilizar protetor solar e evitar exposição solar direta durante a cicatrização.
Manter a pele limpa e hidratada conforme orientação profissional.
Evitar o uso de maquiagem ou produtos irritantes na área tratada nos primeiros dias.
Retorno para avaliação, conforme recomendado pelo profissional.
DECLARAÇÃO DO PACIENTE Eu, _______________________________________________________, declaro
que fui devidamente informado(a) sobre o procedimento de Jato de Plasma, seus benefícios,
riscos e cuidados pós-aplicação. Estou ciente de que os resultados podem variar de acordo com
características individuais e aceito realizar o procedimento por livre e espontânea vontade.
Assinatura do Paciente: ____________________________________ Data: ____/_____/____
Assinatura do Profissional: _______________________________ Registro: ______________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'remocao-de-sinais',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA REMOÇÃO DE SINAIS',
  'remocao-de-sinais-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA REMOÇÃO DE SINAIS

Eu, _________________________________________________________________,
nacionalidade ____________________, estado civil ________________, profissão ___________________,
portador(a) do RG nº __________________________ e CPF nº __________________________,
residente e domiciliado(a) à _________________________________________________________________,
DECLARO, para os devidos fins, que fui devidamente informado(a) sobre o procedimento de remoção de sinais (nevos,
verrugas, acrocórdons, entre outros), suas indicações, técnicas utilizadas, cuidados necessários e possíveis
intercorrências.
1. Sobre o Procedimento:
O procedimento de remoção de sinais pode ser realizado por diferentes técnicas (eletrocauterização, shaving,
crioterapia, entre outras), conforme avaliação do profissional responsável. O objetivo é remover formações benignas da
pele por razões estéticas ou por incômodo local.
Estou ciente de que este procedimento não substitui avaliação médica dermatológica e que qualquer suspeita de
malignidade será referenciada ao especialista competente.
2. Riscos Informados:
Fui informado(a) sobre os possíveis riscos e efeitos colaterais, incluindo:
– Dor leve ou desconforto local;
– Pequeno sangramento;
– Inchaço, vermelhidão ou formação de crosta;
– Cicatriz residual ou hiperpigmentação;
– Risco de infecção, caso os cuidados pós-procedimento não sejam respeitados;
– Recorrência do sinal em alguns casos;
– Formação de queloides em pacientes predispostos.
3. Cuidados Pós-Procedimento:
Comprometo-me a seguir todas as orientações repassadas pelo profissional, incluindo:
– Evitar exposição solar direta;
– Aplicar pomadas cicatrizantes conforme prescrito;
– Manter o local limpo e seco;
– Não remover crostas ou casquinhas formadas espontaneamente;
– Procurar assistência médica se houver sinais de infecção ou complicações.
4. Consentimento e Responsabilidade:
Declaro que todas as minhas dúvidas foram esclarecidas de forma clara e satisfatória, e que compreendo a natureza
eletiva do procedimento.
Autorizo a realização da remoção de sinais conforme avaliação profissional, assumindo plena responsabilidade pelo
cumprimento dos cuidados indicados.
Isento o profissional e o estabelecimento de responsabilidade por intercorrências decorrentes do descumprimento das
recomendações ou de características próprias do meu organismo.
5. Uso de Imagens (opcional):
( ) Autorizo ( ) Não autorizo
o uso de imagens do procedimento para fins educativos, técnicos ou publicitários, sem identificação nominal.
6. Declaração Final:
Estou ciente de que este termo tem validade jurídica e representa minha livre e esclarecida vontade de realizar o
procedimento proposto.
Local: _____________________________
Data: _____ /___ /______
Assinatura do(a) Cliente ou Responsável Legal:
Assinatura do(a) Profissional Responsável:
Nome completo: _______________________________________
CNPJ ou CPF: _______________________________________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'ultrassom-micro-macrofocado',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — ULTRASSOM MICROFOCADO E MACROFOCADO',
  'ultrassom-micro-macrofocado-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE ESCLARECIDO - TCLE
Ultrassom Microfocado e Macrofocado
O presente Termo de Consentimento Informado e Esclarecido, sob a supervisão da(o) profissional infra-assinado(a), tem o objetivo de
cumprir o
dever ético e legal de informar ao paciente de nome _____________________________________________________________ ou seu responsável
quanto aos principais aspectos relacionados ao procedimento supracitado

O espaço a seguir deve ser preenchido pelo(a) paciente ou seu responsável, acompanhado do profissional que irá realizar o
procedimento,
incumbido de informar as características gerais deste.

Eu, __________________________________________________, documento de identificação n.º_____________________ (CPF), após minuciosa
avaliação com o(a) profissional e posterior realização da anamnese, fui devidamente cientificado(a) acerca dos tópicos abaixo.

1. Informações Gerais do Procedimento:

O ultrassom com o aparelho _______________________ consiste em um tratamento de flacidez e gordura localizada, tanta facial como
corporal, que combina a entrega focada de energia nas camadas da pele com uma tecnologia micro e macrofocada, o que possibilita e
facilita o tratamento de
áreas do rosto e do restante do corpo, respectivamente.

O tratamento é indicado para pessoas com 30 anos 1 sessão anual em áreas faciais como medida preventiva. Já para pacientes acima
de 40 anos, pode ser realizado em mais de uma sessão e associado a tratamentos como o ácido poli-l-láctico ou ácido hialurônico,
dependendo do grau de flacidez.

Quanto ao tratamento corporal é indicado para pessoas com grau leve a moderado de flacidez e/ou de gordura localizada, sempre
realizando no mínimo 3 sessões com intervalo de 4 semanas, podendo ser associado a outros tratamentos dependendo da gravidade
do caso.

2. Declarações do Paciente:

DECLARO ter sido suficientemente esclarecido(a) pela profissional a respeito da modalidade de tratamento que será aplicada, de
maneira que
decido, livremente, me submeter ao procedimento indicado.
DECLARO ainda, livre de qualquer coação e constrangimento, para não restar dúvida quanto ao procedimento proposto e a minha
autorização em questão, que sou conhecedor dos meus princípios, indicações, riscos, complicações e resultados, bem como a
profissional forneceu-me as informações referentes a cada um desses itens.

3. Princípios e Indicações:

Estou ciente que os resultados estéticos esperados apresentam uma resposta individual, portanto, poderão não se concretizar em
razão da resposta biológica do meu organismo, variação das minhas condições genéticas, minha anatomia facial e de minha
colaboração, assim como da própria limitação da ciência, sendo certo que a profissional se compromete a utilizar as técnicas e os
materiais adequados à execução do plano de
tratamento proposto e aprovado.

Estou ciente de que, para realizar o procedimento acima especificado, será necessário realizar procedimento anestésico ou outro de
caráter pré- procedimental.

Declaro, ainda, estar ciente que eventuais ausências às consultas e o não atendimento das orientações profissionais prejudicarão o
resultado pretendido.

É de meu conhecimento que devo informar a profissional qualquer alteração em decorrência do procedimento realizado, insatisfações
ou dúvidas sobre o procedimento executado, mantendo meus dados cadastrais sempre atualizados e informando eventuais mudanças
de endereço, telefone.

Afirmo estar plenamente consciente de que o sucesso do procedimento não dependerá somente do trabalho desempenhado pela
profissional, mas também dos meus cuidados pessoais e, sobretudo, das reações do meu organismo e igualmente à possibilidade da
ocorrência de complicações ligadas ao próprio ato do procedimento realizado.

4. Riscos e Complicações

Declaro estar plenamente ciente de que o procedimento a ser realizado, como qualquer procedimento minimamente invasivo, traz a
possibilidade de ocorrência de riscos e complicações, quais são:

a) Riscos gerais: vermelhidão ou inchaço no local em que o ultrassom foi aplicado, que duram por algumas horas ou poucos dias.
Podem também aparecer pontinho arroxeados que indicam microsangramentos na pele e podem durar entre uma e duas semanas.

b) Riscos específicos: nódulos, hematomas, estriações lineares ou geométricas esbranquiçadas na pele, temporários; Muito raramente
a pele pode ficar escurecida no local por 1-2 meses; Queimaduras graves; Paralisia ou perda de sensibilidade dos nervos da face.

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'lipoenzimatica',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — LIPOENZIMÁTICA',
  'lipoenzimatica-oficial-pdf-2026-11-v1',
  $official_term$
CLÍNICA / ESTABELECIMENTO DE SAÚDE
CNPJ: ___________________________ | ALVARÁ SANITÁRIO Nº: ___________________________

TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO – TCLE
PROCEDIMENTO: LIPOENZIMATICA (LIPÓLISE ENZIMÁTICA)
Conforme: RDC ANVISA nº 336/2020 | RDC nº 630/2022 | CFM Resolução nº 2.264/2019 | Lei nº 8.078/1990 (CDC) | Lei nº 13.787/2018 | CFN/CRN | CFF/CRF

IDENTIFICAÇÃO DO PACIENTE E DO PROFISSIONAL RESPONSÁVEL

Nome do Paciente:                                                                                          Data de Nascimento:

CPF:                                                                                                       RG:

Endereço:                                                                                                  Telefone/WhatsApp:

E-mail:                                                                                                    Estado Civil:

Nome do Profissional                                                                                       Registro Profissional
Responsável:                                                                                               (CRM/CFN/CRF/CREFITO):

Especialidade:                                                                                             Data do Procedimento:

2. O QUE É A LIPOENZIMATICA?
A Lipoenzimatica, também denominada Lipólise Enzimática, é um procedimento estético não cirúrgico que consiste
na aplicação de substâncias enzimáticas — como a Fosfatidilcolina associada ao Deoxicolato de Sódio, Colagenase,
Lipase ou outras formulações farmacológicas — por via injetável (intradérmica, subcutânea ou intramuscular), com a
finalidade de promover a lise (destruição) das células adiposas (adipócitos) e/ou fibrose localizada, resultando na
redução de depósitos de gordura e na melhora do contorno corporal.
O procedimento é realizado com agulhas de calibre fino, podendo ser complementado por técnicas de mesoterapia
ou microinfusão. Não se confunde com procedimentos cirúrgicos de lipoaspiração e não garante os mesmos
resultados.
3. INDICAÇÕES E CONTRAINDICAÇÕES
3.1 Indicações Terapêuticas e Estéticas
Gordura localizada resistente à dieta e aos exercícios físicos (lipodistrofia localizada);
Fibrolipodistrofia ginoide (celulite) de graus II a IV;
Lipomas pequenos (sob avaliação médica);
Papada (gordura submentoniana);
Flancos, abdômen, flancos, face interna dos joelhos, braços e culote.
3.2 Contraindicações Absolutas (o procedimento NÃO será realizado)
Gravidez e lactação;
Hipersensibilidade ou alergia conhecida a qualquer componente da fórmula utilizada;
Doenças autoimunes em atividade (Lúpus, Esclerose Sistêmica etc.);
Coagulopatias e uso de anticoagulantes (Warfarina, Rivaroxabana, AAS >100mg/dia) sem liberação médica;
Infecções ativas na área a ser tratada (impetigo, foliculite, herpes ativo);
Neoplasias malignas em tratamento ou sem controle oncológico;
Insuficiência hepática ou renal graves;
Doença inflamatória intestinal ativa (Crohn, Retocolite);
Diabetes mellitus descompensada;
Dislipidemia grave não controlada;
Menores de 18 anos (salvo com autorização dos responsáveis legais e avaliação médica).
3.3 Contraindicações Relativas (requerem avaliação criteriosa)
Uso de medicamentos que interferem na coagulação (AINEs, ômega-3 em altas doses);
Histórico de queloides ou cicatrizes hipertróficas;
Hipotireoidismo não controlado;
Imunossupressão (HIV com carga viral detectável, uso de corticoides sistêmicos).                                   pag 1

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).

4. COMO O PROCEDIMENTO É REALIZADO
Antes da aplicação, a área a ser tratada é higienizada com solução antisséptica. Pode ser aplicada anestesia tópica
(creme EMLA® ou similar) para maior conforto do paciente, aguardando-se o tempo de ação indicado pelo fabricante.
A substância enzimática é preparada em farmácia de manipulação devidamente licenciada pela ANVISA, conforme
prescrição do profissional habilitado, ou é utilizada produto registrado na ANVISA. A aplicação é realizada com
seringas e agulhas estéreis de uso único, respeitando-se técnica asséptica rigorosa. O número de pontos,
profundidade e volume variam conforme a área, protocolo clínico e resposta individual.
Ao final, aplica-se curativo oclusivo ou compressivo quando indicado. A sessão tem duração média de 30 a 90
minutos, dependendo da extensão da área tratada.
5. NÚMERO DE SESSÕES, INTERVALO E RESULTADOS ESPERADOS
O número de sessões necessárias varia de acordo com o volume de gordura localizada, a região anatômica e a
resposta biológica individual. Em geral, são necessárias entre 4 e 10 sessões com intervalo mínimo de 21 a 30 dias
entre cada aplicação na mesma área.
Os resultados NÃO SÃO IMEDIATOS. A resposta inflamatória e o processo de eliminação dos adipócitos ocorrem de
forma gradual, podendo levar de 4 a 8 semanas para que os efeitos de cada sessão sejam plenamente observados.
Resultados definitivos são esperados após o término do protocolo completo e dependem de estilo de vida saudável,
alimentação equilibrada e prática regular de atividade física.
O PROFISSIONAL RESPONSÁVEL NÃO GARANTE RESULTADOS ESPECÍFICOS, uma vez que a resposta ao tratamento
é individual e multifatorial.
6. RISCOS, EFEITOS ADVERSOS E COMPLICAÇÕES POSSÍVEIS
Todo procedimento invasivo envolve riscos. Ao assinar este termo, o paciente declara ter sido informado sobre os
seguintes efeitos adversos:
6.1 Efeitos Esperados e Transitórios (considerados normais no processo)
Edema (inchaço) local — pode persistir por até 4 semanas;
Equimoses (hematomas) e eritema (vermelhidão) na área tratada;
Dor ou desconforto local durante e após a aplicação;
Sensação de calor, prurido (coceira) ou dormência transitória;
Endurecimento (nodulações) temporário no tecido subcutâneo.
6.2 Complicações Incomuns mas Possíveis
Infecção bacteriana ou formação de abscesso (em caso de falha na assepsia ou comprometimento imunológico);
Reação alérgica leve a moderada aos componentes da formulação;
Hiperpigmentação pós-inflamatória (manchas escuras) — especialmente em fototipos mais altos (Fitzpatrick IV-VI);
Irregularidades no contorno (assimetria) que podem necessitar de sessões corretivas;
Necrose cutânea focal (raramente, associada a técnica inadequada ou perfusão insuficiente);
Lipodistrofia iatrogênica (perda excessiva de gordura além do desejado).
6.3 Complicações Raras e Graves
Anafilaxia — reação alérgica sistêmica grave (risco estimado <0,01%);
Embolia gordurosa (extremamente rara em procedimentos superficiais);
Lesão de estruturas nervosas ou vasculares adjacentes.
Em caso de qualquer sinal de alarme (febre acima de 38°C, dor intensa progressiva, sinais de infecção, falta de ar ou
reação alérgica sistêmica), o paciente deve contatar imediatamente o profissional responsável ou dirigir-se ao pronto-
socorro mais próximo.
7. ALTERNATIVAS TERAPÊUTICAS DISPONÍVEIS
O paciente foi informado de que existem outras opções terapêuticas para o mesmo objetivo, tais como:
Tratamento conservador: dieta hipocalórica + exercício físico aeróbico e resistido;
Criolipólise (congelamento de gordura localizada);
Ultrassom focado de alta intensidade (HIFU corporal);
Radiofrequência para lipólise (BodyTite®, Thermage® etc.);
Lipoaspiração cirúrgica (procedimento cirúrgico com indicação médica);
Outros procedimentos de mesoterapia com formulações distintas.

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com                                       pag 2

Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).

8. ORIENTAÇÕES PRÉ E PÓS-PROCEDIMENTO
8.1 Antes do Procedimento (PRÉ-SESSÃO)
Informar ao profissional sobre todos os medicamentos em uso, incluindo fitoterápicos e suplementos;
Suspender AINEs (ibuprofeno, naproxeno) e anticoagulantes, conforme orientação médica;
Evitar exposição solar intensa na área a ser tratada nas 72h anteriores;
Não realizar depilação com cera na área nas 48h anteriores;
Comparecer com a pele limpa, sem cremes, óleos ou maquiagem na área tratada;
Manter-se bem hidratado(a) nas 24h antes da sessão.
8.2 Após o Procedimento (PÓS-SESSÃO)
Evitar exposição solar direta na área tratada por no mínimo 15 dias; usar protetor solar FPS 50+;
Não massagear ou comprimir fortemente a área nas primeiras 48h;
Evitar piscina, sauna, banho quente e atividade física intensa nas primeiras 48-72h;
Manter alimentação saudável e ingestão hídrica adequada (mínimo 2L de água/dia);
Utilizar cinta ou malha compressiva, se indicado pelo profissional;
Aplicar gelo (protegido por pano) para alívio de edema e desconforto, se orientado;
Retornar à consulta de reavaliação na data agendada.
9. SUBSTÂNCIAS UTILIZADAS — FORMULAÇÃO E REGISTRO ANVISA
A substância a ser utilizada neste procedimento é: _________________________________, na concentração
de _____________, manipulada pela Farmácia _________________________, CNPJ: _________________,
Autorização de Funcionamento ANVISA nº: _________________, conforme prescrição datada de
___ /___ /______, ou produto industrializado com Registro ANVISA nº: _____________.
O profissional declara que a formulação prescrita/utilizada está em conformidade com a RDC ANVISA
nº 67/2007 (Boas Práticas de Manipulação), RDC nº 204/2017 e demais normas aplicáveis às farmácias
de manipulação, bem como com a RDC nº 630/2022 no que tange a produtos para saúde.
10. FUNDAMENTAÇÃO LEGAL E REGULATÓRIA
Este procedimento e o presente TCLE observam as seguintes normas:

Regulamenta os serviços de saúde estética e procedimentos invasivos não
RDC ANVISA nº 336/2020
cirúrgicos.

RDC ANVISA nº 630/2022                                                                      Regulamento Sanitário para estabelecimentos de saúde e similares.

Boas Práticas de Manipulação de Preparações Magistrais e Oficinais em
RDC ANVISA nº 67/2007
Farmácias.

Resolução CFM nº 2.264/2019                                                                 Define os procedimentos estéticos e delimita a atuação médica.

Resolução CFM nº 2.368/2024                                                                 Sobre telemedicina e prescrição digital (quando aplicável).

Código de Defesa do Consumidor — dever de informação e responsabilidade
Lei nº 8.078/1990 – CDC
do fornecedor.

Dispõe sobre a digitalização e utilização de sistemas informatizados de
Lei nº 13.787/2018
prontuários.

Lei nº 10.702/2018 (SP) e equivalentes estaduais                                            Obrigatoriedade de TCLE para procedimentos estéticos invasivos.

LGPD – Lei nº 13.709/2018                                                                   Proteção de dados pessoais e sensíveis do paciente.

Resolução CFN nº 680/2021                                                                   Define os atos do nutricionista em estética e procedimentos relacionados.

Resolução CFF nº 638/2020                                                                   Regulamenta a atuação do farmacêutico em procedimentos estéticos.

Resolução COFFITO nº 510/2018                                                               Define a atuação do fisioterapeuta em procedimentos estéticos.

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com                                      pag 3

Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).

11. PROTEÇÃO DE DADOS PESSOAIS (LGPD – LEI Nº 13.709/2018)
Os dados pessoais e de saúde coletados neste termo e no prontuário do paciente são tratados com base na hipótese
legal de 'tutela da saúde' (art. 11, II, f, LGPD) e são utilizados exclusivamente para fins assistenciais, de segurança do
procedimento e cumprimento de obrigações legais.
O estabelecimento compromete-se a: (i) não compartilhar dados com terceiros sem consentimento expresso, salvo
obrigação legal; (ii) armazenar prontuários pelo prazo mínimo de 20 anos, conforme CFM/Res. nº 1.638/2002; (iii)
garantir ao paciente o direito de acesso, correção, portabilidade e eliminação dos dados, nos termos da LGPD.
12. DECLARAÇÃO DE CIÊNCIA E CONSENTIMENTO DO PACIENTE
Eu, paciente identificado(a) no item 1 deste documento, declaro que:

✔ Li e compreendi todas as informações contidas neste Termo de Consentimento Livre e Esclarecido;
✔ Tive a oportunidade de fazer perguntas ao profissional responsável, as quais foram respondidas de forma clara e
✔ Fui informado(a) sobre os riscos, benefícios, alternativas e limitações do procedimento;
satisfatória;

✔ Compreendo que os resultados podem variar individualmente e que não há garantia de resultado;
✔ Autorizo o registro fotográfico da área tratada antes, durante e após o procedimento, para fins de documentação
✔ Declaro que as informações fornecidas sobre minha saúde são verdadeiras e completas;
clínica e acompanhamento do tratamento, vedada a divulgação sem meu consentimento expresso;

✔ CONSINTO LIVRE E VOLUNTARIAMENTE com a realização do procedimento de Lipoenzimatica.
Caso o paciente NÃO CONSINTA com o procedimento, assina abaixo:
Declaro que fui devidamente informado(a) sobre o procedimento proposto e, fazendo uso do meu direito ao
dissentimento, RECUSO a realização do mesmo, sem qualquer prejuízo ao meu atendimento.

13. ASSINATURAS

PACIENTE OU RESPONSÁVEL LEGAL
____________________________________                     Data: ___ /___ /______ Local: _______________

PROFISSIONAL RESPONSÁVEL PELO PROCEDIMENTO

____________________________________                     Data: ___ /___ /______ Local: _______________

14. TESTEMUNHAS (QUANDO APLICÁVEL)
____________________________________

Data: ___ /___ /______ Local: _______________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com                                       pag 3

Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'intradermoterapia-facial',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — INTRADERMOTERAPIA FACIAL',
  'intradermoterapia-facial-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE ESCLARECIDO INTRADEMOTERAPIA

Eu, _____________________________________________, portador do RG nº __________________________________
e CPF nº ______________________, declaro ter sido informado(a) de forma clara e compreensível sobre o
procedimento de ( ) intradermoterapia , facial ( ) corporal , capilar ( ) a ser realizado pela profissional
____________________________________________________ no dia____/____/_____.

Fui esclarecido(a) sobre os seguintes pontos:

Natureza do Procedimento: A intradermoterapia é um procedimento estético minimamente invasivo que
envolve a aplicação de substâncias diretamente na pele ou couro cabeludo através de microinjeções.
Compreendo que esse procedimento é utilizado para diversos fins, como rejuvenescimento facial, tratamento
de celulite, gordura localizada e queda de cabelo.

Riscos e Benefícios: Estou ciente dos possíveis riscos associados à intradermoterapia, incluindo, mas não se
limitando a dor localizada, vermelhidão, inchaço, hematomas, infecção, reações alérgicas e, em casos raros,
cicatrizes ou necrose tecidual. Reconheço que os resultados individuais podem variar e que não há garantia de
resultados específicos.

Alternativas: Fui informado(a) sobre outras opções de tratamento disponíveis para minhas condições
específicas, bem como sobre a possibilidade de não realizar o procedimento.

Cuidados Pós-Procedimento: Entendo a importância de seguir as instruções fornecidas pelo profissional após o
procedimento, incluindo cuidados com a pele ou cabelo, atividades físicas restritas e uso de medicamentos
prescritos, se aplicável.

Custo e Pagamento: Estou ciente do custo do procedimento e concordo em pagar pelos serviços prestados
conforme os termos acordados com a clínica.

Consentimento Voluntário: Declaro que este consentimento é dado voluntariamente, após ter tido a
oportunidade de fazer perguntas e receber respostas satisfatórias sobre o procedimento, seus riscos e
benefícios.

Revogação do Consentimento: Reconheço que tenho o direito de revogar este consentimento a qualquer
momento antes ou durante o procedimento, sem penalidades, e que tenho o direito de recusar ou interromper
o tratamento a qualquer momento.

Compreendi todas as informações fornecidas sobre a intradermoterapia facial, corporal e capilar e estou de
acordo em prosseguir com o procedimento.

_______________________
ASSINATURA CLIENTE

Data ____/____/______

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'intradermoterapia-corporal',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — INTRADERMOTERAPIA CORPORAL',
  'intradermoterapia-corporal-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE ESCLARECIDO INTRADEMOTERAPIA

Eu, _____________________________________________, portador do RG nº __________________________________
e CPF nº ______________________, declaro ter sido informado(a) de forma clara e compreensível sobre o
procedimento de ( ) intradermoterapia , facial ( ) corporal , capilar ( ) a ser realizado pela profissional
____________________________________________________ no dia____/____/_____.

Fui esclarecido(a) sobre os seguintes pontos:

Natureza do Procedimento: A intradermoterapia é um procedimento estético minimamente invasivo que
envolve a aplicação de substâncias diretamente na pele ou couro cabeludo através de microinjeções.
Compreendo que esse procedimento é utilizado para diversos fins, como rejuvenescimento facial, tratamento
de celulite, gordura localizada e queda de cabelo.

Riscos e Benefícios: Estou ciente dos possíveis riscos associados à intradermoterapia, incluindo, mas não se
limitando a dor localizada, vermelhidão, inchaço, hematomas, infecção, reações alérgicas e, em casos raros,
cicatrizes ou necrose tecidual. Reconheço que os resultados individuais podem variar e que não há garantia de
resultados específicos.

Alternativas: Fui informado(a) sobre outras opções de tratamento disponíveis para minhas condições
específicas, bem como sobre a possibilidade de não realizar o procedimento.

Cuidados Pós-Procedimento: Entendo a importância de seguir as instruções fornecidas pelo profissional após o
procedimento, incluindo cuidados com a pele ou cabelo, atividades físicas restritas e uso de medicamentos
prescritos, se aplicável.

Custo e Pagamento: Estou ciente do custo do procedimento e concordo em pagar pelos serviços prestados
conforme os termos acordados com a clínica.

Consentimento Voluntário: Declaro que este consentimento é dado voluntariamente, após ter tido a
oportunidade de fazer perguntas e receber respostas satisfatórias sobre o procedimento, seus riscos e
benefícios.

Revogação do Consentimento: Reconheço que tenho o direito de revogar este consentimento a qualquer
momento antes ou durante o procedimento, sem penalidades, e que tenho o direito de recusar ou interromper
o tratamento a qualquer momento.

Compreendi todas as informações fornecidas sobre a intradermoterapia facial, corporal e capilar e estou de
acordo em prosseguir com o procedimento.

_______________________
ASSINATURA CLIENTE

Data ____/____/______

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'eletroterapia-estetica',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — ELETROTERAPIA ESTÉTICA',
  'eletroterapia-estetica-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
ELETROTERAPIA ESTÉTICA (CORPORAL E/OU FACIAL)

IDENTIFICAÇÃO DO PACIENTE
Nome: __________________________________________
Data da Sessão: ______ /______ /______
Área Tratada: ____________________________________
Profissional Responsável: ___________________________
1. CONSIDERAÇÕES INICIAIS
A eletroterapia utiliza correntes elétricas com finalidade estética e terapêutica, promovendo estímulos musculares, melhora da
circulação e auxílio no tratamento da flacidez e contorno corporal/facial.
Trata-se de um procedimento não invasivo, com recuperação imediata, porém que exige cuidados para potencialização dos
resultados.
2. REAÇÕES ESPERADAS
Após a sessão, podem ocorrer:
Leve vermelhidão na área tratada
Sensação de formigamento ou calor
Contrações musculares residuais leves
Sensibilidade local temporária
Leve fadiga muscular
Essas reações são transitórias e tendem a desaparecer em poucas horas.
3. CUIDADOS IMEDIATOS (APÓS A SESSÃO)
Manter a pele limpa e hidratada
Evitar manipulação excessiva da área
Não aplicar produtos irritantes sem orientação
Evitar exposição ao calor intenso (sauna, banho muito quente) nas primeiras horas
Hidratar-se adequadamente
4. CUIDADOS NAS 24 HORAS SEGUINTES
Evitar atividade física intensa, especialmente se houver fadiga muscular
Manter alimentação equilibrada
Evitar consumo excessivo de álcool
Não associar com outros procedimentos sem orientação profissional
Utilizar fotoprotetor (em áreas expostas)
5. CUIDADOS DURANTE O TRATAMENTO (PROTOCOLO)
Comparecer às sessões conforme programação
Manter regularidade para melhores resultados
Associar o tratamento a hábitos saudáveis (alimentação e atividade física)
Informar qualquer desconforto nas próximas sessões
6. RECOMENDAÇÕES COMPLEMENTARES
A drenagem linfática pode ser associada, se indicada
Manter ingestão hídrica adequada diariamente
Seguir todas as orientações personalizadas do profissional
7. SINAIS DE ALERTA
Entrar em contato com a clínica caso apresente:
Dor persistente ou intensa
Irritação cutânea prolongada
Sensação de queimadura
Alterações de sensibilidade duradouras
Qualquer reação incomum ou desconforto fora do esperado
8. RESULTADOS E EXPECTATIVAS
Os resultados são progressivos e dependem da regularidade das sessões
Podem variar conforme resposta individual
A associação com hábitos saudáveis potencializa os efeitos
Não há garantia de resultado específico
9. CONTATO PROFISSIONAL
Clínica: _________________________________________
Telefone/WhatsApp: _______________________________
Responsável Técnico: ______________________________
DECLARAÇÃO DO PACIENTE
Declaro que recebi e compreendi todas as orientações pós-procedimento, comprometendo-me a segui-las corretamente.
Assinatura do Paciente: ____________________________
Data: _____ /_____ /______
Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'microagulhamento',
  'TERMO DE CONSENTIMENTO — TRATAMENTO DE MICROAGULHAMENTO',
  'microagulhamento-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO TRATAMENTO DE MICROAGULHAMENTO

PROCEDIMENTO: MICROAGULHAMENTO
Eu, ________________________________________________________________,
RG: ____________________________ CPF: ____________________________,
declaro estar ciente de que:
O microagulhamento é uma técnica que utiliza inúmeras microagulhas que geram
centenas de microperfurações na pele, aumentando a permeação de ativos, estimulando
a produção de colágeno e promovendo a regeneração tecidual.
É comum sentir desconforto e dor durante o procedimento, principalmente quando
utilizadas agulhas acima de 1 mm, pois o objetivo é atingir a derme (camada vascularizada
da pele).
A duração média do procedimento é de 50 minutos a 1h30min, sendo realizado com
anestesia tópica local.
O processo de renovação tecidual ocorre em aproximadamente 21 dias, não havendo
necessidade de repetir o procedimento antes deste período.
Para alcançar os resultados esperados, recomenda-se um mínimo de 3 sessões
consecutivas, com intervalo de 4 semanas entre elas.
A pele reestruturada pode apresentar benefícios como:
reorganização das fibras internas;
diminuição de rugas finas;
melhora de cicatrizes de acne;
maior firmeza e viço da pele;
melhora de manchas de fotoenvelhecimento, queimaduras e melasma.
Recebi orientações sobre os cuidados pré e pós-tratamento.
As agulhas utilizadas possuem de 0,5 a 2,5 mm de comprimento, são descartáveis,
extremamente afiadas e penetram na pele. O procedimento pode gerar sangramento
discreto, que cessa em poucos minutos, e eritema (vermelhidão), que desaparece após
algumas horas.
O microagulhamento cria orifícios minúsculos na pele, que se fecham rapidamente, sem
deixar marcas na epiderme.
Declaro que forneci um relato completo sobre meu histórico de saúde física e mental,
incluindo possíveis alergias (drogas, alimentos, suplementos, insetos, pólens, poeira),
doenças pré-existentes, reações cutâneas, distúrbios de coagulação ou qualquer outra
condição relevante para a segurança do procedimento.
Assinatura do Paciente: _____________________________________
Assinatura do Profissional: __________________________________
Data: ______ /_______ /_________

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'peim',
  'TERMO DE CONSENTIMENTO — PROCEDIMENTO ESTÉTICO INJETÁVEL PARA MICROVASOS (PEIM)',
  'peim-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO
PROCEDIMENTO ESTÉTICO INJETÁVEL PARA MICROVASOS (PEIM)

Eu, _______________________________________________________________, portador (a)
do RG________________ e CPF______________________________ estou ciente e concordo
em realizar o Procedimento Estético Injetável para Microvasos – PEIM.

Pelo presente termo autorizo a Dr.ª _______________________, inscrita pelo _______________ sob o
nº _________, a realizar o procedimento denominado como Procedimento Estético Injetável
para Microvasos.

2- Fui devidamente esclarecido que as causas dos vasos, varizes e telangiectasias são
principalmente genéticas e que este tratamento não previne o surgimento de futuros vasos. A
concentração de glicose é definida a critério da Enfermeira. A técnica consiste em aplicar de
forma intravascular uma substância esclerosante, através de uma agulha ultrafina. Essa agulha
é introduzida no local desejado, produzindo desidratação do vasinho por osmose, contribuindo
com o desaparecimento do vaso.

3- Entendo que a resposta ao tratamento é individual, podendo levar até semanas para
completar o resultado do tratamento, mas com melhora imediata.

4- Em alguns casos, pode-se observar hematomas no local da aplicação ou até mesmo
pequenas lesões (feridas/casquinhas), que desaparecerão normalmente. Deve-se evitar o sol
nesses locais e aplicar o protetor solar até o seu total desaparecimento.

5- Paciente do sexo feminino: Declaro não estar grávida ou amamentando.

6- Autorizo registros (foto, slides, imagem...) do (s) procedimento(s), por compreender que tal
sistemática, além de ser uma exigência legal, representa uma alternativa importante de
esclarecimento das informações prestadas necessárias ao meu atendimento crítico das
condutas propostas.

7- Tive oportunidade de esclarecer dúvidas relativas ao procedimento, principalmente com
relação aos efeitos indesejados. No mais, informo que voluntariamente irei me submeter ao
tratamento, tendo lido e compreendido as informações desse documento antes da minha
assinatura.

8- Comprometo-me a seguir as recomendações da ficha de “pós-tratamento do PEIM” que
recebi. E tenho ciência de que o grau de resultado não pode ser previsto ou garantido pelo
profissional.

Assinatura do paciente: _________________________________________________

Assinatura do profissional: _______________________________________________
Data: _______ de ______________________de 20_______

Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'depilacao-a-laser',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — DEPILAÇÃO A LASER',
  'depilacao-a-laser-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
DEPILAÇÃO A LASER
IDENTIFICAÇÃO DO CLIENTE
Nome completo: _____________________________________________________________
CPF: _______________________________________
Data de nascimento: ____ / ____ / ______
IDENTIFICAÇÃO DO ESTABELECIMENTO
Nome do estabelecimento: ___________________________________________________
CNPJ: ______________________________________
Endereço: _________________________________________________________________
Profissional responsável: ___________________________________________________
DESCRIÇÃO DO PROCEDIMENTO
Declaro que fui devidamente informado(a) de que a depilação a laser é um procedimento estético que utiliza tecnologia de emissão
de energia luminosa para atingir o folículo piloso, promovendo a redução progressiva dos pelos ao longo das sessões.
Estou ciente de que o tratamento atua preferencialmente em pelos com pigmentação mais escura e que os resultados variam de
acordo com características individuais, tais como tipo de pele, cor e espessura do pelo, área tratada, condições hormonais e
cuidados adotados antes, durante e após o procedimento.
RESULTADOS ESPERADOS E LIMITAÇÕES
Fui informado(a) de que a depilação a laser promove redução gradual dos pelos e não garante eliminação definitiva em todos os
casos.
Estou ciente de que podem ser necessárias múltiplas sessões, bem como sessões de manutenção, para obtenção e preservação
dos resultados desejados.
POSSÍVEIS RISCOS E REAÇÕES ADVERSAS
Fui esclarecido(a) sobre os possíveis efeitos adversos, que podem incluir, mas não se limitam a
Vermelhidão temporária
Edema local
Sensação de ardor ou calor
Ressecamento da pele
Escurecimento ou clareamento temporário da pele
Sensibilidade local
Estou ciente de que, embora raras quando respeitados os protocolos de segurança, podem ocorrer intercorrências como
queimaduras, bolhas ou alterações pigmentares.
CUIDADOS PRÉ E PÓS PROCEDIMENTO
Declaro que recebi orientações claras sobre os cuidados necessários antes e após o procedimento, incluindo
Evitar exposição solar antes e após as sessões
Utilizar protetor solar conforme orientação profissional
Não utilizar métodos de depilação que arranquem o pelo pela raiz
Manter a pele limpa e hidratada
Comprometo-me a seguir rigorosamente todas as orientações fornecidas.
DECLARAÇÕES IMPORTANTES
Declaro que
Forneci informações verdadeiras e completas na ficha de anamnese
Informei corretamente sobre uso de medicamentos, doenças, gestação, amamentação e condições hormonais
Estou ciente de que a omissão de informações pode comprometer minha segurança e os resultados do procedimento
Autorizo a realização do procedimento conforme avaliação profissional
Reconheço que os resultados não são garantidos e que a resposta ao tratamento pode variar de pessoa para pessoa.
CONSENTIMENTO
Após ter lido, compreendido e esclarecido todas as minhas dúvidas, declaro que CONSINTO LIVREMENTE com a realização do
procedimento de depilação a laser, assumindo ciência dos riscos, benefícios, limitações e cuidados necessários.
Este termo é firmado de forma voluntária, consciente e sem qualquer tipo de coação.
Local e data: _______________________________________________________________
Assinatura do cliente: _______________________________________________________
Assinatura do profissional responsável: ______________________________________
Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'criolipolise',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA CRIOLIPÓLISE',
  'criolipolise-oficial-pdf-2026-11-v1',
  $official_term$
TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PROCEDIMENTO DE CRIOLIPÓLISE

IDENTIFICAÇÃO DO PACIENTE
Nome: ____________________________________________Data de Nascimento: ____/___/______
CPF: ____________________________________________Endereço: ________________________________________
Cidade: _______________________ Estado: ___________Telefone: (___) ____________
DESCRIÇÃO DO PROCEDIMENTO
A criolipólise é um procedimento estético não invasivo que utiliza tecnologia de resfriamento controlado para reduzir a
gordura localizada. Durante a sessão, um aplicador será posicionado na área desejada para resfriar as células de gordura,
promovendo sua eliminação gradual pelo organismo.

RISCOS E POSSÍVEIS EFEITOS ADVERSOS
Vermelhidão, inchaço e hematomas temporários na área tratada;
Dormência ou formigamento transitório;
Desconforto ou sensibilidade local;
Possível alteração na pigmentação da pele;
Raramente, pode ocorrer aumento paradoxal da gordura no local tratado.

CONTRAINDICAÇÕES
O procedimento NÃO é recomendado para pessoas com:
Hipersensibilidade ao frio;
Hérnia no local de aplicação;
Doenças de pele na área a ser tratada;
Crioglobulinemia, urticária ao frio ou doença de Raynaud;
Gravidez ou lactação;
Pacientes com alterações circulatórias graves.

ORIENTAÇÕES PÓS-PROCEDIMENTO
Manter uma alimentação equilibrada e ingerir bastante água;
Evitar exposição direta ao sol na área tratada por pelo menos 48 horas;
Realizar atividades físicas regulares para potencializar os resultados;
Caso sinta desconforto excessivo ou reações adversas inesperadas, entrar em contato imediatamente com o profissional
responsável.

DECLARAÇÃO DE CONSENTIMENTO
Declaro que fui devidamente informado(a) sobre o procedimento de criolipólise, seus riscos, benefícios, contraindicações e
cuidados necessários. Todas as minhas dúvidas foram esclarecidas, e estou ciente de que os resultados podem variar de
acordo com as condições individuais do meu organismo.
Autorizo a realização do procedimento por minha livre e espontânea vontade.

Local e data: ________________, /____/_______ Assinatura do Paciente: _______________________________________
Nome do Profissional Responsável: _______________________________________
Registro Profissional (se aplicável): _______________________________________
Assinatura do Profissional: _______________________________________
Dra. Claudia Bonavoglia — Biomédica Esteticista | Tel: (11) 95411-4425 | claudiabbiomedesteta@gmail.com
Documento emitido em conformidade com as normativas do CFBio, ANVISA e legislação vigente de proteção ao paciente (LGPD – Lei 13.709/2018).
$official_term$,
  true
),
(
  'hidrolipoclasia',
  'CONSENTIMENTO LIVRE E ESCLARECIDO PARA HIDROLIPOCLASIA',
  'hidrolipoclasia-oficial-pdf-2026-11-v1',
  $official_term$
CONSENTIMENTO LIVRE E ESCLARECIDO PARA HIDROLIPOCLASIA
Procedimento Estético Invasivo — Uso Clínico Exclusivo — Embasamento Legal: Lei n.º 13.787/2018 | CFM Res. 1.931/2009 |
ANVISA RDC 69/2014

CB
1. Declaração de Veracidade das Informações

Eu, paciente identificado(a) nesta ficha, declaro, sob as penas da lei, que todas as informações fornecidas neste
documento são verdadeiras, completas e atualizadas. Estou ciente de que omissões ou inverdades poderão
comprometer minha segurança durante e após o procedimento, eximindo a profissional de responsabilidade por
intercorrências decorrentes de informações incorretas ou suprimidas.

2. Consentimento Informado para Realização do Procedimento

Declaro ter recebido informações claras, completas e em linguagem acessível sobre o procedimento de Hidrolipoclasia,
compreendendo sua finalidade, técnica de execução, substâncias envolvidas, tecnologias associadas, resultados
esperados e limitações. Após refletir adequadamente, de forma livre, voluntária e sem qualquer coerção, manifesto meu
consentimento para a realização do procedimento conforme protocolo estabelecido pela profissional responsável.

3. Ciência dos Riscos e Possíveis Intercorrências

Estou ciente de que, como qualquer procedimento estético invasivo, a Hidrolipoclasia pode apresentar os seguintes
efeitos adversos: edema local, equimoses, hematomas, dor e desconforto pós-procedimento, eritema, calor local,
irregularidades de contorno transitórias, reação alérgica (rara), fibrose pós-procedimento e, em casos excepcionais,
infecção local. Compreendo que os resultados podem variar individualmente e que não há garantia de resultado final
específico. Estou ciente, ainda, de que o não cumprimento das orientações pré e pós-procedimento pode comprometer
os resultados e aumentar o risco de complicações.

4. Autorização para Uso de Imagem (Opcional)

Autorizo, de forma opcional e revogável a qualquer momento mediante comunicação formal, a utilização de fotografias
e/ou vídeos do meu corpo (sem identificação facial, salvo autorização expressa) para fins exclusivamente educacionais,
científicos ou de portfólio profissional, vedada a divulgação em mídias de terceiros sem minha autorização adicional.

□ Autorizo o uso de imagem nos termos acima descritos □ NÃO autorizo o uso de imagem

5. Declaração de Recebimento de Orientações

Declaro que recebi, verbalmente e por escrito, todas as orientações pré e pós-procedimento previstas neste documento,
compreendendo plenamente seu conteúdo e comprometendo-me a segui-las. Estou ciente da importância do retorno
para avaliação e do contato imediato com a profissional em caso de qualquer intercorrência ou dúvida após o
procedimento.

Assinatura do(a) Paciente                                                    Assinatura da Profissional Responsável
__________________________                                                   __________________________
Nome completo por extenso:
____________________________________________________                         Dra. Claudia Bonavoglia — CRBM n.º _____________

Local e data de assinatura:                                                  Testemunha (se aplicável): Nome completo e CPF:
________________________, ______ /_____ /_________                           ____________________________________________________
Hora: ____h___                                                               ____________________________________________________

Dra. Claudia Bonavoglia | (11) 95411-4425 | claudiabbiomedesteta@gmail.com | Ficha de Anamnese – Hidrolipoclasia | Uso Clínico Exclusivo
$official_term$,
  true
)
on conflict (procedure_id, version) do update
set title = excluded.title,
    content = excluded.content,
    active = true;

commit;

