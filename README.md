# Pixel Studio

Um editor de pixel art executado inteiramente no navegador — sem back-end, sem contas, sem instalação de plugins. Desenhe em uma grade de 8×8 a 64×64, exporte PNGs nítidos e sem anti-aliasing, e salve seus projetos localmente ou como arquivos `.json` portáveis.

Este projeto foi construído como peça de portfólio para demonstrar front-end, design de interface e fundamentos de game/tooling development: toda a lógica de edição — grade, undo/redo, flood fill, exportação — foi implementada do zero sobre a Canvas API, sem bibliotecas prontas de pixel art.

## Features

- **Grade configurável**: 8×8, 16×16 (padrão), 32×32 ou 64×64
- **Lápis** com pintura contínua ao arrastar (Pointer Events)
- **Borracha** com transparência real (sem cor "falsa" de fundo)
- **Conta-gotas** para copiar a cor de qualquer pixel já pintado
- **Balde de tinta** (flood fill) sobre regiões conectadas de mesma cor
- **Paleta** persistida no navegador, com adição e remoção de cores
- **Seletor de cor** nativo, com campo hexadecimal editável e leitura RGB
- **Undo / Redo** com atalhos de teclado e histórico limitado (evita uso excessivo de memória)
- **Limpar tela**, com confirmação apenas quando há algo para perder
- **Exportação PNG** em resolução nativa ou em 128/256/512 px, com transparência preservada e pixels perfeitamente nítidos
- **Importação de imagem**, reamostrada para a grade com nearest-neighbor real
- **Projetos**: salvar no navegador, exportar/importar como `.json`
- **Atalhos de teclado**: `P` `E` `I` `F` para ferramentas, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+S`

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) como bundler e dev server
- Canvas API (nativa do navegador) para toda a renderização — nenhuma biblioteca de canvas/pixel art
- CSS puro, com um pequeno conjunto de tokens de design (cores, tipografia, espaçamento)

Nenhuma dependência de runtime além de `react`/`react-dom`.

## Screenshots

_(espaço reservado — adicione capturas de tela do editor aqui antes de publicar)_

```
docs/screenshot-canvas.png
docs/screenshot-export.png
```

## Como executar

```bash
npm install
npm run dev
```

O Vite abrirá o app em `http://localhost:5173` (ou próxima porta livre).

## Build

```bash
npm run build
```

Isso roda a verificação de tipos (`tsc -b`) e gera os arquivos de produção em `dist/`. Para pré-visualizar o build:

```bash
npm run preview
```

## Arquitetura

A arte é representada como uma matriz "achatada" (`PixelData`): um array unidimensional de `string | null` (cor hexadecimal ou transparente), acompanhado do tamanho da grade. Essa representação lógica é a fonte da verdade — o canvas é apenas a sua visualização.

```ts
interface PixelData {
  size: 8 | 16 | 32 | 64;
  pixels: (string | null)[]; // index = row * size + col
}
```

Pontos-chave de implementação:

- **`usePixelGrid`** guarda essa matriz em uma `ref` (não em estado do React) e expõe ações (`beginStroke`, `paintDuringStroke`, `endStroke`, `applyFill`, `undo`, `redo`, ...). Durante um traço de lápis/borracha, cada pixel atravessado é pintado diretamente na `ref` e desenhado na hora com uma chamada imperativa ao contexto 2D do canvas — **nenhum re-render do React acontece a cada movimento do mouse**. Um único estado (`version`) é incrementado apenas ao final do traço (ou em ações discretas como fill/clear/undo), disparando um redraw completo como garantia de consistência.
- **Grade e checkerboard** (indicador de transparência) são camadas de CSS separadas, empilhadas atrás do canvas — a arte exportada nunca inclui essas linhas, porque a exportação é gerada diretamente a partir de `PixelData`, não de uma captura da tela.
- **Flood fill** e **importação de imagem** são funções puras que operam sobre `PixelData`, iterativas (sem recursão), o que evita estouro de pilha em grades grandes.
- **Undo/redo** guarda snapshots compactos (cópias rasas do array de pixels) em uma pilha limitada a 50 passos.

Essa separação entre representação lógica e renderização é o que deve permitir, no futuro, adicionar camadas (layers), frames de animação e spritesheets sem reescrever o núcleo do editor.

## Roadmap

- [ ] Layers
- [ ] Animation timeline
- [ ] Onion skin
- [ ] Spritesheet export
- [ ] Mirror tool
- [ ] Line tool
- [ ] Rectangle tool
- [ ] Circle tool
- [ ] Custom palettes
- [ ] Cloud projects
