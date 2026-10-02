/**
 * simple-anime.js
 * Animações de entrada disparadas ao rolar a página (scroll).
 *
 * USO:
 *   <script src="components/simple-anime.js"></script>
 *   <script>new SimpleAnime();</script>
 *
 *   <h1 data-anime="0" class="fadeInUp">Título</h1>   // valor = delay em ms
 *
 * Cada elemento [data-anime] recebe a classe .anime (estado final) quando entra
 * na viewport, respeitando o delay informado. A direção da entrada é definida
 * pelas classes de simple-anime.css (fadeInUp, fadeInLeft, fadeInScale...).
 */
class SimpleAnime {
  constructor(options = {}) {
    // Elementos que serão animados
    this.items = document.querySelectorAll('[data-anime]');
    // Fração do elemento que precisa estar visível para disparar
    this.threshold = options.threshold ?? 0.12;
    this.init();
  }

  // Aplica a classe final respeitando o delay (em ms) do atributo data-anime
  reveal(item) {
    const delay = Number(item.getAttribute('data-anime'));
    setTimeout(() => {
      // Força o navegador a calcular o estado inicial antes de trocar de classe;
      // sem isso, itens com delay 0 podem aparecer sem transição.
      void item.offsetWidth;
      item.classList.add('anime');
    }, Number.isNaN(delay) ? 0 : delay);
  }

  init() {
    // Sem IntersectionObserver: mostra tudo de imediato (a preferência de
    // movimento reduzido é tratada no CSS, mantendo apenas um fade suave)
    if (!('IntersectionObserver' in window)) {
      this.items.forEach((item) => item.classList.add('anime'));
      return;
    }

    // Observa cada item e revela apenas uma vez, quando entra na tela
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this.reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: this.threshold, rootMargin: '0px 0px -6% 0px' }
    );

    this.items.forEach((item) => observer.observe(item));
  }
}

window.SimpleAnime = SimpleAnime;
