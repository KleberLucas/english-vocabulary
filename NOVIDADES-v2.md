# Arcana Atlas · Atualização 2

## Novos quizzes

- **Caminhos — múltipla escolha:** 22 perguntas novas do tipo “O caminho N liga quais Sephiroth?”, baseadas nas letras ativadas.
- **Arcanos — múltipla escolha:** 22 perguntas novas sobre os extremos dos caminhos dos 22 Arcanos Maiores ativados, com a imagem da carta.
- **Árvore da Vida — caminho:** 22 desafios em que o aluno seleciona as duas Sephiroth diretamente na árvore, a partir do número do caminho.
- **Árvore da Vida — arcano:** 22 desafios com a carta exibida em imagem e seleção das Sephiroth na árvore.
- **Ordenação:** 38 desafios de sequência (com todos os Arcanos ativos), em grupos de 5, 8 e 22 cartas, com direções 11→32 ou 32→11. As cartas podem ser reorganizadas por arrastar/soltar ou botões, facilitando o uso no celular.

Total: **656 modelos de desafios** com todos os itens ativos (530 anteriores + 126 novos). As configurações podem reduzir esse número. A modalidade “misturar todas” usa somente blocos curtos de ordenação; os desafios de 8 ou 22 cartas são acessíveis na categoria “Ordenação”.

## Como acessar

1. No menu lateral, escolha **Modo quiz**.
2. Em **Conteúdo ou modalidade**, selecione **Jogo visual · encontre as duas Sephiroth**, **Jogo de ordenação · Arcanos Maiores** ou **Caminhos e Arcanos · múltipla escolha**.
3. Para ordenação, ajuste o tamanho do desafio e a direção antes de começar. Se houver menos de 5 cartas maiores ativas, o sistema utilizará as disponíveis (mínimo de três).
4. O modo visual mostra um caminho ou uma carta; clique em **duas Sephiroth** e em **Conferir**. É possível desmarcar antes de confirmar.
5. Após confirmar, a árvore mostra o caminho correto e a correção da resposta.

## Regra da sequência

“De cima para baixo” significa a **ordem numérica dos caminhos 11→32** na Cabala Hermética da Golden Dawn, e “de baixo para cima”, a ordem **32→11**. Essa é uma convenção de estudo: não equivale a simplesmente ordenar a posição vertical do desenho da árvore.

## Compatibilidade e persistência

O app continua em HTML, CSS e JavaScript puro, sem dependências de terceiros. `localStorage` mantém a mesma chave `arcana-atlas-v1`. Para trocar de pasta, navegador ou dispositivo, exporte o backup JSON da versão anterior e importe na nova, em Configurações.

As imagens permanecem no esquema original: arquivo local se existir, ou tentativa online. Use `baixar-cartas.cmd` no Windows para disponibilizá-las offline.
