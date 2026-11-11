/* ARCANA ATLAS — JavaScript puro, sem frameworks nem chamadas de API. */
(() => {
'use strict';
const {SEPHIROTH:S,WORLDS:W,PILLARS:P,LETTERS:L,TAROT:T,SUITS:U} = APP_DATA;
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const bySeph = id => S.find(s=>s.id===id);
const byWorld = id => W.find(w=>w.id===id);
const bySuit = id => U.find(s=>s.id===id);
const majorCard = i => T[i];
const sample = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = a => {const b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b;};
const safe = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const savedKey='arcana-atlas-v1';
const defaultState=()=>({letters:L.map(l=>l.id),cards:T.map(t=>t.id),stats:{},sessions:[],light:false,quizTypes:{},quizPreferences:{category:'all',count:10,orderSetting:'5'}});
let state=defaultState();
try{const raw=JSON.parse(localStorage.getItem(savedKey)||'null');if(raw && typeof raw==='object'){
  state={...state,...raw};state.letters=Array.isArray(raw.letters)?L.filter(l=>raw.letters.includes(l.id)).map(l=>l.id):state.letters;
  state.cards=Array.isArray(raw.cards)?T.filter(t=>raw.cards.includes(t.id)).map(t=>t.id):state.cards;
  state.stats=raw.stats&&typeof raw.stats==='object'?raw.stats:{};
  state.sessions=Array.isArray(raw.sessions)?raw.sessions.slice(-100):[];
  state.quizTypes=raw.quizTypes&&typeof raw.quizTypes==='object'&&!Array.isArray(raw.quizTypes)?raw.quizTypes:{};
  state.quizPreferences=raw.quizPreferences&&typeof raw.quizPreferences==='object'?{...defaultState().quizPreferences,...raw.quizPreferences}:defaultState().quizPreferences;
}}catch(e){console.warn('Dados locais indisponíveis:',e)}
// Preserva seleção de tipos específicos feita na V3. Só expande a seleção antiga
// se ela incluía realmente TODOS os tipos disponíveis na versão anterior.
if(!state.drawV4Migrated){
  if(Array.isArray(state.quizTypes?.all) && state.quizTypes.all.length===37 && !state.quizTypes.all.includes('draw-letter'))state.quizTypes.all.push('draw-letter');
  state.drawV4Migrated=true;
}
function persist(){try{localStorage.setItem(savedKey,JSON.stringify(state))}catch(e){toast('Não foi possível gravar no navegador.')}}
let currentDrawPad=null;
let route='home', filters={letters:'',lettersMode:'all',tarot:'',tarotMode:'all',settings:'',settingsGroup:'all'}, view={type:'seph',id:6}, session=null, toastTimer=null;
const nav=[['home','⌂','Visão geral'],['letters','א','Letras hebraicas'],['tarot','◈','Tarot Rider–Waite'],['seph','◉','As dez Sephiroth'],['worlds','◇','Os quatro mundos'],['pillars','♜','Os três pilares'],['correspondences','✺','Correspondências'],['quiz','✦','Modo quiz'],['settings','⚙','Configurações']];
const routes=Object.fromEntries(nav.map(n=>[n[0],n[2]]));
// V3: catálogo de modalidades. Cada pergunta tem um tipo estável, separado do conteúdo.
const QUESTION_TYPE_GROUPS=[
  {cat:'tree',title:'Jogo visual · Árvore da Vida',types:[
    ['tree-path','Número do caminho → marque duas Sephiroth'],
    ['tree-major','Imagem do Arcano Maior → marque duas Sephiroth']]},
  {cat:'drawing',title:'Lousa · desenhe as letras hebraicas',types:[
    ['draw-letter','Nome da letra → desenhe seu símbolo à mão']]},
  {cat:'ordering',title:'Jogo de ordenação',types:[
    ['ordering-down','Ordenar Arcanos · caminhos 11 → 32'],
    ['ordering-up','Ordenar Arcanos · caminhos 32 → 11']]},
  {cat:'paths',title:'Caminhos e Arcanos · múltipla escolha',types:[
    ['path-pair','Caminho → quais duas Sephiroth?'],
    ['major-pair','Arcano Maior → quais duas Sephiroth?']]},
  {cat:'letters',title:'Letras hebraicas e caminhos',types:[
    ['letter-glyph','Símbolo hebraico → nome da letra'],
    ['letter-symbol','Nome da letra → escolha o símbolo'],
    ['letter-path','Letra → número do caminho'],
    ['letter-path-to-name','Número do caminho → nome da letra'],
    ['letter-path-to-glyph','Número do caminho → apenas símbolos hebraicos'],
    ['letter-endpoints','Letra/caminho → duas Sephiroth'],
    ['letter-major','Letra → Arcano Maior'],
    ['letter-meaning','Letra → significado mnemônico']]},
  {cat:'tarot',title:'Tarot Rider–Waite–Smith',types:[
    ['tarot-path','Imagem de Arcano Maior → número do caminho'],
    ['tarot-letter','Arcano Maior → letra hebraica'],
    ['tarot-message','Mensagem → Arcano Maior'],
    ['tarot-image','Imagem → nome do Arcano Maior'],
    ['tarot-minor-message','Descrição → Arcano Menor'],
    ['tarot-minor-world','Arcano Menor → mundo'],
    ['tarot-minor-seph','Arcano Menor → Sephirah'],
    ['tarot-minor-combo','Mundo + Sephirah → Arcano Menor'],
    ['tarot-court','Carta da corte → elemento']]},
  {cat:'cabala',title:'Sephiroth e correspondências',types:[
    ['seph-num','Nome da Sephirah → número'],
    ['seph-name','Número → nome da Sephirah'],
    ['seph-hebrew','Nome → escrita em hebraico'],
    ['seph-planet','Sephirah → astro ou esfera'],
    ['seph-divine','Sephirah → nome divino'],
    ['seph-arch','Sephirah → arcanjo'],
    ['seph-choir','Sephirah → coro angélico'],
    ['seph-pillar','Sephirah → pilar']]},
  {cat:'worlds',title:'Os quatro mundos',types:[
    ['world-suit','Mundo → naipe'],
    ['world-name','Significado → nome do mundo'],
    ['world-element','Mundo → elemento'],
    ['world-level','Mundo → nível de manifestação']]},
  {cat:'pillars',title:'Os três pilares',types:[
    ['pillar-members','Pilar → Sephiroth que o compõem'],
    ['pillar-idea','Descrição → nome do pilar']]}
];
const QUESTION_TYPE_LOOKUP=Object.fromEntries(QUESTION_TYPE_GROUPS.map(g=>[g.cat,g.types.map(([id,label])=>({id,label}))]));
const QUESTION_TYPE_BY_PREFIX=QUESTION_TYPE_GROUPS.flatMap(g=>g.types.map(([id])=>({cat:g.cat,id}))).sort((a,b)=>b.id.length-a.id.length);
function inferQuestionType(q){return QUESTION_TYPE_BY_PREFIX.find(t=>t.cat===q.cat&&q.key.startsWith(t.id+'-'))?.id||null}
function typeGroupsFor(cat){return cat==='all'?QUESTION_TYPE_GROUPS:QUESTION_TYPE_GROUPS.filter(g=>g.cat===cat)}
function allTypeIds(cat){return typeGroupsFor(cat).flatMap(g=>g.types.map(t=>t[0]))}
function selectedTypes(cat){
  const valid=allTypeIds(cat),stored=state.quizTypes?.[cat];
  if(!Array.isArray(stored))return valid;
  // V3 -> V4: if the user had selected every old type, keep 'all' active for new types.
  if(!state.drawV4Migrated && (cat==='all'||cat==='drawing') && stored.length>=37 && valid.every(id=>id==='draw-letter'||stored.includes(id)))return valid;
  return valid.filter(id=>stored.includes(id));
}
function chosenQuizCategory(){const cat=state.quizPreferences?.category;return cat==='all'||QUESTION_TYPE_LOOKUP[cat]?cat:'all'}
function typeSummary(cat){const total=allTypeIds(cat).length,n=selectedTypes(cat).length;return !n?'Nenhum tipo selecionado':n===total?`Todos os ${total} tipos de pergunta`:`${n} de ${total} tipos selecionados`}
function questionTypePicker(cat){
  const current=new Set(selectedTypes(cat)),total=allTypeIds(cat).length;
  return `<div class="form-group" id="quiz-type-field"><label id="q-type-label">Tipo de pergunta <span class="type-optional">(escolha um ou vários)</span></label>
    <details class="question-types" id="q-type-picker"><summary id="q-type-summary" aria-labelledby="q-type-label"><span class="type-summary-text">${typeSummary(cat)}</span><span class="type-summary-icon" aria-hidden="true">⌄</span></summary>
    <div class="type-dropdown" role="group" aria-label="Tipos de perguntas disponíveis">
    <label class="type-all"><input type="checkbox" id="q-type-all" ${current.size===total?'checked':''}><span>Todos os tipos de pergunta</span><small>${total} opções</small></label>
    <div class="type-scroll">${typeGroupsFor(cat).map(g=>`<section class="type-group"><h4>${safe(g.title)}</h4>${g.types.map(([id,label])=>`<label class="type-option"><input type="checkbox" data-q-type="${id}" ${current.has(id)?'checked':''}><span>${safe(label)}</span></label>`).join('')}</section>`).join('')}</div>
    </div></details><p class="type-hint" id="q-type-hint">${cat==='all'?'Personalize a mistura de todas as categorias.':'A seleção fica salva para esta categoria.'} <span id="q-available">${eligibleQuizQuestions(cat).length}</span> desafios disponíveis com seus filtros.</p></div>`;
}
function eligibleQuizQuestions(category){
  const enabledTypes=new Set(selectedTypes(category));
  const countMajor=T.filter(c=>c.type==='major'&&state.cards.includes(c.id)).length;
  const sizeStr=state.quizPreferences?.orderSetting||'5';
  const chosenSize=sizeStr==='all'?countMajor:Math.min(Number(sizeStr)||5,countMajor);
  return availableQuestions().filter(q=>(category==='all'||q.cat===category)&&enabledTypes.has(q.type)&&
    (q.cat!=='ordering'||(category==='all'?q.orderSize===Math.min(5,countMajor):q.orderSize===chosenSize)));
}
function refreshTypePicker(){
  const cat=$('#q-category')?.value;if(!cat)return;
  const selected=new Set(selectedTypes(cat)),all=allTypeIds(cat);
  $('#q-type-summary .type-summary-text').textContent=typeSummary(cat);
  const allControl=$('#q-type-all');if(allControl){allControl.checked=selected.size===all.length;allControl.indeterminate=selected.size>0&&selected.size<all.length;}
  $$('input[data-q-type]').forEach(input=>input.checked=selected.has(input.dataset.qType));
  const available=eligibleQuizQuestions(cat).length;
  $('#q-available').textContent=String(available);
  const start=$('[data-start-quiz]');if(start)start.disabled=available===0;
}
function rememberQuizForm(){
  if(!$('#q-category'))return;
  state.quizPreferences={category:$('#q-category').value,count:Number($('#q-count').value)||10,orderSetting:$('#q-order-size').value};
  persist();
}

function closeMenu(){$('#sidebar').classList.remove('open')}
function navRender(){ $('#navigation').innerHTML=nav.map((n,i)=>`${i===7?'<div class="nav-separator"></div>':''}<button class="nav-item ${n[0]===route?'active':''}" data-route="${n[0]}"><span class="nav-icon">${n[1]}</span>${n[2]}</button>`).join(''); }
function go(to){if(!routes[to])return;route=to;$('#modal-root').innerHTML='';closeMenu();render();window.scrollTo({top:0,behavior:'instant'});}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
function header(title,kicker,subtitle){return `<p class="eyebrow">${kicker}</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p>`}
function tag(x,cls=''){return `<span class="tag ${cls}">${safe(x)}</span>`}
function formatPath(l){return `${bySeph(l.from).name} ↔ ${bySeph(l.to).name}`}
function scopeMetrics(){let items=Object.values(state.stats);let attempts=items.reduce((a,b)=>a+(b.attempts||0),0),correct=items.reduce((a,b)=>a+(b.correct||0),0);return {attempts,correct,percent:attempts?Math.round(correct/attempts*100):0};}
function imageHTML(card, className='tarot-image'){let local='assets/cards/'+card.image, remote='https://petaloverflow.github.io/tarot-api/cards/'+card.image;return `<img class="${className}" src="${local}" data-remote="${remote}" alt="Ilustração do ${safe(card.name)} — Rider–Waite–Smith" loading="lazy">`}
function quizImageHTML(card){let local='assets/cards/'+card.image, remote='https://petaloverflow.github.io/tarot-api/cards/'+card.image;return `<img class="tarot-image" src="${local}" data-remote="${remote}" alt="Ilustração da carta mostrada na questão" loading="eager">`}
const coords={1:[195,48],2:[306,143],3:[84,143],4:[306,263],5:[84,263],6:[195,349],7:[306,454],8:[84,454],9:[195,552],10:[195,655]};
function treeSVG(activeSeph=null,activePath=null,interactive=true,quizOptions=null){
  const quiz=!!quizOptions;
  const selected=quizOptions?.selected||[];
  const correct=quizOptions?.correct||[];
  const revealed=!!quizOptions?.reveal;
  const edges=L.map(l=>{
    const [x1,y1]=coords[l.from],[x2,y2]=coords[l.to],focus=l.path===activePath;
    return `<g><line class="tree-edge ${focus?'active':''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="tree-edge ${quiz?'':'hit'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${interactive&&!quiz?`data-tree-path="${l.path}"`:''}><title>Caminho ${l.path} · ${l.name} · ${formatPath(l)}</title></line></g>`;
  }).join('');
  const nodes=S.map(s=>{
    const [x,y]=coords[s.id];
    const isSelected=selected.includes(s.id),isCorrect=correct.includes(s.id);
    const klass=quiz?(revealed?(isCorrect?'quiz-correct':isSelected?'quiz-incorrect':''):(isSelected?'quiz-picked':'')):(activeSeph===s.id?'active':'');
    const attrs=quiz?`data-quiz-seph="${s.id}" role="button" tabindex="${revealed?'-1':'0'}" aria-pressed="${isSelected}" aria-label="${s.name}${isSelected?', selecionada':''}"`:(interactive?`data-tree-seph="${s.id}" role="button" tabindex="0" aria-label="Ver ${s.name}"`:'');
    return `<g class="tree-node ${klass}" transform="translate(${x} ${y})" ${attrs}><circle class="tree-node-ring" r="24"/><text text-anchor="middle" dominant-baseline="central" font-family="Georgia" font-size="17">${s.id}</text><text class="tree-label" x="0" y="40" text-anchor="middle">${s.name}</text><title>${s.name} · ${s.meaning}</title></g>`;
  }).join('');
  return `<svg class="tree-svg ${quiz?'tree-quiz-svg':''}" viewBox="0 0 390 708" xmlns="http://www.w3.org/2000/svg" role="${quiz?'group':'img'}" aria-label="Árvore da Vida: dez Sephiroth ligadas por 22 caminhos"><g>${edges}${nodes}</g></svg>`;
}
function home(){let m=scopeMetrics();let modules=[['letters','א','Alfabeto hebraico','22 letras, desenhos, números, significados e seus caminhos.'],['tarot','♜','Tarot Rider–Waite','As 78 cartas e suas leituras simbólicas e relações herméticas.'],['seph','◉','As dez Sephiroth','Nomes hebraicos, significado, posição e função.'],['worlds','◇','Os quatro mundos','Emanação, Criação, Formação e Ação.'],['pillars','⚖','Os três pilares','Misericórdia, Severidade e Equilíbrio.'],['correspondences','✧','Correspondências','Esferas, nomes divinos, arcanjos e ordens angélicas.']];
 return `<section class="hero"><div class="hero-copy"><p class="eyebrow">✦ O SEU ESPAÇO DE ESTUDO</p><h1>O universo dos <em>símbolos</em>, em suas mãos.</h1><p>Aprenda os fundamentos da Cabala Hermética, explore o Tarot Rider–Waite–Smith e memorize as correspondências com exercícios personalizados.</p><div class="hero-actions"><button class="btn" data-route="quiz">Iniciar prática <span>↗</span></button><button class="btn secondary" data-route="letters">Explorar o alfabeto</button></div></div><div class="hero-viz">${treeSVG(null,null,true)}</div></section>
 <div class="stat-strip"><div class="stat"><strong>22</strong><span>letras hebraicas</span></div><div class="stat"><strong>78</strong><span>cartas do tarot</span></div><div class="stat"><strong>${m.attempts}</strong><span>questões respondidas</span></div><div class="stat"><strong>${m.percent}%</strong><span>acerto histórico</span></div></div>
 <div class="section-head"><div><h2>Biblioteca de conhecimento</h2><p>Escolha uma trilha para começar o seu estudo.</p></div><span class="pill-count">6 cursos</span></div>
 <div class="module-grid">${modules.map(x=>`<button class="module-card" data-route="${x[0]}"><span class="module-icon">${x[1]}</span><h3>${x[2]}</h3><p>${x[3]}</p><span class="arrow">Explorar módulo ↗</span></button>`).join('')}</div>
 <div class="note"><strong>Convenção utilizada:</strong> árvore e correspondências da tradição hermética da Golden Dawn; Tarot Rider–Waite–Smith (RWS). Diferentes correntes da Cabala e diferentes baralhos apresentam associações alternativas. A abordagem aqui é histórica e simbólica, não uma afirmação científica sobre planetas ou entidades.</div>`;
}
function letterTile(l){let active=state.letters.includes(l.id);return `<button class="entry-card letter-card" data-open-letter="${l.id}"><div class="letter-glyph" lang="he" dir="rtl">${l.he}</div><div class="letter-name">${l.name}</div><div class="letter-caption">${safe(l.symbolic)} · ${l.gematria}</div><div class="letter-footer"><span>Caminho ${l.path}</span><span><i class="status-dot ${active?'':'off'}"></i>${active?'No quiz':'Pausada'}</span></div></button>`}
function letterResults(){let q=filters.letters.toLocaleLowerCase('pt-BR').trim();let arr=L.filter(l=>(l.name+' '+l.he+' '+l.symbolic+' '+l.path+' '+formatPath(l)).toLocaleLowerCase('pt-BR').includes(q));if(filters.lettersMode==='active')arr=arr.filter(l=>state.letters.includes(l.id));if(filters.lettersMode==='off')arr=arr.filter(l=>!state.letters.includes(l.id));return arr.length?arr.map(letterTile).join(''):'<div class="empty">Nenhuma letra encontrada para estes filtros.</div>'}
function lettersPage(){return header('As 22 letras hebraicas','CURSO 01 · ALFABETO','Cada letra possui forma, nome, valor numérico tradicional e, na Cabala Hermética, uma associação a um dos 22 caminhos da Árvore da Vida.')+`<div class="note"><strong>Para não confundir:</strong> os significados pictográficos são associações mnemônicas históricas, não traduções literais do hebraico moderno. O alfabeto é escrito da direita para a esquerda. A numeração dos caminhos de 11 a 32 é a da escola hermética.</div><div class="toolbar"><input class="field search" id="letters-search" placeholder="Buscar por nome, símbolo ou caminho…" value="${safe(filters.letters)}" aria-label="Pesquisar letras"><div class="segmented" id="letters-filter">${[['all','Todas'],['active','No quiz'],['off','Pausadas']].map(([id,label])=>`<button class="${filters.lettersMode===id?'active':''}" data-filter-letters="${id}">${label}</button>`).join('')}</div></div><div id="letter-results" class="cards-grid">${letterResults()}</div>`}
function tarotTile(c){let subtitle=c.type==='major'?`Arcano maior · ${c.number}`:`${bySuit(c.suit).name} · ${c.rank<=10?'Número '+c.rank:'Corte'}`;return `<button class="entry-card tarot-card" data-open-tarot="${c.id}">${imageHTML(c)}<div class="tarot-caption"><strong>${safe(c.name)}</strong><small>${subtitle}</small></div></button>`}
function tarotResults(){let q=filters.tarot.toLocaleLowerCase('pt-BR').trim();let arr=T.filter(c=>(c.name+' '+c.keywords+' '+(c.suit?bySuit(c.suit).name:'')).toLocaleLowerCase('pt-BR').includes(q));if(filters.tarotMode==='major')arr=arr.filter(c=>c.type==='major');if(filters.tarotMode==='minor')arr=arr.filter(c=>c.type==='minor');if(filters.tarotMode==='active')arr=arr.filter(c=>state.cards.includes(c.id));return arr.length?arr.map(tarotTile).join(''):'<div class="empty">Nenhuma carta encontrada.</div>'}
function tarotPage(){return header('O Tarot Rider–Waite–Smith','CURSO 02 · OS 78 ARCANOS','Explore as imagens e as mensagens de cada carta, além dos caminhos das maiores e das correspondências dos menores com as Sephiroth e os mundos.')+`<div class="note"><strong>Regra central:</strong> Arcanos Maiores ↔ 22 caminhos ↔ 22 letras. Cartas numeradas (Ás a 10) ↔ Sephiroth 1–10 em cada mundo/naipe. Cartas da corte ↔ aspectos elementais do naipe, sem equivalência única e obrigatória a uma Sephirah. No RWS a Força é VIII e a Justiça é XI.</div><div class="toolbar"><input class="field search" id="tarot-search" placeholder="Buscar por carta, assunto ou naipe…" value="${safe(filters.tarot)}" aria-label="Pesquisar cartas"><div class="segmented" id="tarot-filter">${[['all','Todas'],['major','Maiores'],['minor','Menores'],['active','No quiz']].map(([id,label])=>`<button class="${filters.tarotMode===id?'active':''}" data-filter-tarot="${id}">${label}</button>`).join('')}</div></div><div class="tarot-grid" id="tarot-results">${tarotResults()}</div>`}
function sephTile(s){return `<button class="entry-card seph-card" data-open-seph="${s.id}"><div class="seph-card-top"><span class="seph-number">${String(s.id).padStart(2,'0')}</span><span class="hebrew" lang="he" dir="rtl">${s.he}</span></div><h3>${s.name}</h3><p>${s.meaning}</p><div class="seph-tags">${tag(s.planet)}${tag(s.pillar)}</div></button>`}
function sephDetails(s){return `<p class="eyebrow">SEPHIRAH ${String(s.id).padStart(2,'0')} <span class="hebrew" lang="he">${s.he}</span></p><h3>${s.name}</h3><p>${s.meaning}</p><div class="fact"><span>Esfera simbólica</span><strong>${s.planet}</strong></div><div class="fact"><span>Pilar</span><strong>${s.pillar}</strong></div><div class="fact"><span>Nome divino</span><strong>${s.divine}</strong></div><div class="fact"><span>Arcanjo</span><strong>${s.arch}</strong></div><div class="fact"><span>Coro angélico</span><strong>${s.choir}</strong></div><h3 style="font-size:18px;margin-top:22px">Princípio e aprendizado</h3><p class="body-text">${s.lesson}</p><p class="body-text"><strong class="gold">Potencial:</strong> ${s.virtue}<br><strong class="gold">Desequilíbrio:</strong> ${s.shadow}</p><button class="btn small" data-open-seph="${s.id}">Ler mais ↗</button>`}
function sephPage(){return header('As dez Sephiroth','CURSO 03 · ÁRVORE DA VIDA','As dez emanações são pontos de um mapa simbólico de princípios espirituais e psicológicos. Selecione uma esfera ou uma conexão para conhecer suas associações.')+`<div class="split-layout"><div class="tree-box">${treeSVG(view.type==='seph'?view.id:null,view.type==='path'?view.id:null)}</div><div class="details-card" id="tree-inspector">${view.type==='path'?pathDetailsInline(L.find(l=>l.path===view.id)):sephDetails(bySeph(view.id)||S[5])}</div></div><div class="section-head"><div><h2>Conheça cada esfera</h2><p>Os nomes hebraicos e seus significados tradicionais.</p></div></div><div class="cards-grid seph-grid">${S.map(sephTile).join('')}</div>`}
function pathDetailsInline(l){return `<p class="eyebrow">CAMINHO ${l.path}</p><h3><span class="hebrew" lang="he">${l.he}</span> ${l.name}</h3><p>Conecta ${formatPath(l)}</p><div class="fact"><span>Arcano</span><strong>${majorCard(l.major).name}</strong></div><div class="fact"><span>Atribuição</span><strong>${l.astro}</strong></div><div class="fact"><span>Imagem tradicional</span><strong>${l.symbolic}</strong></div><h3 style="font-size:18px;margin-top:22px">Síntese</h3><p class="body-text">${l.lesson}</p><button class="btn small" data-open-letter="${l.id}">Estudar a letra ↗</button>`}
function worldTile(w,i){return `<article class="content-card world-card"><div class="world-number">MUNDO ${String(i+1).padStart(2,'0')} <span class="hebrew" lang="he" dir="rtl">${w.he}</span></div><h2>${w.name}</h2><p class="gold">${w.meaning} · ${w.element}</p><p>${w.description}</p><div class="chips">${tag(w.suit+' · '+w.element,'gold')}${tag(w.divLevel)}</div><div class="world-bottom"><p><strong>Exemplo:</strong> ${w.example}</p><p><strong>Reflexão:</strong> ${w.practice}</p><button class="btn ghost small" data-route="tarot">Ver as cartas de ${w.suit} ↗</button></div></article>`}
function worldsPage(){return header('Os quatro mundos','CURSO 04 · EMANAÇÃO ATÉ A AÇÃO','Na Cabala Hermética, os quatro mundos representam níveis de manifestação. No estudo do Tarot, cada naipe dos Arcanos Menores simboliza um desses níveis.')+`<div class="world-grid">${W.map(worldTile).join('')}</div><div class="section-head"><div><h2>Uma mesma Sephirah em quatro mundos</h2><p>Exemplo: Chesed (4) — quatro manifestações simbólicas.</p></div></div><div class="study-list">${U.map(s=>`<div class="study-row"><div class="study-index">4</div><div><h3>4 de ${s.name} <span class="gold">· ${byWorld(s.world).name}</span></h3><p>Chesed, a expansão estruturada, no campo de ${s.key}.</p></div><button class="btn tiny ghost" data-open-tarot="${s.id}04">Abrir carta</button></div>`).join('')}</div><div class="note"><strong>Distinção:</strong> os mundos não são quatro Sephiroth isoladas; no modelo hermético, cada mundo comporta uma Árvore da Vida inteira. Os quatro naipes são uma maneira de estudar essas relações.</div>`}
function pillarsPage(){return header('Os três pilares','CURSO 05 · AS POLARIDADES','Os pilares organizam as Sephiroth em três linhas: expansão, estrutura e integração. A posição “direita” ou “esquerda” refere-se ao diagrama apresentado.')+`<div class="pillar-grid">${P.map((p,i)=>`<article class="content-card pillar-card"><div class="big-icon">${i===0?'❧':i===1?'◈':'♜'}</div><p class="eyebrow">${p.side.toUpperCase()}</p><h2>${p.name}</h2><div class="chips">${tag(p.alt,'gold')}</div><p>${p.summary}</p><h3 class="serif gold">Sephiroth do pilar</h3><p>${p.ids.map(n=>`${n} · ${bySeph(n).name}`).join('<br>')}</p><p><strong>Atenção:</strong> ${p.risk}</p><p><strong>Harmonia:</strong> ${p.balance}</p></article>`).join('')}</div><div class="section-head"><h2>Visualização dos pilares</h2></div><div class="split-layout"><div class="tree-box">${treeSVG()}</div><article class="content-card details-card"><h3>A dinâmica da Árvore</h3><p class="body-text">O pilar da Misericórdia estimula expansão e expressão. O da Severidade oferece contenção, critério e limites. O do Meio articula esses princípios em um processo de integração, da unidade de Kether até a expressão material de Malkuth.</p><p class="body-text">Na representação habitual da Árvore, <strong>Chokmah, Chesed e Netzach</strong> aparecem à sua direita; <strong>Binah, Geburah e Hod</strong>, à esquerda; <strong>Kether, Tiphareth, Yesod e Malkuth</strong>, no centro.</p><p class="body-text">O propósito do modelo é contemplar forças complementares, não classificar pessoas como pertencentes permanentemente a um pilar.</p></article></div>`}
function corrPage(){return header('As correspondências','CURSO 06 · TABELAS DE REFERÊNCIA','Uma consulta rápida das dez Sephiroth: número, esfera celeste ou elementar, nome divino, arcanjo, ordem angélica e pilar.')+`<div class="table-wrap"><table><thead><tr><th>#</th><th>Sephirah</th><th>Nome hebraico</th><th>Esfera / astro</th><th>Nome divino</th><th>Arcanjo</th><th>Coro angélico</th><th>Pilar</th></tr></thead><tbody>${S.map(s=>`<tr><td>${s.id}</td><td><button class="text-link" data-open-seph="${s.id}">${s.name}</button></td><td><span class="hebrew" lang="he" dir="rtl">${s.he}</span></td><td>${s.planet}</td><td>${s.divine}</td><td>${s.arch}</td><td>${s.choir}</td><td>${s.pillar}</td></tr>`).join('')}</tbody></table></div><div class="note"><strong>Nota de estudo:</strong> as associações são da Cabala Hermética/Golden Dawn e as grafias transliteradas variam (como Tzaphqiel/Tzaphkiel ou Kamael/Khamael). Arcanjo da Sephirah não é necessariamente o mesmo que anjo da esfera planetária em outras tabelas.</div><div class="section-head"><h2>Como memorizar</h2></div><div class="study-list"><div class="study-row"><span class="study-index">01</span><div><h3>Primeiro, domine números e posições</h3><p>Do 1 (Kether) ao 10 (Malkuth), e seus pilares.</p></div></div><div class="study-row"><span class="study-index">02</span><div><h3>Associe astros e princípios</h3><p>Por exemplo: 8 · Hod · Mercúrio · linguagem e intelecto.</p></div></div><div class="study-row"><span class="study-index">03</span><div><h3>Acrescente nome divino e arcanjo</h3><p>Por exemplo: Hod · Elohim Tzabaoth · Michael.</p></div></div></div>`}
function letterModal(l){let card=majorCard(l.major),active=state.letters.includes(l.id);return modalShell(`Letra ${l.name}`,`Caminho ${l.path}`,`<div class="modal-split"><div><div class="modal-glyph hebrew" lang="he" dir="rtl">${l.he}</div><div class="center" style="margin-top:13px">${tag('Gematria '+l.gematria,'gold')} ${tag(l.astro)}</div></div><div class="modal-text"><div class="chips">${tag('Caminho '+l.path,'gold')}${tag(formatPath(l))}</div><h3>Forma e pronúncia</h3><p><strong>${l.pronunciation}</strong> · ${l.shape}</p><h3>Imagem e significado tradicional</h3><p>${l.symbolic}. Essas imagens são recursos históricos de memorização e não um sentido literal obrigatório no hebraico contemporâneo.</p><h3>Interpretação hermética</h3><p>${l.lesson}</p><h3>Tarot correspondente</h3><div class="flex-gap">${imageHTML(card,'tarot-image')}<div><strong>${card.name} · ${card.number}</strong><p>${card.keywords}</p><button class="btn small ghost" data-open-tarot="${card.id}">Ver a carta ↗</button></div></div><div class="modal-actions"><button class="btn ${active?'secondary':''}" data-toggle-letter="${l.id}">${active?'Pausar esta letra no quiz':'Ativar esta letra no quiz'}</button></div></div></div>`)}
function tarotModal(c){let major=c.type==='major',l=major?L[c.letter]:null, w=major?null:byWorld(c.world),s=major?null:bySuit(c.suit), sp=major?null:bySeph(c.seph);let active=state.cards.includes(c.id);
let desc=major?`<h3>Correspondência hermética</h3><p><strong>Caminho ${c.path}</strong>: ${formatPath(l)}<br>Letra: <span class="hebrew" lang="he">${l.he}</span> ${l.name} · ${l.astro}</p><p><strong>Observação:</strong> no RWS as cartas VIII e XI são A Força e A Justiça, conforme esta atribuição da Golden Dawn.</p>`:`<h3>Correspondência hermética</h3><p><strong>Naipe:</strong> ${s.name} · elemento ${s.element}<br><strong>Mundo:</strong> ${w.name} (${w.meaning})</p>${sp?`<p><strong>Sephirah:</strong> ${sp.id} · ${sp.name} (${sp.meaning}) em ${w.name}.</p>`:`<p><strong>Carta da corte:</strong> aspecto de ${c.court} dentro do elemento ${s.element}. Não há atribuição universal de cada figura a um único caminho ou uma única Sephirah; escolas diferentes distribuem seus títulos e aspectos de formas distintas.</p>`}`;
return modalShell(c.name,major?`ARCANO MAIOR ${c.number}`:`ARCANO MENOR · ${s.name}`,`<div class="modal-split"><div>${imageHTML(c)}<p class="center subtle" style="font-size:11px">Pamela Colman Smith · 1909</p></div><div class="modal-text"><div class="chips">${tag(major?'Arcano maior':'Arcano menor','gold')}${tag(c.keywords)}</div><h3>O que aparece na imagem</h3><p>${c.visual}</p><h3>Mensagem central</h3><p>${c.message}</p>${desc}<div class="modal-actions"><button class="btn ${active?'secondary':''}" data-toggle-card="${c.id}">${active?'Pausar esta carta no quiz':'Ativar esta carta no quiz'}</button>${major?`<button class="btn ghost" data-open-letter="${l.id}">Ver ${l.name} ${l.he} ↗</button>`:sp?`<button class="btn ghost" data-open-seph="${sp.id}">Ver ${sp.name} ↗</button>`:''}</div></div></div>`)}
function sephModal(s){return modalShell(`${s.id}. ${s.name}`,s.meaning,`<div class="modal-split"><div><div class="modal-glyph hebrew" lang="he" dir="rtl">${s.he}</div><p class="center muted">Nome hebraico de ${s.name}</p><div class="mini-tree center">${treeSVG(s.id,null,false)}</div></div><div class="modal-text"><div class="chips">${tag('Sephirah '+s.id,'gold')}${tag(s.pillar)}${tag(s.planet)}</div><h3>Princípio</h3><p>${s.lesson}</p><h3>Potência e desequilíbrio</h3><p><strong>Potencial:</strong> ${s.virtue}<br><strong>Sombra simbólica:</strong> ${s.shadow}</p><h3>Correspondências da Golden Dawn</h3><p><strong>Nome divino:</strong> ${s.divine}<br><strong>Arcanjo:</strong> ${s.arch}<br><strong>Coro angélico:</strong> ${s.choir}<br><strong>Esfera:</strong> ${s.planet}</p><h3>Arcanos Menores numerados</h3><p>${s.id===1?'Os quatro ases':`As quatro cartas de número ${s.id}`} representam ${s.name} nos quatro mundos:</p><div class="flex-gap">${U.map(u=>`<button class="btn ghost tiny" data-open-tarot="${u.id}${String(s.id).padStart(2,'0')}">${s.id===1?'Ás':s.id} de ${u.name}</button>`).join('')}</div></div></div>`)}
function modalShell(title,kicker,body){return `<div class="modal-shade" id="modal-overlay" role="presentation"><article class="modal-card" role="dialog" aria-modal="true" aria-label="${safe(title)}"><header class="modal-head"><div><small>${safe(kicker)}</small><h2>${safe(title)}</h2></div><button class="modal-close" data-close-modal aria-label="Fechar janela">×</button></header><div class="modal-body">${body}</div></article></div>`}
function showModal(type,id){let body=type==='letter'?letterModal(L.find(l=>l.id===id)):type==='tarot'?tarotModal(T.find(c=>c.id===id)):sephModal(bySeph(Number(id)));if(!body)return;$('#modal-root').innerHTML=body;$('#modal-root .modal-close')?.focus();document.body.style.overflow='hidden';}
function hideModal(){document.body.style.overflow='';$('#modal-root').innerHTML='';}
function quizStartPage(){
  let m=scopeMetrics();
  const orderedMajor=T.filter(c=>c.type==='major'&&state.cards.includes(c.id)).length;
  const chosenCat=chosenQuizCategory(),prevCount=Number(state.quizPreferences?.count)||10,prevOrder=state.quizPreferences?.orderSetting||'5';
  return header('Treine seu conhecimento','PRÁTICA · QUIZ INTERATIVO','Identifique letras, desenhe símbolos hebraicos à mão, ligue caminhos às Sephiroth e ordene os Arcanos.')+`
  <div class="quiz-feature-grid">
    <div class="quiz-feature"><span>◉</span><strong>Encontre as duas Sephiroth</strong><p>Veja um caminho ou a imagem de um Arcano Maior e marque as duas esferas diretamente na árvore.</p></div>
    <div class="quiz-feature"><span>✍</span><strong>Desenhe o alfabeto hebraico</strong><p>Use o mouse, o dedo ou a caneta e compare seu desenho com a forma impressa de cada letra.</p></div>
    <div class="quiz-feature"><span>↕</span><strong>Ordene os Arcanos</strong><p>Reorganize as cartas do caminho 11 ao 32 ou do 32 ao 11. Arraste no computador ou use as setas.</p></div>
    <div class="quiz-feature"><span>◇</span><strong>Associe caminhos e cartas</strong><p>Responda perguntas de múltipla escolha sobre os pares de Sephiroth de cada caminho e Arcano Maior.</p></div>
  </div>
  <div class="quiz-start"><div class="content-card quiz-config"><h3>Prepare sua sessão</h3>
  <div class="form-group"><label for="q-category">Conteúdo ou modalidade</label><select id="q-category" class="field">
    <option value="all" ${chosenCat==='all'?'selected':''}>Misturar todas as categorias</option>
    <option value="tree" ${chosenCat==='tree'?'selected':''}>Jogo visual · encontre as duas Sephiroth</option>
    <option value="drawing" ${chosenCat==='drawing'?'selected':''}>✍ Lousa · desenhar letras hebraicas</option>
    <option value="ordering" ${chosenCat==='ordering'?'selected':''}>Jogo de ordenação · Arcanos Maiores</option>
    <option value="paths" ${chosenCat==='paths'?'selected':''}>Caminhos e Arcanos · múltipla escolha</option>
    <option value="letters" ${chosenCat==='letters'?'selected':''}>Letras hebraicas e caminhos</option>
    <option value="tarot" ${chosenCat==='tarot'?'selected':''}>Tarot (Maiores e Menores)</option>
    <option value="cabala" ${chosenCat==='cabala'?'selected':''}>Sephiroth e correspondências</option>
    <option value="worlds" ${chosenCat==='worlds'?'selected':''}>Quatro mundos</option>
    <option value="pillars" ${chosenCat==='pillars'?'selected':''}>Três pilares</option>
  </select></div>
  ${questionTypePicker(chosenCat)}
  <div class="form-group" id="order-config" ${chosenCat==='ordering'?'':'hidden'}><label for="q-order-size">Cartas por desafio</label><select id="q-order-size" class="field"><option value="5" ${prevOrder==='5'?'selected':''}>Até 5 cartas por desafio</option><option value="8" ${prevOrder==='8'?'selected':''}>Até 8 cartas por desafio</option><option value="all" ${prevOrder==='all'?'selected':''}>Todas as cartas maiores habilitadas (${orderedMajor})</option></select>
    <p class="type-hint">Escolha a direção no seletor <strong>Tipo de pergunta</strong>: 11 → 32, 32 → 11 ou ambas.</p></div>
  <div class="form-group"><label for="q-count">Quantidade de perguntas</label><select id="q-count" class="field"><option value="5" ${prevCount===5?'selected':''}>5 questões · revisão rápida</option><option value="10" ${prevCount===10?'selected':''}>10 questões · sessão padrão</option><option value="20" ${prevCount===20?'selected':''}>20 questões · prática intensa</option><option value="40" ${prevCount===40?'selected':''}>40 questões · maratona</option></select></div>
  <div class="note"><strong>Seu filtro:</strong> ${state.letters.length} letras, ${state.cards.length} cartas e ${orderedMajor} Arcanos Maiores habilitados. Caminhos na árvore usam as letras ativas; desafios com imagens e ordenação usam Arcanos Maiores ativos. A ordem segue a numeração hermética 11–32, não a altura geométrica de cada linha da árvore.</div>
  <div class="flex-gap"><button class="btn" data-start-quiz ${eligibleQuizQuestions(chosenCat).length?'':'disabled'}>Começar sessão ✦</button><button class="btn ghost" data-route="settings">Configurar conteúdo ⚙</button></div></div>
  <aside class="content-card quiz-tips"><div class="ornament">✧</div><h3>Aprenda praticando.</h3><p>Além das perguntas tradicionais, experimente a lousa de escrita hebraica no mouse ou no celular. A avaliação é estimativa, feita no navegador, sem IA nem envio de desenhos.</p><div class="fact"><span>Modelos de desafio ativos</span><strong>${availableQuestions().length}</strong></div><div class="fact"><span>Respostas até agora</span><strong>${m.attempts}</strong></div><div class="fact"><span>Aproveitamento</span><strong>${m.percent}%</strong></div><div class="fact"><span>Cartas habilitadas</span><strong>${state.cards.length} / 78</strong></div><div class="fact"><span>Letras habilitadas</span><strong>${state.letters.length} / 22</strong></div></aside></div>`;
}
function opt(correct,other){let u=[...new Set([correct,...other].map(String))];return shuffle([correct,...shuffle(u.filter(x=>x!==String(correct))).slice(0,3)]).map(String)}
function question(key,cat,prompt,answer,distractors,explanation,extra={}){let options=opt(String(answer),distractors);if(options.length<2)return null;return {key,cat,prompt,answer:String(answer),options,explanation,...extra}}
function availableQuestions(){let bank=[];const append=q=>{if(q){q.type=inferQuestionType(q);if(!q.type)throw Error('Tipo de pergunta não identificado: '+q.key);bank.push(q)}};const eligibleLetters=L.filter(l=>state.letters.includes(l.id)),eligibleCards=T.filter(c=>state.cards.includes(c.id)),selectedMajor=eligibleCards.filter(c=>c.type==='major'),selectedMinor=eligibleCards.filter(c=>c.type==='minor'),selectedNumbered=selectedMinor.filter(c=>c.seph);
if(eligibleLetters.length){for(let l of eligibleLetters){let m=majorCard(l.major);append(question(`letter-glyph-${l.id}`,'letters','Qual é o nome desta letra hebraica?',l.name,L.filter(x=>x.id!==l.id).map(x=>x.name),`${l.he} é ${l.name}, com valor ${l.gematria} e caminho ${l.path}.`,{glyph:l.he,subject:'letter:'+l.id}));append(question(`letter-symbol-${l.id}`,'letters',`Qual destas letras é ${l.name}?`,l.he,L.filter(x=>x.id!==l.id).map(x=>x.he),`${l.name} corresponde ao símbolo ${l.he} e ao caminho ${l.path}.`,{subject:'letter:'+l.id,hebrewOptions:true}));append(question(`letter-path-to-name-${l.id}`,'letters',`Qual letra hebraica corresponde ao caminho ${l.path}?`,l.name,L.filter(x=>x.id!==l.id).map(x=>x.name),`O caminho ${l.path} corresponde a ${l.name} (${l.he}), conectando ${formatPath(l)}.`,{subject:'letter:'+l.id}));append(question(`letter-path-to-glyph-${l.id}`,'letters',`Qual símbolo hebraico corresponde ao caminho ${l.path}?`,l.he,L.filter(x=>x.id!==l.id).map(x=>x.he),`O caminho ${l.path} é representado pela letra ${l.name} (${l.he}), que conecta ${formatPath(l)}.`,{subject:'letter:'+l.id,hebrewOptions:true}));append(question(`letter-path-${l.id}`,'letters',`Qual caminho da Árvore da Vida está associado a ${l.name} (${l.he})?`,l.path,L.filter(x=>x.id!==l.id).map(x=>x.path),`Pela convenção da Golden Dawn, ${l.name} corresponde ao caminho ${l.path}: ${formatPath(l)}.`,{subject:'letter:'+l.id}));append(question(`letter-endpoints-${l.id}`,'letters',`Que duas Sephiroth o caminho ${l.path} (${l.name}) conecta?`,formatPath(l),L.filter(x=>x.id!==l.id).map(formatPath),`O caminho ${l.path} conecta ${formatPath(l)}.`,{subject:'letter:'+l.id}));append(question(`letter-major-${l.id}`,'letters',`Qual Arcano Maior é associado a ${l.name} (${l.he})?`,m.name,T.filter(x=>x.type==='major'&&x.id!==m.id).map(x=>x.name),`${m.name} corresponde a ${l.name}, caminho ${l.path}.`,{subject:'letter:'+l.id}));append(question(`letter-meaning-${l.id}`,'letters',`Qual imagem mnemônica tradicional é associada a ${l.name}?`,l.symbolic,L.filter(x=>x.id!==l.id).map(x=>x.symbolic),`${l.name}: ${l.symbolic}. Trata-se de imagem histórica, não de tradução moderna.`,{subject:'letter:'+l.id}));}}
if(eligibleCards.length){for(let c of selectedMajor){let l=L[c.letter];append(question(`tarot-path-${c.id}`,'tarot','Qual caminho corresponde à carta mostrada?',c.path,L.filter(x=>x.path!==c.path).map(x=>x.path),`${c.name} → ${l.name} (${l.he}) → caminho ${c.path}, ${formatPath(l)}.`,{imageId:c.id,subject:'tarot:'+c.id}));append(question(`tarot-letter-${c.id}`,'tarot',`Qual letra hebraica é relacionada ao arcano ${c.name}?`,l.name,L.filter(x=>x.id!==l.id).map(x=>x.name),`${c.name} corresponde a ${l.name} (${l.he}), caminho ${l.path}.`,{subject:'tarot:'+c.id}));append(question(`tarot-message-${c.id}`,'tarot',`Qual carta transmite esta mensagem: “${c.message}”?`,c.name,T.filter(x=>x.type==='major'&&x.id!==c.id).map(x=>x.name),`A mensagem caracteriza ${c.name}: ${c.keywords}.`,{subject:'tarot:'+c.id}));append(question(`tarot-image-${c.id}`,'tarot','Qual é o nome do Arcano Maior mostrado?',c.name,T.filter(x=>x.type==='major'&&x.id!==c.id).map(x=>x.name),`Esta carta é ${c.name} (${c.number}). ${c.message}`,{imageId:c.id,subject:'tarot:'+c.id}));}
for(let c of selectedMinor){let su=bySuit(c.suit),w=byWorld(c.world);append(question(`tarot-minor-message-${c.id}`,'tarot',`Qual carta corresponde a esta descrição: “${c.visual}”?`,c.name,T.filter(x=>x.type==='minor'&&x.id!==c.id).map(x=>x.name),`${c.name}: ${c.message}`,{subject:'tarot:'+c.id}));append(question(`tarot-minor-world-${c.id}`,'tarot',`A qual mundo pertence o ${c.name}?`,w.name,W.filter(x=>x.id!==w.id).map(x=>x.name),`O naipe ${su.name} é associado a ${w.name} (${w.element}).`,{subject:'tarot:'+c.id}));if(c.seph){let sp=bySeph(c.seph);append(question(`tarot-minor-seph-${c.id}`,'tarot',`Qual Sephirah corresponde ao ${c.name}?`,sp.name,S.filter(x=>x.id!==sp.id).map(x=>x.name),`O número ${c.rank} corresponde à Sephirah ${sp.id} (${sp.name}); ${su.name} corresponde a ${w.name}.`,{subject:'tarot:'+c.id}));append(question(`tarot-minor-combo-${c.id}`,'tarot',`Qual carta está em ${w.name} na Sephirah ${sp.name}?`,c.name,T.filter(x=>x.type==='minor'&&x.seph&&x.id!==c.id).map(x=>x.name),`${c.name} é ${sp.name} (${sp.id}) no mundo ${w.name} (${su.name}).`,{subject:'tarot:'+c.id}));}else{append(question(`tarot-court-${c.id}`,'tarot',`Qual aspecto elemental da corte representa o ${c.name} nesta leitura do RWS?`,c.court,COURT_ELEMENTS.filter(x=>x!==c.court),`No esquema utilizado: Pajem = Terra, Cavaleiro = Ar, Rainha = Água, Rei = Fogo; o naipe ${su.name} é ${su.element}.`,{subject:'tarot:'+c.id}));}}}
for(let s of S){let n=s.id;let common={subject:'seph:'+n};append(question(`seph-num-${n}`,'cabala',`Qual é o número da Sephirah ${s.name}?`,n,S.filter(x=>x.id!==n).map(x=>x.id),`${s.name} é a ${n}ª Sephirah, ${s.meaning}.`,common));append(question(`seph-name-${n}`,'cabala',`Qual é a Sephirah de número ${n}?`,s.name,S.filter(x=>x.id!==n).map(x=>x.name),`${n} → ${s.name} (${s.he}), ${s.meaning}.`,{...common,number:n}));append(question(`seph-hebrew-${n}`,'cabala',`Qual é o nome hebraico de ${s.name}?`,s.he,S.filter(x=>x.id!==n).map(x=>x.he),`${s.name} é escrito ${s.he}.`,{...common,hebrewOptions:true}));append(question(`seph-planet-${n}`,'cabala',`Qual esfera ou astro é associado a ${s.name}?`,s.planet,S.filter(x=>x.id!==n).map(x=>x.planet),`${s.name} (${n}) → ${s.planet}.`,common));append(question(`seph-divine-${n}`,'cabala',`Qual nome divino corresponde a ${s.name} na Golden Dawn?`,s.divine,S.filter(x=>x.id!==n).map(x=>x.divine),`${s.name} → nome divino ${s.divine}.`,common));append(question(`seph-arch-${n}`,'cabala',`Qual arcanjo está associado a ${s.name}?`,s.arch,S.filter(x=>x.id!==n).map(x=>x.arch),`${s.name} → arcanjo ${s.arch}.`,common));append(question(`seph-choir-${n}`,'cabala',`Qual coro angélico está ligado a ${s.name}?`,s.choir,S.filter(x=>x.id!==n).map(x=>x.choir),`${s.name} → ordem ${s.choir}.`,common));append(question(`seph-pillar-${n}`,'cabala',`Em qual pilar da Árvore da Vida fica ${s.name}?`,s.pillar,P.filter(x=>x.name!==s.pillar).map(x=>x.name),`${s.name} pertence ao Pilar da ${s.pillar}.`,common));}
for(let w of W){append(question(`world-suit-${w.id}`,'worlds',`Qual naipe do Tarot é associado a ${w.name}?`,w.suit,W.filter(x=>x.id!==w.id).map(x=>x.suit),`${w.name} (${w.meaning}) corresponde a ${w.suit}, elemento ${w.element}.`,{subject:'world:'+w.id}));append(question(`world-name-${w.id}`,'worlds',`Qual dos quatro mundos é chamado de “${w.meaning}”?`,w.name,W.filter(x=>x.id!==w.id).map(x=>x.name),`${w.name} significa ${w.meaning}.`,{subject:'world:'+w.id}));append(question(`world-element-${w.id}`,'worlds',`Qual elemento se relaciona a ${w.name}?`,w.element,W.filter(x=>x.id!==w.id).map(x=>x.element),`${w.name} → ${w.element}, naipe ${w.suit}.`,{subject:'world:'+w.id}));append(question(`world-level-${w.id}`,'worlds',`O que é associado ao mundo de ${w.name} no esquema dos quatro mundos?`,w.divLevel,W.filter(x=>x.id!==w.id).map(x=>x.divLevel),`${w.name} → ${w.divLevel}.`,{subject:'world:'+w.id}));}
for(let p of P){append(question(`pillar-members-${p.id}`,'pillars',`Qual conjunto de Sephiroth pertence ao pilar da ${p.name}?`,p.ids.map(n=>bySeph(n).name).join(' · '),P.filter(x=>x.id!==p.id).map(x=>x.ids.map(n=>bySeph(n).name).join(' · ')),`Pilar da ${p.name}: ${p.ids.map(n=>bySeph(n).name).join(', ')}.`,{subject:'pillar:'+p.id}));append(question(`pillar-idea-${p.id}`,'pillars',`Qual pilar tem por tema: ${p.summary.toLowerCase()}`,p.name,P.filter(x=>x.id!==p.id).map(x=>x.name),`Esse tema pertence ao pilar da ${p.name}.`,{subject:'pillar:'+p.id}));}
// Novos desafios: os pares de Sephiroth derivam da mesma tabela do curso, sem mapeamentos duplicados.
for(const l of eligibleLetters){
  const pairs=L.filter(x=>x.id!==l.id).map(formatPath);
  append(question(`path-pair-${l.path}`,'paths',`O caminho ${l.path} conecta quais duas Sephiroth?`,formatPath(l),pairs,`Caminho ${l.path} (${l.name}): ${formatPath(l)}.`,{subject:'letter:'+l.id}));
  append({key:`draw-letter-${l.id}`,cat:'drawing',kind:'draw',prompt:`Desenhe a letra ${l.name}.`,letterId:l.id,answer:l.he,explanation:`${l.name} (${l.pronunciation}) é escrita ${l.he}. Caminho ${l.path}; ${l.shape} A avaliação compara a forma com uma fonte impressa e pode errar em algumas caligrafias.`,subject:'letter:'+l.id});
  append({key:`tree-path-${l.path}`,cat:'tree',kind:'tree',prompt:`Caminho ${l.path}: clique nas duas Sephiroth que ele conecta.`,path:l.path,endpoints:[l.from,l.to],answer:formatPath(l),explanation:`O caminho ${l.path} é associado a ${l.name} (${l.he}), conectando ${formatPath(l)}.`,subject:'letter:'+l.id});
}
for(const c of selectedMajor){
  const l=L[c.letter];
  const pairs=L.filter(x=>x.id!==l.id).map(formatPath);
  append(question(`major-pair-${c.id}`,'paths',`Quais Sephiroth são ligadas pelo Arcano Maior ${c.name}?`,formatPath(l),pairs,`${c.name} corresponde à letra ${l.name}, caminho ${l.path}: ${formatPath(l)}.`,{imageId:c.id,subject:'tarot:'+c.id}));
  append({key:`tree-major-${c.id}`,cat:'tree',kind:'tree',prompt:'Observe a imagem do Arcano Maior. Quais duas Sephiroth ele conecta?',imageId:c.id,path:l.path,endpoints:[l.from,l.to],answer:formatPath(l),explanation:`${c.name} → ${l.name} (${l.he}) → caminho ${l.path}, ${formatPath(l)}.`,subject:'tarot:'+c.id});
}
const enabledMajors=[...selectedMajor].sort((a,b)=>a.path-b.path);
if(enabledMajors.length>=3){
  const n=enabledMajors.length;
  const sizes=[...new Set([Math.min(5,n),Math.min(8,n),n])];
  for(const size of sizes){
    const positions=[];
    for(let i=0;i<=n-size;i+=(size===n?n:2))positions.push(i);
    if(!positions.includes(n-size))positions.push(n-size);
    for(const i of positions){
      const ascending=enabledMajors.slice(i,i+size);
      for(const direction of ['down','up']){
        const ordered=direction==='down'?ascending:[...ascending].reverse();
        append({key:`ordering-${direction}-${size}-${i}-${ascending.map(c=>c.id).join('-')}`,cat:'ordering',kind:'order',prompt:direction==='down'?'Ordene os Arcanos de cima para baixo: caminhos 11 → 32.':'Ordene os Arcanos de baixo para cima: caminhos 32 → 11.',orderIds:ordered.map(c=>c.id),orderSize:size,orderDirection:direction,answer:ordered.map(c=>c.name).join(' → '),explanation:`Ordem hermética dos caminhos: ${ordered.map(c=>`${c.path} · ${c.name}`).join(' → ')}.`,subject:`ordering:${direction}:${ascending.map(c=>c.id).join(',')}`});
      }
    }
  }
}

return bank;
}
function initQuizQuestion(q){
  session.treeSelected=[];
  session.orderDraft=[];
  session.drawResult=null;session.drawSnapshot=null;currentDrawPad=null;
  if(q.kind==='order'){
    session.orderDraft=shuffle(q.orderIds);
    if(session.orderDraft.every((id,i)=>id===q.orderIds[i])){
      session.orderDraft.push(session.orderDraft.shift());
    }
  }
}
function quizStart(){
  const category=$('#q-category').value,count=Number($('#q-count').value);
  const orderSetting=$('#q-order-size').value;
  rememberQuizForm();
  const qs=eligibleQuizQuestions(category);
  if(!qs.length){toast(selectedTypes(category).length?'Sem desafios disponíveis: confira as letras, cartas e o tamanho escolhido.':'Selecione pelo menos um tipo de pergunta.');return;}
  const chosen=shuffle(qs).slice(0,count);
  session={category,config:{category,count,orderSetting,types:[...selectedTypes(category)]},questions:chosen,index:0,selected:null,answers:[],started:new Date().toISOString()};
  initQuizQuestion(chosen[0]);render();
}
function recordAnswer(q,chosen,ok,selectedIndex=0,extra={}){
  if(!session||session.selected!==null)return;
  session.selected=selectedIndex;
  session.answers.push({question:q.key,subject:q.subject,ok,chosen,correct:q.answer,...extra});
  const key=q.subject||q.key;
  const st=state.stats[key]||{attempts:0,correct:0};st.attempts++;if(ok)st.correct++;
  state.stats[key]=st;persist();render();
}
function quizAnswer(idx){
  if(!session||session.selected!==null)return;
  const q=session.questions[session.index];
  if(q.kind||!q.options||idx<0||idx>=q.options.length)return;
  const chosen=q.options[idx];
  recordAnswer(q,chosen,chosen===q.answer,idx);
}
function treeToggleNode(id){
  if(!session||session.selected!==null)return;
  const q=session.questions[session.index];if(q.kind!=='tree'||!bySeph(id))return;
  const sel=session.treeSelected;
  if(sel.includes(id))session.treeSelected=sel.filter(n=>n!==id);
  else if(sel.length<2)session.treeSelected=[...sel,id];
  else{toast('Desmarque uma Sephirah antes de selecionar outra.');return;}
  render();
}
function treeSubmit(){
  if(!session||session.selected!==null||session.treeSelected.length!==2)return;
  const q=session.questions[session.index];if(q.kind!=='tree')return;
  const sel=[...session.treeSelected];
  const ok=sel.length===q.endpoints.length&&sel.every(n=>q.endpoints.includes(n));
  recordAnswer(q,sel.map(n=>bySeph(n).name).join(' ↔ '),ok,0,{selectedSeph:sel});
}
function drawingConfirm(){
  if(!session||session.selected!==null)return;
  const q=session.questions[session.index];
  if(q.kind!=='draw'||!currentDrawPad||currentDrawPad.empty())return;
  const result=ARCA_DRAW.evaluate(currentDrawPad,q.answer);
  if(result.verdict==='Lousa sem traços suficientes'||result.verdict==='Desenho pequeno demais'){
    toast(result.details);return;
  }
  session.drawResult=result;
  session.drawSnapshot=currentDrawPad.snapshot();
  recordAnswer(q,`Desenho avaliado: ${result.score}/100`,result.ok,0,{similarity:result.score});
}
function drawAction(action){
  if(!session||session.selected!==null||session.questions[session.index]?.kind!=='draw'||!currentDrawPad)return;
  if(action==='undo')currentDrawPad.undo();
  else if(action==='clear')currentDrawPad.clear();
}
function initDrawingPad(){
  currentDrawPad=null;
  if(route!=='quiz'||!session||session.finished||session.selected!==null)return;
  if(session.questions[session.index]?.kind!=='draw')return;
  const canvas=$('#draw-canvas');if(!canvas)return;
  currentDrawPad=ARCA_DRAW.setup(canvas,(count,hasInk)=>{
    const start=$('[data-draw-confirm]');if(start)start.disabled=!hasInk;
    const undo=$('[data-draw-undo]');if(undo)undo.disabled=count===0;
    const clear=$('[data-draw-clear]');if(clear)clear.disabled=count===0;
    const status=$('#draw-strokes');if(status)status.textContent=count===1?'1 traço':`${count} traços`;
  });
}
function orderMove(from,to){
  if(!session||session.selected!==null)return;
  const q=session.questions[session.index];if(q.kind!=='order')return;
  const draft=session.orderDraft;
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=draft.length||to>=draft.length||from===to)return;
  const [item]=draft.splice(from,1);draft.splice(to,0,item);render();
}
function orderSubmit(){
  if(!session||session.selected!==null)return;
  const q=session.questions[session.index];if(q.kind!=='order')return;
  const draft=[...session.orderDraft];
  const ok=draft.every((id,i)=>id===q.orderIds[i]);
  const positionsCorrect=draft.filter((id,i)=>id===q.orderIds[i]).length;
  recordAnswer(q,draft.map(id=>T.find(c=>c.id===id).name).join(' → '),ok,0,{positionsCorrect});
}
function quizNext(){
  if(!session||session.selected===null)return;
  if(session.index>=session.questions.length-1){
    const correct=session.answers.filter(a=>a.ok).length;
    state.sessions.push({date:new Date().toISOString(),category:session.category,total:session.answers.length,correct});
    state.sessions=state.sessions.slice(-100);persist();session.finished=true;
  }else{
    session.index++;session.selected=null;initQuizQuestion(session.questions[session.index]);
  }
  render();
}
function quizTreePanel(q,answered){
  const picks=session.treeSelected;
  const chosenCorrect=answered&&session.answers.at(-1).ok;
  const labels=picks.map(n=>bySeph(n).name);
  const tree=treeSVG(null,answered?q.path:null,false,{selected:picks,correct:q.endpoints,reveal:answered});
  const visual=q.imageId?`<div class="tree-arcano">${quizImageHTML(T.find(c=>c.id===q.imageId))}<small>Observe a carta e identifique seu caminho.</small></div>`:`<div class="path-hero"><span>CAMINHO</span><strong>${q.path}</strong><small>Qual par de Sephiroth ele conecta?</small></div>`;
  return `<div class="tree-game"><div class="tree-game-board"><div class="tree-game-legend"><span><i class="tree-dot legend-picked"></i> Sua seleção</span><span><i class="tree-dot legend-correct"></i> Resposta revelada</span></div>${tree}</div>
  <div class="tree-game-side">${visual}<h3>Escolha duas Sephiroth</h3><p class="muted">Clique nos dois círculos da Árvore da Vida. Clique novamente para desmarcar uma escolha.</p>
    <div class="selection-count"><span>Seleção</span><strong>${picks.length} / 2</strong></div>
    <div class="selected-seph">${[0,1].map(i=>`<div class="selected-item ${labels[i]?'filled':''}"><span>${i+1}</span><strong>${safe(labels[i]||'Selecione uma Sephirah')}</strong></div>`).join('')}</div>
    ${answered?`<div class="feedback" role="status"><strong>${chosenCorrect?'✓ Par correto!':'✕ Ainda não.'}</strong><p>${safe(q.explanation)}</p></div>`:`<button class="btn tree-submit" data-tree-confirm ${picks.length!==2?'disabled':''}>Conferir as duas Sephiroth ✓</button>`}
    ${!answered?'<p class="micro-hint">A conexão correta só será destacada depois de confirmar.</p>':''}
  </div></div>`;
}
function quizDrawPanel(q,answered){
  const l=L.find(x=>x.id===q.letterId),result=session.drawResult;
  const snap=session.drawSnapshot;
  return `<div class="draw-game ${answered?'draw-reviewed':''}">
    <div class="draw-main">
      <div class="draw-header"><div><strong>LOUSA DE CALIGRAFIA</strong><p>${answered?'Seu desenho foi comparado com um modelo impresso.':'Desenhe com mouse, touch ou caneta. Não é necessário respeitar a ordem dos traços.'}</p></div><span class="draw-dot">✎</span></div>
      ${answered?`<div class="draw-result-picture"><img src="${snap}" alt="Seu desenho da letra ${safe(l.name)}"></div>`:`<canvas id="draw-canvas" class="draw-canvas" width="640" height="460" aria-label="Lousa para desenhar a letra ${safe(l.name)} com mouse ou toque">Seu navegador precisa oferecer suporte a canvas.</canvas>`}
      ${answered?`<div class="draw-comparison"><div class="draw-sample"><small>SEU DESENHO</small><img src="${snap}" alt="Traços desenhados por você"></div><div class="draw-sample"><small>MODELO DA LETRA ${safe(l.name.toUpperCase())}</small><span lang="he" dir="rtl" class="draw-target">${safe(l.he)}</span></div></div>
        <div class="feedback" role="status"><strong>${result.ok?'✓':'↻'} ${safe(result.verdict)} · ${result.score}/100</strong><p>${safe(result.details)}</p><p>${safe(q.explanation)}</p></div>`:
        `<div class="draw-toolbar"><span id="draw-strokes" class="draw-strokes">0 traços</span><div class="draw-buttons"><button class="btn ghost small" data-draw-undo disabled>↶ Desfazer traço</button><button class="btn ghost small" data-draw-clear disabled>⌫ Limpar lousa</button></div></div><button class="btn draw-confirm" data-draw-confirm disabled>Avaliar meu desenho ✓</button>`}
    </div>
    <aside class="draw-side"><div class="draw-step">✦ DESAFIO DE MEMORIZAÇÃO</div><div class="draw-letter-name">${safe(l.name)}</div><div class="draw-letter-pronounce">${safe(l.pronunciation)}</div><div class="draw-instruction">${answered?'Símbolo revelado':'Desenhe de memória — o símbolo só aparece depois de você conferir.'}</div>
      <div class="draw-target-holder">${answered?`<span lang="he" dir="rtl" class="draw-target">${safe(l.he)}</span>`:'<span class="draw-unknown" aria-hidden="true">?</span>'}</div>
      <p class="draw-disclaimer">O reconhecimento é uma comparação de contornos, <strong>não um OCR nem IA</strong>. Fontes hebraicas, traços e estilos caligráficos variam; o resultado é um indicador para treino, não uma correção infalível.</p>
      <div class="draw-learning-tip"><strong>Dica para aprender</strong><p>Observe os cantos, as curvas, o número de hastes e a abertura da letra. Tente novamente de memória na próxima rodada.</p></div>
    </aside>
  </div>`;
}
function quizOrderPanel(q,answered){
  const draft=session.orderDraft;
  const matched=draft.filter((id,i)=>id===q.orderIds[i]).length;
  const rows=draft.map((id,i)=>{
    const c=T.find(x=>x.id===id);
    const ok=answered&&id===q.orderIds[i];
    const cls=answered?(ok?'order-correct':'order-wrong'):'';
    const pathNote=answered?`<span class="order-path">Caminho ${c.path}</span>`:'';
    return `<div class="order-row ${cls}" data-drag-order="${i}" ${answered?'':'draggable="true"'}><span class="order-index">${i+1}</span>${imageHTML(c)}<div class="order-row-text"><strong>${safe(c.name)}</strong>${pathNote}</div>
      ${answered?`<span class="order-status">${ok?'✓':'×'}</span>`:`<div class="order-buttons"><button type="button" class="order-arrow" data-order-move="${i}:-1" ${i===0?'disabled':''} aria-label="Subir ${safe(c.name)}">↑</button><button type="button" class="order-arrow" data-order-move="${i}:1" ${i===draft.length-1?'disabled':''} aria-label="Descer ${safe(c.name)}">↓</button></div>`}
    </div>`;
  }).join('');
  return `<div class="order-game"><div class="order-instructions"><strong>${q.orderDirection==='down'?'↓ Descida: 11 → 32':'↑ Subida: 32 → 11'}</strong><p>Organize as cartas pela sequência numérica dos caminhos na tradição Golden Dawn. ${answered?'O número real de cada caminho está visível agora.':'Os números ficam ocultos até você responder. Arraste os cartões ou utilize as setas.'}</p></div>
    <div class="order-list">${rows}</div>
    ${answered?`<div class="feedback" role="status"><strong>${matched===draft.length?'✓ Sequência perfeita!':`✕ ${matched} de ${draft.length} posições corretas`}</strong><p>Ordem correta: ${safe(q.explanation)}</p></div>`:`<div class="order-actions"><button class="btn" data-order-confirm>Conferir a ordem ✓</button><span>${draft.length} Arcanos Maiores</span></div>`}</div>`;
}
function quizPanel(){
  if(!session)return quizStartPage();
  if(session.finished){
    const correct=session.answers.filter(a=>a.ok).length,pct=Math.round(correct/session.questions.length*100);
    return `<div class="quiz-panel"><div class="content-card result-hero"><p class="eyebrow">SESSÃO CONCLUÍDA</p><div style="font-size:48px;color:var(--gold)">✧</div><div class="result-score">${pct}%</div><h2>${pct>=90?'Excelente domínio!':pct>=70?'Muito bem!':pct>=50?'Você está avançando.':'Continue praticando.'}</h2><p>Veja os pontos fortes e retome os conteúdos mais desafiadores.</p><div class="result-metrics"><div class="stat"><strong>${correct}</strong><span>respostas corretas</span></div><div class="stat"><strong>${session.questions.length-correct}</strong><span>respostas incorretas</span></div><div class="stat"><strong>${session.questions.length}</strong><span>perguntas no total</span></div></div><div class="flex-gap" style="justify-content:center"><button class="btn" data-repeat-quiz>Refazer outra sessão ↻</button><button class="btn ghost" data-end-quiz>Escolher categorias</button></div></div>
      ${session.answers.some(a=>!a.ok)?`<div class="section-head"><h2>Revisão das respostas incorretas</h2></div><div class="study-list">${session.answers.filter(a=>!a.ok).map(a=>{const q=session.questions.find(x=>x.key===a.question);return `<div class="study-row"><span class="study-index">!</span><div><h3>${safe(q.prompt)}</h3><p>Resposta correta: <strong>${safe(a.correct)}</strong>. ${safe(q.explanation)}</p></div></div>`}).join('')}</div>`:''}</div>`;
  }
  const q=session.questions[session.index],count=session.questions.length,answered=session.selected!==null;
  const correct=answered&&session.answers.at(-1).ok;
  const visual=q.glyph?`<div class="hebrew" lang="he" dir="rtl">${q.glyph}</div>`:q.imageId?quizImageHTML(T.find(c=>c.id===q.imageId)):q.number?`<div class="big-number">${q.number}</div>`:'';
  const regular=`${visual?`<div class="question-prompt">${visual}</div>`:''}<div class="answer-list">${(q.options||[]).map((a,i)=>{
    const cls=answered?(a===q.answer?'correct':i===session.selected?'incorrect':''):'';
    return `<button class="answer ${cls}" data-answer="${i}" ${answered?'disabled':''}><span class="answer-mark">${answered&&a===q.answer?'✓':answered&&i===session.selected?'×':'ABCD'[i]}</span>${q.hebrewOptions?`<span class="option-hebrew" lang="he">${safe(a)}</span>`:`<span>${safe(a)}</span>`}</button>`;
  }).join('')}</div>${answered?`<div class="feedback" aria-live="polite"><strong>${correct?'✓ Resposta correta!':'✕ Ainda não. Resposta: '+safe(q.answer)}</strong><p>${safe(q.explanation)}</p></div>`:''}`;
  const body=q.kind==='tree'?quizTreePanel(q,answered):q.kind==='order'?quizOrderPanel(q,answered):q.kind==='draw'?quizDrawPanel(q,answered):regular;
  const labels={letters:'ALFABETO HEBRAICO',tarot:'TAROT RIDER–WAITE',cabala:'CABALA HERMÉTICA',worlds:'QUATRO MUNDOS',pillars:'OS PILARES',paths:'CAMINHOS · MÚLTIPLA ESCOLHA',tree:'JOGO · ÁRVORE DA VIDA',ordering:'JOGO · ORDEM DOS ARCANOS',drawing:'LOUSA · DESENHE AS LETRAS'};
  return `<div class="quiz-panel ${q.kind?'quiz-panel-wide':''}"><div class="quiz-progress-head"><span>QUESTÃO ${session.index+1} DE ${count}</span><span>${session.answers.filter(a=>a.ok).length} acertos</span></div><div class="progress-track"><div class="progress-fill" style="width:${(session.index+(answered?1:0))/count*100}%"></div></div>
  <section class="question-box"><span class="quiz-kicker">${labels[q.cat]}</span><h2>${safe(q.prompt)}</h2>${body}</section>
  <div class="quiz-bottom"><button class="btn ghost small" data-end-quiz>Encerrar prática</button>${answered?`<button class="btn" data-next-quiz>${session.index+1>=count?'Concluir sessão ↗':'Próxima questão →'}</button>`:'<span class="subtle" style="font-size:12px">'+(q.kind==='tree'?'Selecione duas Sephiroth na árvore.':q.kind==='order'?'Organize as cartas e confira.':q.kind==='draw'?'Desenhe a letra na lousa e avalie.':'Escolha uma alternativa para continuar.')+'</span>'}</div></div>`;
}
function settingItem(id,name,sub,glyph,type){let checked=type==='letter'?state.letters.includes(id):state.cards.includes(id);return `<label class="toggle-item"><input type="checkbox" data-setting="${type}" value="${id}" ${checked?'checked':''} aria-label="Incluir ${safe(name)} no quiz"><span class="toggle-he">${glyph||'✦'}</span><span class="toggle-name">${safe(name)}<small class="toggle-sub">${safe(sub)}</small></span></label>`}
function configGroups(){let q=filters.settings.toLocaleLowerCase('pt-BR').trim();const letterArr=L.filter(l=>(l.name+' '+l.he+' '+l.path).toLocaleLowerCase('pt-BR').includes(q));const cardArr=T.filter(c=>(c.name+' '+c.keywords).toLocaleLowerCase('pt-BR').includes(q));let showL=filters.settingsGroup==='all'||filters.settingsGroup==='letters',showC=filters.settingsGroup==='all'||filters.settingsGroup==='cards';return `${showL?`<section class="config-group"><div class="config-head"><div><h2>Letras hebraicas <span class="pill-count">${state.letters.length}/22</span></h2><p>Ative apenas as letras que deseja estudar nos exercícios.</p></div><div class="flex-gap"><button class="btn ghost tiny" data-bulk="letters:on">Todas</button><button class="btn ghost tiny" data-bulk="letters:off">Nenhuma</button></div></div><div class="config-list">${letterArr.map(l=>settingItem(l.id,l.name,`Caminho ${l.path}`,l.he,'letter')).join('')}</div></section>`:''}${showC?`<section class="config-group"><div class="config-head"><div><h2>Cartas do tarot <span class="pill-count">${state.cards.length}/78</span></h2><p>Arcanos Maiores e Menores podem ser ligados individualmente.</p></div><div class="flex-gap"><button class="btn ghost tiny" data-bulk="cards:on">Todas</button><button class="btn ghost tiny" data-bulk="cards:off">Nenhuma</button><button class="btn ghost tiny" data-bulk="major:off">Pausar maiores</button><button class="btn ghost tiny" data-bulk="minor:off">Pausar menores</button></div></div><div class="config-list">${cardArr.map(c=>settingItem(c.id,c.name,c.type==='major'?'Arcano maior':bySuit(c.suit).name,'◈','card')).join('')}</div></section>`:''}`}
function settingsPage(){return header('Personalize sua jornada','CONFIGURAÇÕES · CONTEÚDO DO QUIZ','Tudo começa ativado. Escolha somente as letras e cartas que já estudou. Suas escolhas e seu histórico ficam salvos localmente neste navegador.')+`<div class="note"><strong>Importante:</strong> desativar uma carta ou letra impede que ela seja sorteada como foco da pergunta; ela ainda pode aparecer entre as alternativas. Perguntas sobre Sephiroth, mundos e pilares continuam disponíveis em suas categorias.</div><div class="toolbar"><input id="settings-search" class="field search" placeholder="Filtrar letras e cartas…" value="${safe(filters.settings)}" aria-label="Pesquisar itens"><div class="segmented">${[['all','Tudo'],['letters','Letras'],['cards','Tarot']].map(([id,label])=>`<button class="${filters.settingsGroup===id?'active':''}" data-filter-settings="${id}">${label}</button>`).join('')}</div></div><div id="config-results">${configGroups()}</div><div class="config-actions"><button class="btn secondary" data-export>Exportar progresso e configurações ↓</button><button class="btn ghost" data-import>Importar arquivo ↑</button><input type="file" id="import-input" accept="application/json,.json" hidden><button class="btn danger" data-reset-progress>Limpar histórico de respostas</button><button class="btn danger" data-reset-all>Restaurar todas as configurações</button></div>`}
function render(){currentDrawPad=null;navRender();$('#breadcrumb').textContent='Biblioteca / '+routes[route];let m=scopeMetrics();$('#top-streak').textContent=m.attempts?`${m.correct} acertos acumulados`:'Seu percurso';document.body.classList.toggle('light',!!state.light);$('#theme-toggle').textContent=state.light?'☾':'☼';$('#content').innerHTML=({home,letters:lettersPage,tarot:tarotPage,seph:sephPage,worlds:worldsPage,pillars:pillarsPage,correspondences:corrPage,quiz:()=>session?quizPanel():quizStartPage(),settings:settingsPage})[route]();initDrawingPad();}
function activate(type,id){let k=type==='letter'?'letters':'cards',arr=state[k];if(arr.includes(id))state[k]=arr.filter(x=>x!==id);else state[k]=[...arr,id];persist();const modalOpen=!!$('#modal-overlay');if(modalOpen){if(type==='letter')showModal('letter',id);else showModal('tarot',id)}else render();toast(state[k].includes(id)?'Incluído nos quizzes.':'Pausado nos quizzes.');}
function bulkChange(which,on){if(which==='letters')state.letters=on?L.map(l=>l.id):[];else if(which==='cards')state.cards=on?T.map(t=>t.id):[];else{let ids=T.filter(t=>t.type===which).map(t=>t.id);state.cards=on?[...new Set([...state.cards,...ids])]:state.cards.filter(x=>!ids.includes(x));}persist();render();toast('Seleção atualizada.');}
function downloadJSON(){let blob=new Blob([JSON.stringify({application:'Arcana Atlas',version:3,exported:new Date().toISOString(),...state},null,2)],{type:'application/json;charset=utf-8'});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download='arcana-atlas-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Arquivo de backup preparado.');}
async function importJSON(file){if(!file)return;try{let raw=JSON.parse(await file.text());if(!Array.isArray(raw.letters)||!Array.isArray(raw.cards))throw Error('Formato do backup inválido');state.letters=L.filter(l=>raw.letters.includes(l.id)).map(l=>l.id);state.cards=T.filter(t=>raw.cards.includes(t.id)).map(t=>t.id);state.stats=raw.stats&&typeof raw.stats==='object'?raw.stats:{};state.sessions=Array.isArray(raw.sessions)?raw.sessions.slice(-100):[];state.quizTypes=raw.quizTypes&&typeof raw.quizTypes==='object'&&!Array.isArray(raw.quizTypes)?raw.quizTypes:{};state.quizPreferences=raw.quizPreferences&&typeof raw.quizPreferences==='object'?{...defaultState().quizPreferences,...raw.quizPreferences}:defaultState().quizPreferences;state.drawV4Migrated=!!raw.drawV4Migrated;if(!state.drawV4Migrated&&Array.isArray(state.quizTypes.all)&&state.quizTypes.all.length===37){state.quizTypes.all.push('draw-letter')}state.drawV4Migrated=true;persist();render();toast('Backup importado com sucesso.')}catch(e){toast('Não foi possível importar este arquivo JSON.')}}
// Delegação de eventos preserva a navegação após cada renderização.
document.addEventListener('click',e=>{
 const btn=e.target.closest('button,[data-tree-seph],[data-tree-path],[data-quiz-seph]');if(!btn)return;
 if(btn.matches('[data-close-modal]')){hideModal();return}
 if(btn.dataset.route){go(btn.dataset.route);return}
 if(btn.dataset.openLetter){showModal('letter',btn.dataset.openLetter);return}
 if(btn.dataset.openTarot){showModal('tarot',btn.dataset.openTarot);return}
 if(btn.dataset.openSeph){showModal('seph',btn.dataset.openSeph);return}
 if(btn.dataset.toggleLetter){activate('letter',btn.dataset.toggleLetter);return}
 if(btn.dataset.toggleCard){activate('card',btn.dataset.toggleCard);return}
 if(btn.dataset.quizSeph){treeToggleNode(Number(btn.dataset.quizSeph));return}
 if(btn.hasAttribute('data-tree-confirm')){treeSubmit();return}
 if(btn.hasAttribute('data-draw-confirm')){drawingConfirm();return}
 if(btn.hasAttribute('data-draw-undo')){drawAction('undo');return}
 if(btn.hasAttribute('data-draw-clear')){drawAction('clear');return}
 if(btn.dataset.orderMove){const [from,step]=btn.dataset.orderMove.split(':').map(Number);orderMove(from,from+step);return}
 if(btn.hasAttribute('data-order-confirm')){orderSubmit();return}
 if(btn.dataset.treeSeph){view={type:'seph',id:Number(btn.dataset.treeSeph)};if(route!=='seph')go('seph');else $('#tree-inspector').innerHTML=sephDetails(bySeph(view.id));if(route==='seph')$('#content').querySelector('.tree-box').innerHTML=treeSVG(view.id);return}
 if(btn.dataset.treePath){view={type:'path',id:Number(btn.dataset.treePath)};if(route!=='seph')go('seph');else $('#tree-inspector').innerHTML=pathDetailsInline(L.find(l=>l.path===view.id));if(route==='seph')$('#content').querySelector('.tree-box').innerHTML=treeSVG(null,view.id);return}
 if(btn.dataset.filterLetters){filters.lettersMode=btn.dataset.filterLetters;render();return}
 if(btn.dataset.filterTarot){filters.tarotMode=btn.dataset.filterTarot;render();return}
 if(btn.dataset.filterSettings){filters.settingsGroup=btn.dataset.filterSettings;render();return}
 if(btn.dataset.bulk){let [w,a]=btn.dataset.bulk.split(':');bulkChange(w,a==='on');return}
 if(btn.hasAttribute('data-start-quiz')){quizStart();return}
 if(btn.dataset.answer!==undefined){quizAnswer(Number(btn.dataset.answer));return}
 if(btn.hasAttribute('data-next-quiz')){quizNext();return}
 if(btn.hasAttribute('data-end-quiz')){session=null;render();return}
 if(btn.hasAttribute('data-repeat-quiz')){const c=session.config;session=null;if(c){state.quizPreferences={category:c.category,count:c.count,orderSetting:c.orderSetting};persist();}render();quizStart();return}
 if(btn.hasAttribute('data-export')){downloadJSON();return}
 if(btn.hasAttribute('data-import')){$('#import-input')?.click();return}
 if(btn.hasAttribute('data-reset-progress')){if(confirm('Apagar todas as respostas e estatísticas? Suas letras e cartas ativas serão mantidas.')){state.stats={};state.sessions=[];persist();render();toast('Histórico de respostas limpo.')}return}
 if(btn.hasAttribute('data-reset-all')){if(confirm('Restaurar TODAS as 22 letras e 78 cartas e apagar o histórico?')){state={...defaultState(),light:state.light};persist();session=null;render();toast('Configurações restauradas.')}return}
});
document.addEventListener('change',e=>{let t=e.target;if(t.id==='q-category'){
  state.quizPreferences={...state.quizPreferences,category:t.value};persist();
  const order=$('#order-config');if(order)order.hidden=t.value!=='ordering';
  $('#quiz-type-field').outerHTML=questionTypePicker(t.value);
  refreshTypePicker();return;
}if(t.id==='q-count'||t.id==='q-order-size'){rememberQuizForm();refreshTypePicker();return}
if(t.id==='q-type-all'){
  if(t.checked)delete state.quizTypes[$('#q-category').value];else state.quizTypes[$('#q-category').value]=[];
  persist();refreshTypePicker();return;
}
if(t.matches('input[data-q-type]')){
  const cat=$('#q-category').value;const selections=new Set(selectedTypes(cat));
  if(t.checked)selections.add(t.dataset.qType);else selections.delete(t.dataset.qType);
  const all=allTypeIds(cat);if(selections.size===all.length)delete state.quizTypes[cat];else state.quizTypes[cat]=all.filter(x=>selections.has(x));
  persist();refreshTypePicker();return;
}if(t.matches('input[data-setting]')){let k=t.dataset.setting==='letter'?'letters':'cards',id=t.value;if(t.checked&&!state[k].includes(id))state[k].push(id);if(!t.checked)state[k]=state[k].filter(x=>x!==id);persist();let label=t.closest('.toggle-item');label?.setAttribute('data-selected',t.checked?'true':'false');let counter=t.closest('.config-group')?.querySelector('.pill-count');if(counter)counter.textContent=`${state[k].length}/${k==='letters'?22:78}`;toast('Preferência salva no navegador.');return}if(t.matches('#import-input')){importJSON(t.files[0]);return}});
document.addEventListener('input',e=>{let t=e.target;if(t.id==='letters-search'){filters.letters=t.value;$('#letter-results').innerHTML=letterResults()}if(t.id==='tarot-search'){filters.tarot=t.value;$('#tarot-results').innerHTML=tarotResults()}if(t.id==='settings-search'){filters.settings=t.value;$('#config-results').innerHTML=configGroups()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal-overlay'))hideModal();if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-tree-seph],[data-quiz-seph]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
let dragOrderFrom=null;
document.addEventListener('dragstart',e=>{
  const row=e.target.closest('[data-drag-order]');
  if(!row)return;
  if(!session||session.selected!==null||session.questions[session.index].kind!=='order'){e.preventDefault();return;}
  dragOrderFrom=Number(row.dataset.dragOrder);e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(dragOrderFrom));row.classList.add('dragging');
});
document.addEventListener('dragover',e=>{if(e.target.closest('[data-drag-order]')&&dragOrderFrom!==null)e.preventDefault();});
document.addEventListener('drop',e=>{
  const row=e.target.closest('[data-drag-order]');
  if(!row||dragOrderFrom===null)return;
  e.preventDefault();const to=Number(row.dataset.dragOrder);orderMove(dragOrderFrom,to);dragOrderFrom=null;
});
document.addEventListener('dragend',()=>{dragOrderFrom=null;$$('.order-row.dragging').forEach(x=>x.classList.remove('dragging'));});
$('#modal-root').addEventListener('click',e=>{if(e.target.id==='modal-overlay')hideModal()});
$('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#theme-toggle').addEventListener('click',()=>{state.light=!state.light;persist();render()});
window.addEventListener('error',e=>{let img=e.target;if(img instanceof HTMLImageElement && img.classList.contains('tarot-image')){if(img.dataset.remote){img.src=img.dataset.remote;delete img.dataset.remote}else{let div=document.createElement('div');div.className='tarot-image img-fallback';div.textContent='Rider–Waite–Smith';img.replaceWith(div)}}},true);
render();
})();
