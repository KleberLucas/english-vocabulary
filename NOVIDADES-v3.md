# ARCANA ATLAS V3 — Personalização por modelo de pergunta

## O que mudou?

Agora o Modo Quiz tem **dois níveis de filtro**:

1. **Conteúdo ou modalidade:** letras, tarot, Sephiroth, mundos, pilares, caminhos, jogo visual, ordenação ou todos.
2. **Tipo de pergunta:** abre uma lista com checkboxes. Escolha **Todos os tipos**, um único modelo, ou quantos quiser combinar.

As escolhas por categoria e a categoria/quantidade da última sessão ficam salvas no navegador. A opção **Misturar todas** tem um filtro próprio, independente das seleções feitas em cada categoria individual.

### Exemplo: apenas uma pergunta específica

1. Abra **Modo Quiz**.
2. Em **Conteúdo ou modalidade**, selecione **Letras hebraicas e caminhos**.
3. Abra **Tipo de pergunta** e desmarque **Todos os tipos de pergunta**.
4. Marque **Número do caminho → apenas símbolos hebraicos**.
5. Escolha quantas questões deseja e clique em **Começar sessão**.

O quiz exibirá números de caminho (11 a 32) e quatro alternativas formadas **apenas pelos símbolos hebraicos**. Você poderá ativar mais de um tipo sem precisar reconfigurar as 22 letras.

### Outras possibilidades

- **Nome da letra pelo caminho:** escolha **Número do caminho → nome da letra**.
- **Símbolo pelo nome:** escolha **Nome da letra → escolha o símbolo**.
- **Árvore da Vida só pelos caminhos:** em **Jogo visual**, escolha apenas o modelo que apresenta o número de caminho.
- **Árvore da Vida só pelos Arcanos:** marque apenas o modelo que apresenta a imagem da carta.
- **Arcanos apenas ascendentes:** em **Ordenação**, marque 32→11; ajuste também o número de cartas do desafio.
- **Nomes divinos:** em **Sephiroth e correspondências**, deixe ativo apenas **Sephirah → nome divino**.

### Compatibilidade

- Código em HTML, CSS e JS puro, funcionando sem backend.
- Os arquivos da V3 substituem os da V2; mantenha a pasta `assets/cards` se tiver baixado as imagens.
- A mesma chave de armazenamento foi mantida. Recomendamos exportar um backup em **Configurações** antes de substituir arquivos.
- Backups da V1/V2 continuam aceitos; tipos de pergunta ausentes nesses backups serão ativados automaticamente.
- Banco atualizado: 700 modelos em 37 tipos; 682 entram na mistura padrão por causa dos tamanhos de ordenação.
