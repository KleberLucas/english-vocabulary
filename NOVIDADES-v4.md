# ARCANA ATLAS V4 — Lousa de escrita hebraica

## Nova modalidade no quiz

Acesse **Modo quiz → Conteúdo ou modalidade → ✍ Lousa · desenhar letras hebraicas**.

O jogo mostra o nome e a pronúncia de uma letra ativa — por exemplo, **"Desenhe a letra Gimel"** — sem revelar o símbolo. Use **mouse, touch ou caneta** na lousa. Você pode **Desfazer traço**, **Limpar lousa** e **Avaliar meu desenho**.

A correção apresenta **semelhança estimada de 0 a 100**, uma indicação de acerto/erro e a comparação lado a lado entre o desenho e a letra hebraica impressa. O número é uma medida aproximada de forma, **não** a probabilidade de o sistema ter identificado a letra. O limiar de acerto nesta versão é **68/100**, uma escolha didática que não substitui a avaliação humana.

## Como funciona tecnicamente

A lousa é um elemento `<canvas>`; eventos de ponteiro (`Pointer Events`) atendem mouse, dedo e caneta. A avaliação é feita **inteiramente no JavaScript do navegador**:

1. Identifica os pixels de tinta e recorta o retângulo ocupado pelo desenho.
2. Centraliza e normaliza o formato, preservando as proporções.
3. Afinam-se os traços para reduzir o efeito da espessura do pincel.
4. Compara-se a proximidade geométrica do contorno com a letra impressa em fontes comuns do sistema, incluindo variações de fonte.
5. Combina-se cobertura e distância entre traços para gerar a pontuação de semelhança.

O sistema **não possui IA, OCR aprendido, modelo de visão, API nem servidor**. Por isso, desenhos muito estilizados, com proporções distintas, podem receber notas imprecisas. É um **exercício orientativo de memorização**, não um avaliador de caligrafia confiável em todos os estilos. O modelo de comparação é baseado na **forma impressa das letras hebraicas**, não na escrita cursiva moderna.

## Integração com o restante do curso

- **22 novos desafios**, um para cada letra hebraica.
- **722 desafios-base** no banco completo, com todas as cartas e letras habilitadas.
- **704** elegíveis por padrão em **Misturar todas**, pois a ordenação nesse modo usa apenas variações curtas.
- **38 tipos selecionáveis** de pergunta, incluindo a nova lousa.
- A opção nova também aparece no filtro múltiplo de tipos de pergunta quando a categoria é **Misturar todas**.
- A categoria **Lousa** pode ser escolhida sozinha para praticar apenas caligrafia.
- Respeita as letras ativas/desativadas em **Configurações**; se apenas Gimel estiver habilitada, os desafios de desenho terão apenas Gimel.
- Os resultados entram no histórico de acertos e erros local; a imagem desenhada **não** é salva no `localStorage` nem enviada à internet.
- As configurações, progresso e seleção de tipos da V3 usam a mesma chave `arcana-atlas-v1`. Seleções antigas continuam válidas.

## Atualização da V3

1. Na V3, abra **Configurações → Exportar progresso e configurações** para fazer um backup opcional.
2. Extraia esta V4 **na mesma pasta** onde a V3 era aberta, substituindo `index.html`, `app.js`, `data.js`, `styles.css` e adicionando o novo `drawing.js`.
3. Se já tiver as imagens do Tarot em `assets/cards`, mantenha essa pasta.
4. Caso o navegador apresente uma origem diferente, use **Importar arquivo** para restaurar seu backup.

O projeto continua sem frameworks, sem dependências, sem instalação, com **HTML, CSS e JavaScript puro**. A lousa funciona offline. As imagens históricas do Rider–Waite–Smith ainda podem requerer o baixador `baixar-cartas.cmd` ou conexão à internet.
