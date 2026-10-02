/*
 * main.js
 * Interações da página da Alves Imóveis:
 *   1. Cabeçalho que muda ao rolar + menu mobile
 *   2. Vitrine de imóveis (destaque + lista lateral + filtros)
 *   3. Simulador de financiamento (Tabela Price)
 *   4. Formulário de contato que monta a mensagem e abre o WhatsApp
 *
 * Segurança: nenhum dado do usuário é inserido com innerHTML — todo texto
 * entra via textContent e as entradas são sanitizadas antes de virar URL.
 */

(() => {
  'use strict';

  /* ── Constantes ─────────────────────────────────────────────── */
  const WHATSAPP_NUMBER = '5535991234567';
  const ANNUAL_INTEREST_RATE = 0.105; // juros de referência do simulador (10,5% a.a.)

  // Formatador de moeda brasileira sem centavos
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });

  // Formatador numérico simples (separador de milhar)
  const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  /* ── Utilidades ─────────────────────────────────────────────── */

  // Remove caracteres de controle, junta espaços repetidos e limita o tamanho
  const sanitizeText = (value, maxLength) =>
    String(value ?? '')
      .replace(/[\u0000-\u001F\u007F-\u009F<>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength);

  // Monta o link do WhatsApp com a mensagem já codificada para URL
  const buildWhatsAppLink = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // Cria um elemento com classe e texto opcionais (atalho seguro para o DOM)
  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  /* ════════════════ 1. Cabeçalho e menu ════════════════ */

  // Adiciona fundo ao cabeçalho depois que a página rola um pouco
  const initHeader = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  // Abre/fecha o menu mobile e fecha ao clicar num link ou pressionar Esc
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('menu-principal');
    if (!toggle || !nav) return;

    const label = toggle.querySelector('.sr-only');

    const setOpen = (isOpen) => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      nav.classList.toggle('is-open', isOpen);
      if (label) label.textContent = isOpen ? 'Fechar menu' : 'Abrir menu';
      document.body.classList.toggle('menu-open', isOpen);
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  };

  /* ════════════════ 2. Vitrine de imóveis ════════════════ */

  // Base de imóveis exibidos na vitrine (dados fixos de demonstração)
  const properties = [
    {
      id: 'casa-sao-carlos',
      title: 'Casa com quintal e varanda',
      place: 'Jardim São Carlos',
      deal: 'venda',
      category: 'residencial',
      price: 685000,
      image: 'photo-1512917774080-9991f1c4c750',
      alt: 'Casa térrea com varanda de madeira, telhado aparente e gramado na frente',
      specs: [['3', 'quartos'], ['2', 'banheiros'], ['180 m²', 'área'], ['2', 'vagas']],
    },
    {
      id: 'apto-centro',
      title: 'Apartamento perto da UNIFAL',
      place: 'Centro',
      deal: 'locacao',
      category: 'residencial',
      price: 1850,
      image: 'photo-1522708323590-d24dbb6b0267',
      alt: 'Sala de apartamento integrada com cozinha, sofá claro e janelas amplas',
      specs: [['2', 'quartos'], ['1', 'banheiro'], ['68 m²', 'área'], ['1', 'vaga']],
    },
    {
      id: 'sobrado-aeroporto',
      title: 'Sobrado com área gourmet',
      place: 'Jardim Aeroporto',
      deal: 'venda',
      category: 'residencial',
      price: 920000,
      image: 'photo-1600596542815-ffad4c1539a9',
      alt: 'Sobrado moderno com fachada iluminada, jardim e entrada de garagem',
      specs: [['4', 'quartos'], ['3', 'banheiros'], ['260 m²', 'área'], ['3', 'vagas']],
    },
    {
      id: 'sala-comercial',
      title: 'Sala comercial pronta para uso',
      place: 'Centro',
      deal: 'locacao',
      category: 'comercial',
      price: 3200,
      image: 'photo-1497366216548-37526070297c',
      alt: 'Escritório amplo com mesas de trabalho, cadeiras e luz natural',
      specs: [['95 m²', 'área'], ['2', 'banheiros'], ['2', 'vagas']],
    },
    {
      id: 'casa-vila-teixeira',
      title: 'Casa térrea aconchegante',
      place: 'Vila Teixeira',
      deal: 'venda',
      category: 'residencial',
      price: 420000,
      image: 'photo-1570129477492-45c003edd2be',
      alt: 'Casa de dois pavimentos com fachada clara, gramado e árvores ao redor',
      specs: [['2', 'quartos'], ['1', 'banheiro'], ['110 m²', 'área'], ['1', 'vaga']],
    },
    {
      id: 'kitnet-pinheirinho',
      title: 'Kitnet mobiliada',
      place: 'Pinheirinho',
      deal: 'locacao',
      category: 'residencial',
      price: 950,
      image: 'photo-1502672260266-1c1ef2d93688',
      alt: 'Ambiente compacto mobiliado com sofá, mesa e janela com cortina clara',
      specs: [['1', 'quarto'], ['1', 'banheiro'], ['32 m²', 'área']],
    },
  ];

  // Monta a URL da imagem no Unsplash com a largura/qualidade adequada
  const unsplashUrl = (photoId, width, quality) =>
    `https://images.unsplash.com/${photoId}?w=${width}&q=${quality}`;

  // Texto do tipo de negócio exibido no selo (ex.: "Comercial · Locação")
  const dealLabel = (property) => {
    const deal = property.deal === 'venda' ? 'Venda' : 'Locação';
    return property.category === 'comercial' ? `Comercial · ${deal}` : deal;
  };

  // Preenche um elemento com o preço; aluguel ganha o sufixo "/mês"
  const fillPrice = (element, property) => {
    element.textContent = currencyFormatter.format(property.price);
    if (property.deal === 'locacao') element.appendChild(createElement('small', '', '/mês'));
  };

  // Verifica se um imóvel passa no filtro selecionado
  const matchesFilter = (property, filter) => {
    if (filter === 'todos') return true;
    if (filter === 'comercial') return property.category === 'comercial';
    return property.deal === filter;
  };

  const initListings = () => {
    const feature = document.querySelector('.feature');
    const list = document.getElementById('side-list');
    const emptyMessage = document.querySelector('.side-list__empty');
    const filterButtons = document.querySelectorAll('.filters__btn');
    if (!feature || !list) return;

    // Referências aos campos do destaque
    const featureEls = {
      img: feature.querySelector('.feature__img'),
      badge: feature.querySelector('.feature__badge'),
      place: feature.querySelector('.feature__place'),
      title: feature.querySelector('.feature__title'),
      specs: feature.querySelector('.feature__specs'),
      price: feature.querySelector('.feature__price'),
      cta: feature.querySelector('.feature__cta'),
    };

    let currentId = properties[0].id;
    let currentFilter = 'todos';

    // Atualiza o card de destaque com os dados do imóvel escolhido
    const renderFeature = (property, animate) => {
      featureEls.img.src = unsplashUrl(property.image, 800, 75);
      featureEls.img.alt = property.alt;
      featureEls.badge.textContent = dealLabel(property);
      featureEls.place.textContent = property.place;
      featureEls.title.textContent = property.title;
      fillPrice(featureEls.price, property);

      // Lista de características
      featureEls.specs.replaceChildren(
        ...property.specs.map(([value, label]) => {
          const item = createElement('li', 'feature__spec');
          item.appendChild(createElement('strong', '', value));
          item.appendChild(document.createTextNode(label));
          return item;
        })
      );

      // Link de agendamento já com o nome do imóvel na mensagem
      featureEls.cta.href = buildWhatsAppLink(
        `Olá! Quero agendar uma visita ao imóvel "${property.title}" (${property.place}).`
      );

      // Reinicia a animação de troca
      if (animate) {
        feature.classList.remove('is-swapping');
        void feature.offsetWidth;
        feature.classList.add('is-swapping');
      }
    };

    // Cria uma linha da lista lateral
    const createListItem = (property) => {
      const li = document.createElement('li');
      const button = createElement('button', 'side-item');
      button.type = 'button';
      button.dataset.id = property.id;
      button.setAttribute('aria-label', `Ver ${property.title} em destaque`);

      const thumb = createElement('img', 'side-item__thumb');
      thumb.src = unsplashUrl(property.image, 400, 70);
      thumb.alt = '';
      thumb.loading = 'lazy';

      const info = createElement('span', 'side-item__info');
      info.appendChild(createElement('span', 'side-item__type', `${dealLabel(property)} · ${property.place}`));
      info.appendChild(createElement('span', 'side-item__title', property.title));
      const price = createElement('span', 'side-item__price');
      fillPrice(price, property);
      info.appendChild(price);

      button.append(thumb, info);
      li.appendChild(button);
      return li;
    };

    // Marca visualmente qual item da lista está no destaque
    const markCurrent = () => {
      list.querySelectorAll('.side-item').forEach((button) => {
        const isCurrent = button.dataset.id === currentId;
        button.classList.toggle('is-current', isCurrent);
        button.setAttribute('aria-current', String(isCurrent));
      });
    };

    // Renderiza a lista conforme o filtro e garante um destaque válido
    const renderList = () => {
      const visible = properties.filter((property) => matchesFilter(property, currentFilter));
      list.replaceChildren(...visible.map(createListItem));
      if (emptyMessage) emptyMessage.hidden = visible.length > 0;

      if (visible.length && !visible.some((property) => property.id === currentId)) {
        currentId = visible[0].id;
        renderFeature(visible[0], true);
      }
      markCurrent();
    };

    // Clique em um item da lista → leva o imóvel para o destaque
    list.addEventListener('click', (event) => {
      const button = event.target.closest('.side-item');
      if (!button || button.dataset.id === currentId) return;
      const property = properties.find((item) => item.id === button.dataset.id);
      if (!property) return;
      currentId = property.id;
      renderFeature(property, true);
      markCurrent();

      // Em telas pequenas, rola até o destaque para o usuário ver a troca
      if (window.matchMedia('(max-width: 959px)').matches) {
        feature.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Botões de filtro
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach((other) => {
          const isActive = other === button;
          other.classList.toggle('is-active', isActive);
          other.setAttribute('aria-pressed', String(isActive));
        });
        renderList();
      });
    });

    renderFeature(properties[0], false);
    renderList();
  };

  /* ════════════════ 3. Simulador de financiamento ════════════════ */

  // Calcula a parcela pela Tabela Price: P = V · i / (1 − (1 + i)^−n)
  const calculateInstallment = (financed, annualRate, months) => {
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    if (monthlyRate === 0) return financed / months;
    return (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  // Lê um range garantindo que o valor fique dentro dos limites do input
  const readRange = (input) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const value = Number(input.value);
    if (!Number.isFinite(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  const initSimulator = () => {
    const form = document.getElementById('sim-form');
    if (!form) return;

    const inputs = {
      price: document.getElementById('sim-price'),
      down: document.getElementById('sim-down'),
      years: document.getElementById('sim-years'),
    };
    const outputs = {
      price: document.getElementById('sim-price-out'),
      down: document.getElementById('sim-down-out'),
      years: document.getElementById('sim-years-out'),
      installment: document.getElementById('sim-installment'),
      financed: document.getElementById('sim-financed'),
      term: document.getElementById('sim-term'),
    };

    // Recalcula e atualiza todos os valores exibidos
    const update = () => {
      const price = readRange(inputs.price);
      const downPercent = readRange(inputs.down);
      const years = readRange(inputs.years);

      const downValue = price * (downPercent / 100);
      const financed = price - downValue;
      const months = years * 12;
      const installment = calculateInstallment(financed, ANNUAL_INTEREST_RATE, months);

      outputs.price.textContent = currencyFormatter.format(price);
      outputs.down.textContent = `${downPercent}% · ${currencyFormatter.format(downValue)}`;
      outputs.years.textContent = `${years} anos`;
      outputs.installment.textContent = numberFormatter.format(Math.round(installment));
      outputs.financed.textContent = currencyFormatter.format(financed);
      outputs.term.textContent = `${months} parcelas`;
    };

    form.addEventListener('input', update);
    form.addEventListener('submit', (event) => event.preventDefault());
    update();
  };

  /* ════════════════ 4. Formulário de contato ════════════════ */

  // Textos amigáveis para cada opção do select (lista fechada = sem injeção)
  const interestLabels = {
    comprar: 'comprar um imóvel',
    alugar: 'alugar um imóvel',
    vender: 'vender meu imóvel',
    administrar: 'colocar meu imóvel para alugar',
  };

  // Nome: letras (com acento), espaços, apóstrofo, ponto e hífen
  const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]{1,59}$/u;

  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = form.querySelector('#cf-name');
    const interestInput = form.querySelector('#cf-interest');
    const messageInput = form.querySelector('#cf-message');
    const errorBox = form.querySelector('#cf-error');

    // Exibe ou limpa a mensagem de erro
    const showError = (message) => {
      errorBox.textContent = message;
    };

    // Remove o estado de erro assim que o usuário corrige o nome
    nameInput.addEventListener('input', () => {
      nameInput.removeAttribute('aria-invalid');
      showError('');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = sanitizeText(nameInput.value, 60);
      const details = sanitizeText(messageInput.value, 400);
      const interest = interestLabels[interestInput.value] ?? interestLabels.comprar;

      if (!NAME_PATTERN.test(name)) {
        nameInput.setAttribute('aria-invalid', 'true');
        showError('Digite seu nome (apenas letras, mínimo 2 caracteres).');
        nameInput.focus();
        return;
      }

      // Monta a mensagem final e abre o WhatsApp em nova aba
      let message = `Olá! Meu nome é ${name} e quero ${interest}.`;
      if (details) message += ` Detalhes: ${details}`;

      const link = buildWhatsAppLink(message);
      const whatsappWindow = window.open(link, '_blank');
      if (whatsappWindow) {
        // Impede que a nova aba tenha acesso a esta página
        whatsappWindow.opener = null;
      } else {
        // Pop-up bloqueado: abre na mesma aba
        window.location.href = link;
      }

      form.reset();
      showError('');
    });
  };

  /* ── Inicialização ──────────────────────────────────────────── */
  initHeader();
  initMobileNav();
  initListings();
  initSimulator();
  initContactForm();
})();
