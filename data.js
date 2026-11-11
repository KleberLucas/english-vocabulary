/* Arcana Atlas: dados locais, sem dependências. Convenção: correspondências herméticas da Golden Dawn. */
const SEPHIROTH = [
 {id:1,name:'Kether',he:'כתר',meaning:'Coroa',planet:'Primum Mobile / esfera das primeiras manifestações',divine:'Eheieh',arch:'Metatron',choir:'Chayoth ha-Qadesh',pillar:'Equilíbrio',virtue:'Unidade e potencial puro',shadow:'Abstração sem manifestação',lesson:'A origem é anterior às divisões: toda realização começa como possibilidade.'},
 {id:2,name:'Chokmah',he:'חכמה',meaning:'Sabedoria',planet:'Zodíaco / estrelas fixas',divine:'Yah',arch:'Raziel',choir:'Ophanim',pillar:'Misericórdia',virtue:'Impulso criativo e expansão',shadow:'Força sem direção',lesson:'A sabedoria pode surgir como impulso criador antes de ganhar forma.'},
 {id:3,name:'Binah',he:'בינה',meaning:'Entendimento',planet:'Saturno',divine:'YHVH Elohim',arch:'Tzaphqiel',choir:'Aralim (Erelim)',pillar:'Severidade',virtue:'Estrutura, compreensão e maturação',shadow:'Rigidez e restrição excessiva',lesson:'Limites dão forma à energia; compreender é estruturar.'},
 {id:4,name:'Chesed',he:'חסד',meaning:'Misericórdia',planet:'Júpiter',divine:'El',arch:'Tzadqiel',choir:'Chashmalim',pillar:'Misericórdia',virtue:'Generosidade, ordem e benevolência',shadow:'Complacência e excesso',lesson:'A verdadeira expansão cresce com responsabilidade e benevolência.'},
 {id:5,name:'Geburah',he:'גבורה',meaning:'Força / Rigor',planet:'Marte',divine:'Elohim Gibor',arch:'Kamael',choir:'Seraphim',pillar:'Severidade',virtue:'Disciplina, coragem e discernimento',shadow:'Crueldade e dureza',lesson:'Força construtiva corta o supérfluo, mas não deve virar violência.'},
 {id:6,name:'Tiphareth',he:'תפארת',meaning:'Beleza / Harmonia',planet:'Sol',divine:'YHVH Eloah ve-Daath',arch:'Raphael',choir:'Melekim',pillar:'Equilíbrio',virtue:'Integração, verdade e compaixão',shadow:'Vaidade espiritual',lesson:'Harmonia não elimina opostos: permite integrá-los.'},
 {id:7,name:'Netzach',he:'נצח',meaning:'Vitória / Perseverança',planet:'Vênus',divine:'YHVH Tzabaoth',arch:'Haniel',choir:'Elohim',pillar:'Misericórdia',virtue:'Afeto, desejo e persistência',shadow:'Dependência do prazer',lesson:'O desejo pode inspirar a criação quando recebe direção.'},
 {id:8,name:'Hod',he:'הוד',meaning:'Glória / Esplendor',planet:'Mercúrio',divine:'Elohim Tzabaoth',arch:'Michael',choir:'Beni Elohim',pillar:'Severidade',virtue:'Linguagem, análise e organização',shadow:'Intelectualização sem experiência',lesson:'Dar nome às coisas ajuda a entendê-las; símbolos não substituem a vida.'},
 {id:9,name:'Yesod',he:'יסוד',meaning:'Fundamento',planet:'Lua',divine:'Shaddai El Chai',arch:'Gabriel',choir:'Kerubim',pillar:'Equilíbrio',virtue:'Imaginação, conexão e memória',shadow:'Ilusão e dispersão',lesson:'Imagens, sonhos e hábitos organizam a ponte entre interior e exterior.'},
 {id:10,name:'Malkuth',he:'מלכות',meaning:'Reino',planet:'Terra / quatro elementos',divine:'Adonai ha-Aretz',arch:'Sandalphon',choir:'Ashim',pillar:'Equilíbrio',virtue:'Presença e realização concreta',shadow:'Materialismo sem sentido',lesson:'A compreensão se completa quando se traduz em ação no mundo.'}
];
const WORLDS = [
 {id:'atziluth',name:'Atziluth',he:'אצילות',meaning:'Emanação',element:'Fogo',suit:'Paus',divLevel:'Nomes divinos',description:'Plano arquetípico: a unidade é pensada simbolicamente como fonte das emanações. Não equivale a um lugar físico.',practice:'Pergunta-chave: qual é a intenção essencial?',example:'O impulso criador antes de receber forma.'},
 {id:'briah',name:'Briah',he:'בריאה',meaning:'Criação',element:'Água',suit:'Copas',divLevel:'Arcanjos',description:'Plano das ideias criativas e grandes princípios organizadores, associado à recepção e elaboração.',practice:'Pergunta-chave: que visão ou sentido se forma?',example:'A ideia de uma obra que pode ser criada.'},
 {id:'yetzirah',name:'Yetzirah',he:'יצירה',meaning:'Formação',element:'Ar',suit:'Espadas',divLevel:'Coros angélicos',description:'Plano dos padrões e formas em organização: relações, imagens, linguagem e estruturação.',practice:'Pergunta-chave: como organizar e dar estrutura?',example:'O planejamento, os esquemas e as escolhas.'},
 {id:'assiah',name:'Assiah',he:'עשיה',meaning:'Ação',element:'Terra',suit:'Ouros',divLevel:'Manifestação material',description:'Plano da concretização e da experiência cotidiana; é o mundo da ação e dos resultados observáveis.',practice:'Pergunta-chave: o que será feito concretamente?',example:'A obra materializada, com consequências reais.'}
];
const PILLARS = [
 {id:'Misericórdia',name:'Misericórdia',side:'Direita no diagrama',alt:'Jachin',ids:[2,4,7],summary:'Expansão, inspiração, crescimento e acolhimento.',risk:'Excesso de permissividade ou dispersão.',balance:'Necessita da capacidade de delimitar do outro pilar.'},
 {id:'Equilíbrio',name:'Equilíbrio',side:'Centro',alt:'Pilar do Meio',ids:[1,6,9,10],summary:'Integração entre forças, consciência e concretização.',risk:'Neutralidade passiva se não houver ação.',balance:'Não é ausência de polaridades, mas sua coordenação.'},
 {id:'Severidade',name:'Severidade',side:'Esquerda no diagrama',alt:'Boaz',ids:[3,5,8],summary:'Limites, análise, forma, discriminação e disciplina.',risk:'Rigidez ou crítica em excesso.',balance:'Necessita da abertura e generosidade do outro pilar.'}
];
const PATH_DATA = [
 ['א','Aleph','Álef',1,'Boi / princípio', 'Traço diagonal cruzado, evocando um eixo entre dois movimentos.', 'Ar',1,2,'A abertura ao desconhecido e a coragem de começar.'],
 ['ב','Beth','Bet',2,'Casa', 'Contorno superior e lateral, como um abrigo aberto.', 'Mercúrio',1,3,'Dar forma e direção à capacidade de agir.'],
 ['ג','Gimel','Guímel',3,'Camelo', 'Parte superior curva com um traço descendente, semelhante a uma perna em movimento.', 'Lua',1,6,'Cruzar distâncias, ouvir a intuição e acolher o silêncio.'],
 ['ד','Daleth','Dálet',4,'Porta', 'Ângulo com barra superior e haste vertical.', 'Vênus',2,3,'Abrir passagem à fertilidade e à criação.'],
 ['ה','Heh','Hê',5,'Janela / sopro', 'Três traços com uma abertura na parte inferior.', 'Áries',2,6,'Estabelecer direção e assumir responsabilidade.'],
 ['ו','Vav','Vav',6,'Gancho / conexão', 'Haste curta com pequena curvatura no alto.', 'Touro',2,4,'Unir valores e prática por meio do aprendizado.'],
 ['ז','Zayin','Záin',7,'Arma / instrumento', 'Haste vertical rematada por uma linha na parte superior.', 'Gêmeos',3,6,'Escolher conscientemente e integrar diferenças.'],
 ['ח','Cheth','Chet',8,'Cerca', 'Duas hastes ligadas na parte superior.', 'Câncer',3,5,'Proteger o essencial sem fechar-se ao crescimento.'],
 ['ט','Teth','Tet',9,'Serpente / recipiente', 'Forma curvada e quase fechada, com dobra interior.', 'Leão',4,5,'Dominar impulsos com gentileza e coragem.'],
 ['י','Yod','Iod',10,'Mão', 'Pequeno traço suspenso com ligeira curva.', 'Virgem',4,6,'Concentrar atenção no necessário e servir com simplicidade.'],
 ['כ','Kaph','Caf',20,'Palma da mão', 'Curva aberta voltada para um lado, como algo que pode receber.', 'Júpiter',4,7,'Aceitar os ciclos sem perder a capacidade de agir.'],
 ['ל','Lamed','Lámed',30,'Aguilhão / aprendizado', 'Haste alta que se projeta acima da linha das demais letras.', 'Libra',5,6,'Equilibrar discernimento, responsabilidade e justiça.'],
 ['מ','Mem','Mem',40,'Água', 'Traços unidos que formam uma cavidade, com descida lateral.', 'Água',5,8,'Mudar a perspectiva e permitir a suspensão fértil.'],
 ['נ','Nun','Nun',50,'Peixe', 'Pequena haste dobrada que desce e se projeta.', 'Escorpião',6,7,'Deixar terminar o que precisa ser transformado.'],
 ['ס','Samekh','Sámech',60,'Apoio / suporte', 'Contorno arredondado e fechado.', 'Sagitário',6,9,'Alquimia de opostos: encontrar a medida e a integração.'],
 ['ע','Ayin','Áin',70,'Olho', 'Dois traços descendentes que se encontram numa base.', 'Capricórnio',6,8,'Perceber vínculos, medos e condicionamentos.'],
 ['פ','Peh','Pê',80,'Boca', 'Contorno com abertura interior, lembrando uma boca.', 'Marte',7,8,'Romper construções falsas e recuperar autenticidade.'],
 ['צ','Tzaddi','Tsádi',90,'Anzol', 'Dois ramos no alto que convergem para uma base alongada.', 'Aquário',7,9,'Cultivar esperança, inspiração e abertura.'],
 ['ק','Qoph','Cof',100,'Nuca / parte posterior da cabeça', 'Laço arredondado com haste que desce abaixo da linha.', 'Peixes',7,10,'Enfrentar incertezas e reconhecer o que ainda está oculto.'],
 ['ר','Resh','Rêsh',200,'Cabeça', 'Ângulo arredondado superior com haste descendente.', 'Sol',8,9,'Reconhecer a clareza, a vitalidade e a espontaneidade.'],
 ['ש','Shin','Shin',300,'Dente', 'Três hastes que sobem a partir de uma base comum.', 'Fogo',8,10,'Responder a um chamado de renovação e consciência.'],
 ['ת','Tav','Tav',400,'Marca / sinal', 'Duas hastes unidas com topo horizontal curvo.', 'Saturno / Terra',9,10,'Concluir um ciclo e realizar o aprendido no mundo.']
];
const LETTERS = PATH_DATA.map((r,i)=>({id:'l'+i,he:r[0],name:r[1],pronunciation:r[2],gematria:r[3],symbolic:r[4],shape:r[5],astro:r[6],from:r[7],to:r[8],lesson:r[9],path:i+11,major:i}));
const MAJOR_DATA = [
 ['O Louco','0','Começos, liberdade, salto de fé','Um viajante próximo de um precipício, cão e rosa branca.','Abra espaço para o novo, mas não confunda confiança com imprudência.'],
 ['O Mago','I','Iniciativa, habilidade, manifestação','Figura diante de uma mesa com os quatro instrumentos; um braço para cima e outro para baixo.','Use recursos, intenção e atenção para transformar potencial em ação.'],
 ['A Sacerdotisa','II','Intuição, mistério, sabedoria interior','Mulher entre pilares B e J, véu e rolo de sabedoria.','Nem toda resposta é alcançada pelo esforço: há valor em observar e escutar.'],
 ['A Imperatriz','III','Fertilidade, cuidado, criatividade','Imperatriz rodeada pela natureza e por espigas de trigo.','Nutra o que deseja fazer crescer; criar também exige acolher.'],
 ['O Imperador','IV','Estrutura, liderança, limites','Trono de pedra ornamentado com cabeças de carneiro.','Estabeleça ordem e responsabilidade sem transformar firmeza em tirania.'],
 ['O Hierofante','V','Tradição, ensinamento, transmissão','Mestre sentado entre colunas, com duas pessoas à frente.','Aprenda com a tradição e examine conscientemente o que transmite.'],
 ['Os Enamorados','VI','Escolha, união, valores','Duas figuras sob um anjo e uma paisagem de árvores.','Uma escolha importante pede alinhamento entre desejo e princípios.'],
 ['O Carro','VII','Direção, determinação, autocontrole','Condutor diante de duas esfinges de cores contrastantes.','Conduza forças diferentes a uma direção definida.'],
 ['A Força','VIII','Coragem serena, integração dos instintos','Mulher toca delicadamente a boca de um leão.','O domínio mais profundo nasce da presença, não da brutalidade.'],
 ['O Eremita','IX','Introspecção, orientação, discernimento','Figura solitária no alto, segurando lanterna.','O recolhimento pode revelar uma luz útil para o próximo passo.'],
 ['A Roda da Fortuna','X','Ciclos, mudança, impermanência','Grande roda com figuras simbólicas nos quatro cantos.','Reconheça os ciclos: adapte-se ao que muda sem abandonar o centro.'],
 ['A Justiça','XI','Equilíbrio, verdade, consequências','Figura com espada e balança, sentada de frente.','Escolhas têm consequências; busque proporcionalidade e clareza.'],
 ['O Enforcado','XII','Suspensão, rendição, novo olhar','Pessoa suspensa de cabeça para baixo, com expressão tranquila.','Alguns avanços exigem parar e enxergar de outro ângulo.'],
 ['A Morte','XIII','Encerramento, transformação, transição','Cavaleiro esquelético com estandarte branco e rosa.','Permita que uma fase termine para abrir espaço a outra.'],
 ['A Temperança','XIV','Moderação, alquimia, integração','Anjo verte líquido entre duas taças; um pé na água e outro na terra.','Misture diferenças com paciência até encontrar a medida adequada.'],
 ['O Diabo','XV','Apego, compulsão, condicionamento','Figura acima de duas pessoas ligadas por correntes frouxas.','Identifique amarras e a parcela de liberdade que você pode recuperar.'],
 ['A Torre','XVI','Ruptura, revelação, colapso do falso','Raio atinge torre e pessoas caem durante o incêndio.','Aquilo que não se sustenta pode precisar ruir para permitir reconstrução.'],
 ['A Estrela','XVII','Esperança, inspiração, renovação','Figura ajoelhada verte água na terra e em um lago sob estrelas.','Recupere a confiança no processo e cuide do que floresce discretamente.'],
 ['A Lua','XVIII','Incerteza, imaginação, inconsciente','Lua ilumina caminho entre torres, cão, lobo e crustáceo.','Diferencie intuição, medo e fantasia enquanto atravessa o desconhecido.'],
 ['O Sol','XIX','Clareza, alegria, vitalidade','Criança em um cavalo branco sob um sol radiante.','Receba a clareza com simplicidade e expresse-se sem mascarar quem é.'],
 ['O Julgamento','XX','Despertar, chamado, avaliação','Anjo toca trombeta enquanto figuras se erguem.','Reavalie o passado e responda ao chamado de renovação.'],
 ['O Mundo','XXI','Conclusão, integração, plenitude','Figura central dentro de uma grinalda com quatro criaturas nos cantos.','Integre o caminho percorrido e reconheça o fechamento de um ciclo.']
];
const SUITS = [
 {id:'wa',name:'Paus',world:'atziluth',element:'Fogo',key:'vontade e criação',symbol:'♣',about:'Ação, iniciativa, coragem e impulso criativo.'},
 {id:'cu',name:'Copas',world:'briah',element:'Água',key:'emoções e vínculos',symbol:'♥',about:'Afeto, sensibilidade, relações e imaginação.'},
 {id:'sw',name:'Espadas',world:'yetzirah',element:'Ar',key:'ideias e conflitos',symbol:'♠',about:'Raciocínio, escolhas, palavras e tensões.'},
 {id:'pe',name:'Ouros',world:'assiah',element:'Terra',key:'recursos e realização',symbol:'◆',about:'Corpo, trabalho, estabilidade e vida prática.'}
];
const RANKS = ['Ás','2','3','4','5','6','7','8','9','10','Pajem','Cavaleiro','Rainha','Rei'];
const COURT_ELEMENTS = ['Terra','Ar','Água','Fogo'];
const MINOR_MESSAGES = {
 wa:[
 ['Faísca criativa','Uma mão surge entre nuvens segurando uma vara cheia de brotos.','Uma ideia pede iniciativa: experimente começar.'],
 ['Planejamento e horizonte','Figura segura um globo e contempla o mar do alto.','O desejo cresce quando você considera as próximas possibilidades.'],
 ['Expansão e espera ativa','Pessoa observa navios afastando-se no horizonte.','Depois de agir, acompanhe resultados e expanda sua visão.'],
 ['Celebração e base comum','Quatro bastões formam um portal festivo com guirlandas.','Valorize os marcos alcançados e as relações que dão sustentação.'],
 ['Atrito e competição','Cinco pessoas cruzam bastões em uma disputa animada.','Transforme energia competitiva em aprendizado e cooperação.'],
 ['Reconhecimento','Pessoa coroada cavalga entre figuras com bastões.','Receba conquistas com humildade e mantenha o propósito.'],
 ['Posição e defesa','Pessoa se sustenta em terreno elevado contra bastões erguidos.','Defenda aquilo que considera importante com discernimento.'],
 ['Movimento veloz','Oito bastões atravessam o céu sem figuras humanas.','Aproveite a velocidade dos acontecimentos com atenção.'],
 ['Resiliência e vigilância','Figura ferida protege uma fileira de bastões.','Persevere, mas reconheça os limites do próprio desgaste.'],
 ['Sobrecarga','Pessoa carrega dez bastões dificultando sua caminhada.','Redistribua responsabilidades para não perder o sentido da jornada.'],
 ['Curiosidade criativa','Jovem observa atentamente o bastão que segura.','Aprenda explorando ideias com entusiasmo e humildade.'],
 ['Impulso aventureiro','Cavaleiro avança num cavalo empinado segurando bastão.','A paixão move, mas precisa de direção.'],
 ['Autonomia calorosa','Rainha segura girassol e bastão, com gato negro aos pés.','Una confiança, presença e generosidade.'],
 ['Liderança visionária','Rei sentado no trono ornamentado segura um bastão.','Lidere pelo exemplo e dê continuidade ao que iniciou.']
 ],
 cu:[
 ['Abertura afetiva','Mão oferece cálice do qual jorra água.','Permita que a sensibilidade se manifeste com sinceridade.'],
 ['Encontro e reciprocidade','Duas pessoas trocam taças diante de um caduceu.','Cultive alianças equilibradas e diálogo.'],
 ['Alegria compartilhada','Três figuras erguem taças em celebração.','O afeto se fortalece quando é partilhado.'],
 ['Apatia e contemplação','Pessoa sob árvore observa três taças enquanto outra surge de uma nuvem.','Perceba oportunidades sem ignorar seus sentimentos.'],
 ['Luto e perspectiva','Pessoa de capa escura contempla taças derramadas.','Acolha a perda sem esquecer o que permanece.'],
 ['Memória e ternura','Crianças com taças floridas em cenário familiar.','Revisite o passado sem se prender a ele.'],
 ['Fantasia e escolha','Sete taças aparecem sobre nuvens com diversos objetos.','Distingua desejo, ilusão e possibilidade real.'],
 ['Desapego e busca','Pessoa se afasta de oito taças sob céu noturno.','Às vezes crescer exige deixar para trás o que perdeu sentido.'],
 ['Satisfação e gratidão','Pessoa sentada diante de nove taças ordenadas.','Celebre o contentamento sem confundi-lo com perfeição.'],
 ['Harmonia e pertencimento','Família contempla arco-íris formado por dez taças.','Construa vínculos em que a alegria possa ser sustentada.'],
 ['Sensibilidade emergente','Pajem encara um peixe dentro de uma taça.','Acolha mensagens inesperadas da imaginação e do afeto.'],
 ['Oferta emocional','Cavaleiro avança oferecendo uma taça.','Expresse sentimentos de maneira honesta e atenta.'],
 ['Escuta interior','Rainha contempla uma taça adornada próxima da água.','Trate emoções com delicadeza e limites.'],
 ['Maturidade emocional','Rei mantém-se sereno num trono rodeado pelo mar.','Aprenda a sentir profundamente sem ser arrastado por toda onda.']
 ],
 sw:[
 ['Clareza e decisão','Mão sustenta espada coroada no alto.','Faça do pensamento um instrumento para distinguir o essencial.'],
 ['Impasse','Pessoa vendada cruza duas espadas junto ao mar.','Uma decisão adiada também tem efeitos: procure informação.'],
 ['Dor e verdade','Coração atravessado por três espadas sob chuva.','Reconhecer o sofrimento é o início de uma elaboração real.'],
 ['Pausa e recuperação','Figura repousa como escultura num ambiente silencioso.','Descanse para recuperar clareza antes de agir novamente.'],
 ['Conflito e custo','Pessoa recolhe espadas enquanto outras se afastam.','Uma vitória sem respeito pode custar mais do que oferece.'],
 ['Travessia e transição','Barco leva viajantes sobre águas em direção distante.','Aceite transições e leve apenas o necessário.'],
 ['Estratégia e ambiguidade','Figura se afasta carregando espadas e olhando para trás.','Pense estrategicamente sem justificar a desonestidade.'],
 ['Autolimitação','Pessoa vendada entre espadas presas ao solo.','Questione restrições internas e procure alternativas concretas.'],
 ['Ansiedade e ruminação','Pessoa sentada na cama cobre o rosto à noite.','Distinga fatos de pensamentos repetitivos e peça apoio quando preciso.'],
 ['Fim doloroso','Figura caída sob dez espadas, com claridade no horizonte.','Reconheça um encerramento e proteja-se enquanto recomeça.'],
 ['Vigilância intelectual','Jovem mantém espada erguida em terreno ventoso.','Questione com curiosidade sem cair em suspeita permanente.'],
 ['Ação precipitada','Cavaleiro investe velozmente com espada.','A coragem intelectual também precisa de prudência.'],
 ['Lucidez independente','Rainha estende a mão e mantém espada erguida.','Seja claro e firme, preservando empatia.'],
 ['Autoridade racional','Rei segura uma espada vertical sentado no trono.','Julgue com integridade, razão e consequências em mente.']
 ],
 pe:[
 ['Oportunidade material','Mão oferece pentáculo sobre jardim cercado.','Dê forma concreta à oportunidade que se apresenta.'],
 ['Adaptação e recursos','Figura equilibra duas moedas ligadas pelo infinito.','Ajuste prioridades sem perder flexibilidade.'],
 ['Ofício e colaboração','Artesão trabalha em construção enquanto duas pessoas observam.','Competência e cooperação produzem resultados melhores.'],
 ['Apego e segurança','Pessoa segura moedas junto ao corpo, pés e cabeça.','Construa segurança sem paralisar-se pelo medo de perder.'],
 ['Privação e apoio','Duas pessoas caminham na neve diante de vitral iluminado.','Reconheça necessidades e busque redes de apoio.'],
 ['Generosidade e equilíbrio','Figura distribui moedas enquanto segura uma balança.','Doe e receba com consciência das relações de poder.'],
 ['Paciência e avaliação','Pessoa observa arbusto carregado de pentáculos.','Avalie o investimento de longo prazo antes de colher.'],
 ['Aprendizagem pela prática','Artesão talha pentáculos repetidos num banco.','A excelência é cultivada pela repetição atenta.'],
 ['Autonomia e frutos','Pessoa caminha em jardim abundante com ave pousada.','Desfrute os frutos do trabalho sem perder a gratidão.'],
 ['Legado e continuidade','Família e ancião diante de arco cercado por moedas.','Pense no que sua realização deixa para outros.'],
 ['Interesse prático','Pajem contempla uma moeda com total atenção.','Aprenda algo útil e transforme curiosidade em método.'],
 ['Persistência e constância','Cavaleiro parado segura moeda diante de campo cultivado.','O avanço consistente pode ser mais eficaz que a pressa.'],
 ['Cuidado e prosperidade','Rainha segura moeda em trono cercado pela natureza.','Cuide do corpo, das pessoas e dos recursos disponíveis.'],
 ['Gestão e estabilidade','Rei segura cetro e pentáculo num trono ornamentado.','Administre a abundância com responsabilidade e visão.']
 ]
};
const TAROT = [
 ...MAJOR_DATA.map((r,i)=>({id:'ar'+String(i).padStart(2,'0'),type:'major',name:r[0],number:r[1],keywords:r[2],visual:r[3],message:r[4],path:i+11,letter:i,image:'ar'+String(i).padStart(2,'0')+'.jpg'})),
 ...SUITS.flatMap(s=>MINOR_MESSAGES[s.id].map((r,i)=>({id:s.id+String(i+1).padStart(2,'0'),type:'minor',name:(i===0?'Ás':i<=9?String(i+1):RANKS[i])+' de '+s.name,rank:i+1,suit:s.id,world:s.world,seph:i<10?i+1:null,court:i>=10?COURT_ELEMENTS[i-10]:null,keywords:r[0],visual:r[1],message:r[2],image:s.id+String(i+1).padStart(2,'0')+'.jpg'})))
];
const APP_DATA = {SEPHIROTH,WORLDS,PILLARS,LETTERS,TAROT,SUITS};
