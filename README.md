# ARCANA ATLAS V4 — Academia Hermética

Aplicação educacional desenvolvida em **HTML, CSS e JavaScript puro**, sem React, backend, banco de dados, CDN de scripts, dependências nem instalação.

## Nova V4: desenhe letras hebraicas no próprio quiz

No **Modo quiz**, escolha **✍ Lousa · desenhar letras hebraicas** em **Conteúdo ou modalidade**. Desenhe com mouse, toque ou caneta e obtenha uma avaliação local da semelhança de sua forma com a letra impressa, com comparativo visual, desfazer e limpar. A modalidade tem **22 desafios** e respeita quais letras estão ativas. Pode também ser misturada às demais pelo seletor de tipos na categoria **Misturar todas**.

São **722 desafios-base no banco completo, 38 tipos de pergunta** e 704 modelos elegíveis por padrão em Misturar todas. O comparador é **heurístico e aproximado**, sem OCR/IA e sem coleta dos desenhos. Consulte **`NOVIDADES-v4.md`** para detalhes do algoritmo, limites e instruções de atualização.

**Arquivos principais da V4:** `index.html`, `styles.css`, `data.js`, `app.js` e **`drawing.js`** (novo). Não elimine `drawing.js`, pois a lousa depende dele.

## Como abrir

1. Extraia todos os arquivos do ZIP **na mesma pasta**.
2. Abra `index.html` no Chrome, Edge, Firefox ou outro navegador moderno.
3. Os cursos e quizzes funcionam sem internet; inicialmente, as **imagens do tarot são tentadas pela internet** caso não existam na pasta de imagens.
4. Para guardar as **78 imagens do Rider–Waite–Smith no seu computador e usar 100% offline**, conecte-se à internet e dê dois cliques em **`baixar-cartas.cmd`** (Windows). Ele usa o PowerShell já incluído no Windows e salva as imagens na pasta `assets/cards`. Também é possível executar `baixar-cartas.ps1` em um PowerShell.
5. O script evita refazer downloads concluídos. Se alguma imagem não baixar, execute novamente.

### Limitação de empacotamento

Esta distribuição inclui os caminhos exatos das 78 imagens e o **baixador automático**, mas não inclui os 78 binários JPEG. Uma vez executado o script, os arquivos ficam no próprio projeto. As imagens também aparecem online sem executar o script, se o servidor externo estiver acessível.

## Atualização da versão anterior sem perder o progresso

**Faça um backup** com o botão **Configurações → Exportar progresso e configurações** na versão anterior. Em seguida, substitua os arquivos da versão antiga pelos desta versão **no mesmo caminho/pasta**, mantendo `assets/cards` (se você já baixou as imagens). Os arquivos novos usam a mesma chave `localStorage` (`arcana-atlas-v1`).

Se você abrir o novo `index.html` em uma pasta diferente e o navegador tratar o caminho como outra origem, o progresso pode não aparecer. Nesse caso, use **Importar arquivo** para restaurar o backup JSON. Não precisa baixar novamente as imagens se mantiver a pasta `assets/cards`.

## Novidades da V3 — filtros por tipo de pergunta

No **Modo Quiz**, logo abaixo do seletor **Conteúdo ou modalidade**, existe agora o novo seletor expansível **Tipo de pergunta (escolha um ou vários)**. É possível:

- Marcar **Todos os tipos de pergunta** para usar todos os modelos daquela categoria.
- Desmarcar **Todos os tipos** para escolher apenas um tipo específico, ou combinar vários.
- Ver, antes de começar, a quantidade exata de desafios disponíveis na combinação de categoria, tipos, letras e cartas ativos.
- Deixar um tipo ou todos os tipos sem seleção: o botão de iniciar fica inativo quando não houver desafios disponíveis.
- Personalizar independentemente os tipos de **Letras**, **Tarot**, **Sephiroth**, **Mundos**, **Pilares**, **Caminhos**, **Jogo visual**, **Ordenação** e **Misturar todas**. Cada conteúdo mantém a própria seleção local ao trocar de categoria.
- Treinar a **ordenação apenas 11→32**, apenas **32→11** ou as duas direções pelo seletor de tipos, mantendo a escolha separada de tamanho (5, 8 ou todos os Arcanos Maiores ativos).

