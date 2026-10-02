# prompt.md — Alves Imóveis

> Leia o CLAUDE.md antes de qualquer código.
> Siga todas as convenções: Design (padrões PROIBIDOS) e Animations.

---

## Objetivo

Site portfólio único, animado e com identidade própria. Design original, sem padrões genéricos.

---

## Dados do comércio

- **Nome:** Alves Imóveis
- **Nicho:** Imobiliária
- **Cidade:** Alfenas, MG
- **Descrição:** Especializada em compra, venda e locação de imóveis residenciais e comerciais em Alfenas e região. 12 anos no mercado, mais de 800 famílias atendidas.
- **Instagram:** @alvesimoveis
- **WhatsApp:** https://wa.me/5535991234567

---

## Identidade visual

- **Estilo:** Rústico e aconchegante
- **Cor primária:** #1a3a5c → `--color-primary`
- **Cor secundária:** #f5f0e8 → `--color-secondary`
- **Cor acento:** #c9a84c → `--color-accent`
- **Fonte títulos:** Poppins → `--font-display`
- **Fonte corpo:** Roboto → `--font-body`
- **Logo:** Não tem — criar logotipo tipográfico

---

## Fotos / assets

  - (sem fotos — usar Unsplash via URL)

## Imagens via URL
Usar Unsplash no src (w=1600 hero, w=800 galeria, w=400 cards). Nunca placeholders.

---

## Estrutura de arquivos

```
alves-imoveis/
├── CLAUDE.md
├── .gitignore
├── prompt.md
├── index.html
├── components/
│   ├── simple-anime.js
│   ├── simple-anime.css
│   ├── origin-button.js
│   └── origin-button.css
├── css/
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   └── index.css
├── js/
│   └── main.js
└── assets/
    └── images/
```

---

## Seções e layouts

1. **hero** → Full-screen (imagem fundo)
2. **imoveis** → Destaque + lista lateral
3. **diferenciais** → Cards com preço
4. **depoimentos** → Masonry (irregular)
5. **contato** → Fundo colorido + CTA
6. **sobre** → Citação + foto pequena

---

## Requisitos

- Ler CLAUDE.md antes de qualquer código
- Mobile-first, 100% responsivo
- Cores via CSS custom properties em `css/variables.css`
- Nunca inline styles
- WhatsApp flutuante → https://wa.me/5535991234567
- Google Fonts: Poppins + Roboto
- Comentários em português

## Animações (obrigatório)

No `<head>`:
```html
<link rel="stylesheet" href="components/simple-anime.css">
<link rel="stylesheet" href="components/origin-button.css">
```

Antes do `</body>`:
```html
<script src="components/simple-anime.js"></script>
<script src="components/origin-button.js"></script>
<script>new SimpleAnime();</script>
```

Adicionar `data-anime` em todos os elementos:
```html
<h1 data-anime="0" class="fadeInUp">Título</h1>
<p data-anime="200" class="fadeInUp">Subtítulo</p>
<button data-anime="400" class="fadeInUp origin-btn origin-btn-primary">CTA</button>
```

| Contexto | Botão |
|---|---|
| CTA principal, agendamento, WhatsApp | `origin-btn origin-btn-primary` |
| Botão secundário, "saiba mais" | `flow-btn` |
| Tema dourado | `origin-btn-gold` ou `flow-btn-gold` |
| Fundo escuro | `flow-btn-white` |

## SEO

```html
<title>Alves Imóveis — Imobiliária em Alfenas, MG</title>
<meta name="description" content="Especializada em compra, venda e locação de imóveis residenciais e comerciais em Alfenas e região. 12 anos no mercado, mais de 800 famílias " >
<meta name="keywords" content="imobiliária, Alves Imóveis">
<meta property="og:title" content="Alves Imóveis — Imobiliária em Alfenas, MG">
<meta name="theme-color" content="#1a3a5c">
```


---
*Gerado em 02/10/2026 às 14:09*