**Duas novas perguntas para cada uma das 22 letras hebraicas (44 questões-base):**

1. **Caminho → nome da letra**. Ex.: “Qual letra hebraica corresponde ao caminho 22?”, com nomes nas alternativas.
2. **Caminho → apenas símbolos**. Mesmo exercício, mas as alternativas mostram exclusivamente os caracteres hebraicos, sem revelar o nome antes da resposta.

Na **V3**, eram **37 tipos selecionáveis de pergunta** e **700 modelos de desafio** no banco total, com todas as letras e cartas ativas. Na **V3**, o modo **Misturar todas** oferecia inicialmente **682 modelos compatíveis com seu formato de sessão**, pois usa apenas as sequências curtas de cinco cartas na ordenação. A modalidade **Ordenação** inclui outras variações de tamanho, completando o total do banco.

As seleções de tipos são armazenadas junto dos outros dados na mesma chave `localStorage` (`arcana-atlas-v1`) e são exportadas para o arquivo JSON de backup. Ao importar um backup antigo da V1/V2, todos os tipos começam habilitados, sem perda das letras, cartas e estatísticas anteriores.

## Módulos

- **Alfabeto:** 22 letras, desenho, nome, valor de gematria, associações mnemônicas, astros, 22 caminhos e Arcanos Maiores.
- **Tarot Rider–Waite–Smith:** 78 cartas, explicação do simbolismo visível e mensagens individuais; Arcanos Maiores relacionados a letras/caminhos, numerados a Sephiroth/mundos, corte aos elementos.
- **Dez Sephiroth:** nome hebraico, significado, número e Árvore da Vida com 22 caminhos interativos.
- **Quatro mundos:** Atziluth, Briah, Yetzirah, Assiah, naipes e elementos.
- **Três pilares:** Misericórdia, Equilíbrio e Severidade.
- **Correspondências:** nomes divinos, arcanjos, coros angélicos, esferas astrais e pilares.
- **Quiz:** questões aleatórias com alternativas, correção explicada, sessões de 5/10/20/40 questões, resultado final e revisão dos erros. **Desde a V3, escolha um ou vários tipos de pergunta específicos por categoria. Na V4, há também a lousa de escrita manual.**
- **NOVO · Caminhos e Arcanos:** questões de múltipla escolha sobre os dois extremos de cada caminho e de cada Arcano Maior.
- **NOVO · Jogo da Árvore:** o programa apresenta um número de caminho ou uma imagem de Arcano Maior; marque duas Sephiroth clicando na árvore. A confirmação revela a ligação e sua explicação.
- **NOVO · Ordene os Arcanos:** arraste cartas no desktop ou utilize botões para subir/descer; escolha 5, 8 ou todas as cartas maiores habilitadas, em ordem 11→32 ou 32→11. A ordem é a dos números de caminho da Golden Dawn (não uma sequência de alturas geométricas no desenho).
- **Configurações:** 22 letras e 78 cartas inicialmente habilitadas; ativação individual, seleções em lote, backup JSON, importação, estatísticas e modo claro/escuro.

## Regras dos jogos novos

- Em **Jogo da Árvore**, os desafios por número de caminho entram quando a **letra hebraica correspondente** está ativa. Desafios com imagem entram quando o **Arcano Maior** está ativo.
- Em **Caminhos e Arcanos**, essa mesma lógica de filtros é aplicada às questões de associação.
- Em **Ordenação**, entram apenas Arcanos Maiores ativos, com no mínimo **três cartas**. A resposta só recebe um acerto completo quando todas as posições estão corretas; a correção mostra também quantas posições você acertou e a sequência verdadeira.
- O modo **Misturar todas** inclui os jogos novos, usando desafios curtos de cinco cartas para não alongar excessivamente a sessão. A categoria específica de ordenação permite oito ou todas as cartas ativas.
- Configurações e estatísticas anteriores permanecem em `localStorage` na chave `arcana-atlas-v1`, evitando perder o progresso após atualizar os arquivos.

## Salvamento

O projeto utiliza `localStorage`, gravado **apenas neste navegador/dispositivo**. Não há login, conexão com banco de dados, envio de dados nem rastreamento. Em navegação anônima, bloqueio de armazenamento, limpeza de dados ou outro navegador, as configurações podem não persistir; use **Exportar progresso** como backup.

## Convenção histórica e cuidados

Os caminhos 11–32, suas 22 letras e seus Arcanos Maiores seguem a **Cabala Hermética da Golden Dawn**, não são atribuições universais da Cabala judaica. A ordem utilizada é a do Rider–Waite–Smith (VIII Força, XI Justiça). Não utiliza a troca Thelêmica entre Imperador e Estrela (Heh/Tzaddi). Atribuições de nomes divinos, arcanjos e coros variam em grafia, tradição e escolas.

Nos Arcanos Menores, **Ás–10** representam, respectivamente, as Sephiroth **Kether–Malkuth** em cada mundo. Os naipes são Paus/Atziluth/Fogo, Copas/Briah/Água, Espadas/Yetzirah/Ar, Ouros/Assiah/Terra. Para as cartas da corte do RWS, o programa usa os aspectos **Pajem/Terra, Cavaleiro/Ar, Rainha/Água, Rei/Fogo**, uma analogia elemental didática. As cartas de corte não são apresentadas como correspondendo inequivocamente a uma Sephirah.

As descrições das cartas são **sínteses didáticas originais** e não substituem a leitura crítica de Waite e dos textos históricos. O nome, os valores e as imagens pictográficas das letras são recursos pedagógicos e não significados literais obrigatórios.

## Créditos e referências

Ilustrações Rider–Waite–Smith: **Pamela Colman Smith**, com direção de Arthur Edward Waite, obra original publicada em 1909, em domínio público nas jurisdições de prazo de vida +70 anos, como o Brasil; consulte as condições locais antes de redistribuir escaneamentos ou edições modernas. Não foram usados recolorimentos recentes. Endpoints das imagens fornecidos por [sixseeds/tarot-api](https://github.com/sixseeds/tarot-api). Coleção da Wikimedia Commons para referência: [Rider–Waite–Smith (TaionWC)](https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(TaionWC)).

Fontes para as correspondências e seu caráter histórico:

- [The Golden Dawn — Godnames, archangels and angels](https://publicism.info/magic/full/society/golden/index.html)
- [The Hermetic Tree of Life (table of associations)](https://hermetic.com/jwmt/v1n3/treeoflife)
- [The 22 Paths (Golden Dawn system)](https://www.umbralux.app/en/blog/kabbala-22-pfade-lebensbaum)
- [Golden Dawn's Minor Arcana sephirot/world system](https://www.readkong.com/page/coloring-the-classic-golden-dawn-tarot-1706801)

## Arquivos

- `index.html` — entrada.
- `styles.css` — interface responsiva e temas.
- `data.js` — dados do curso (22 letras, 78 cartas, 10 Sephiroth, mundos e pilares).
- `app.js` — telas, quiz, gráficos interativos, filtros e armazenamento.
- `drawing.js` — lousa com Pointer Events e comparação heurística local de letras hebraicas.
- `baixar-cartas.cmd` / `baixar-cartas.ps1` — download das 78 imagens.
- `assets/cards/` — onde são guardadas as imagens do baralho.

Não é necessário `npm install`, `pip install`, servidor HTTP ou VS Code.
