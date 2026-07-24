/* ==========================================================================
   MKL SERVIÇOS - JAVASCRIPT INTERACTIVITY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCalculator();
  initTabsFilter();
  initModalSystem();
  initAnimatedCounters();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE BUDGET CALCULATOR (SIMULADOR)
   -------------------------------------------------------------------------- */
function initCalculator() {
  const serviceCards = document.querySelectorAll('.calc-option-card');
  const sizeRange = document.getElementById('sizeRange');
  const rangeAreaVal = document.getElementById('rangeAreaVal');
  const rangeSubText = document.getElementById('rangeSubText');
  const checkboxes = document.querySelectorAll('.checklist-grid input[type="checkbox"]');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const sumService = document.getElementById('sumService');
  const sumArea = document.getElementById('sumArea');
  const sumDays = document.getElementById('sumDays');
  const btnSendWhatsappCalc = document.getElementById('btnSendWhatsappCalc');

  if (!serviceCards.length || !sizeRange || !priceDisplay) return;

  let currentService = {
    name: 'Reforma Residencial',
    basePrice: 1500,
    multiplier: 25 // R$ 25 por m²
  };

  // Service Selection
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const serviceType = card.getAttribute('data-service');
      const base = parseInt(card.getAttribute('data-base')) || 1000;

      if (serviceType === 'residencial') {
        currentService = { name: 'Reforma Residencial', basePrice: base, multiplier: 25 };
      } else if (serviceType === 'predial') {
        currentService = { name: 'Reforma Predial', basePrice: base, multiplier: 35 };
      } else if (serviceType === 'eletrica') {
        currentService = { name: 'Elétrica em Geral', basePrice: base, multiplier: 18 };
      } else if (serviceType === 'emergencia') {
        currentService = { name: 'Atendimento Emergencial 24h', basePrice: base, multiplier: 10 };
      }

      updateCalculation();
    });
  });

  // Size Range Input
  sizeRange.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    rangeAreaVal.textContent = `${val} m²`;

    if (val <= 40) {
      rangeSubText.textContent = '(Pequeno Porte / Cômodo)';
    } else if (val <= 120) {
      rangeSubText.textContent = '(Médio Porte / Ap. Padrão)';
    } else {
      rangeSubText.textContent = '(Grande Porte / Casa / Condomínio)';
    }

    updateCalculation();
  });

  // Checkbox items
  checkboxes.forEach(chk => {
    chk.addEventListener('change', updateCalculation);
  });

  function updateCalculation() {
    const area = parseInt(sizeRange.value);
    let total = currentService.basePrice + (area * currentService.multiplier);

    const selectedExtras = [];
    checkboxes.forEach(chk => {
      if (chk.checked) {
        const extraVal = parseInt(chk.value) || 0;
        total += extraVal;
        const labelText = chk.closest('.checkbox-card').querySelector('span:last-child').textContent;
        selectedExtras.push(labelText);
      }
    });

    // Formatting price (BRL)
    const formattedPrice = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    priceDisplay.textContent = formattedPrice;

    // Update Summary
    if (sumService) sumService.textContent = currentService.name;
    if (sumArea) sumArea.textContent = `${area} m²`;

    // Estimate Days
    let days = '3 a 5 Dias';
    if (area > 80 && area <= 150) days = '7 a 12 Dias';
    if (area > 150) days = '15 a 25 Dias';
    if (sumDays) sumDays.textContent = days;

    // Format WhatsApp Link
    const waPhone = "5511940392547";
    const waText = encodeURIComponent(
      `*Olá, MKL Serviços! Fiz uma simulação pelo site:*
` +
      `---------------------------------------
` +
      `📌 *Serviço:* ${currentService.name}
` +
      `📐 *Área/Porte:* ${area} m²
` +
      `🛠️ *Adicionais:* ${selectedExtras.length ? selectedExtras.join(', ') : 'Nenhum'}
` +
      `💰 *Estimativa do Site:* ${formattedPrice}
` +
      `⏱️ *Prazo Estimado:* ${days}
` +
      `---------------------------------------
` +
      `Gostaria de agendar uma visita técnica gratuita!`
    );

    if (btnSendWhatsappCalc) {
      btnSendWhatsappCalc.href = `https://wa.me/${waPhone}?text=${waText}`;
    }
  }

  // Initial Calculation Run
  updateCalculation();
}

/* --------------------------------------------------------------------------
   3. SERVICES TAB FILTER
   -------------------------------------------------------------------------- */
function initTabsFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('#servicesGrid .service-card');

  if (!tabBtns.length || !serviceCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tab');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'todos' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. MODAL SYSTEM FOR SERVICE DETAILS
   -------------------------------------------------------------------------- */
function initModalSystem() {
  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const detailButtons = document.querySelectorAll('.btn-detail-modal');

  if (!modalOverlay || !modalBody || !modalClose) return;

  const serviceData = {
    'modal-residencial': {
      title: 'Reforma Residencial Completa',
      badge: 'Acabamento de Alto Padrão',
      img: './images/reforma_residencial.png',
      desc: 'Nossa equipe realiza reformas completas para apartamentos e residências com planejamento detalhado, evitando desperdício de materiais e mantendo o ambiente limpo.',
      items: [
        'Pintura acrílica, látex e textura decorativa',
        'Troca e nivelamento de pisos e porcelanatos',
        'Reformas completas de banheiros e cozinhas',
        'Sancas de gesso e iluminação embutida',
        'Substituição de portas, esquadrias e acabamentos'
      ]
    },
    'modal-predial': {
      title: 'Reforma e Manutenção Predial',
      badge: 'Soluções Condominiais',
      img: './images/reforma_predial.png',
      desc: 'Serviços especializados para condomínios residenciais e empresariais com foco em conservação patrimonial, valorização do imóvel e segurança dos moradores.',
      items: [
        'Restauração, lavagem e pintura de fachadas',
        'Impermeabilização de lajes, caixas d’água e marquises',
        'Tratamento de trincas, fissuras e umidade',
        'Reforma de portarias, garagens e salões de festa',
        'Cumprimento rigoroso das normas NBR de construção'
      ]
    },
    'modal-eletrica': {
      title: 'Instalações Elétricas em Geral',
      badge: 'Segurança NBR 5410',
      img: './images/eletrica_geral.png',
      desc: 'Projetos e execuções elétricas com máxima segurança contra curtos-circuitos, sobrecargas e desperdício de energia. Eletricistas qualificados.',
      items: [
        'Montagem e reorganização de quadros de disjuntores (QDF)',
        'Substituição de fiação antiga por cabos antichama',
        'Instalação de tomadas, interruptores e padrão de entrada',
        'Projetos de iluminação arquitetônica e fitas LED',
        'Atendimento emergencial 24 horas para curtos e falhas'
      ]
    },
    'modal-laudos': {
      title: 'Laudos Técnicos e Vistoria ART',
      badge: 'Engenharia Certificada',
      img: './images/eletrica_geral.png',
      desc: 'Emissão de documentação oficial necessária para habite-se, seguro predial, renovação do AVCB (Corpo de Bombeiros) e vistoria prévia de reformas.',
      items: [
        'Análise termográfica de painéis elétricos',
        'Aterramento elétrico e medição de SPDA (para-raios)',
        'Emissão de ART por engenheiro responsável',
        'Relatórios de conformidade com NBR 5410 e NR-10'
      ]
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const data = serviceData[modalKey];

      if (data) {
        modalBody.innerHTML = `
          <div class="modal-badge-tag">${data.badge}</div>
          <h2 class="modal-title">${data.title}</h2>
          <img src="${data.img}" alt="${data.title}" class="modal-img">
          <p class="modal-desc">${data.desc}</p>
          <h4 class="modal-sub">O que está incluso neste serviço:</h4>
          <ul class="modal-list">
            ${data.items.map(item => `<li><i class="fa-solid fa-circle-check text-accent"></i> ${item}</li>`).join('')}
          </ul>
          <div class="modal-cta">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(data.title)}" target="_blank" class="btn btn-primary btn-full">
              <i class="fa-brands fa-whatsapp"></i> Solicitar Orçamento no WhatsApp
            </a>
          </div>
        `;
        modalOverlay.classList.add('active');
      }
    });
  });

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. ANIMATED STATS COUNTER ON SCROLL
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function checkScroll() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100 && !animated) {
      animated = true;

      statNumbers.forEach(numElement => {
        const target = parseInt(numElement.getAttribute('data-target')) || 0;
        let count = 0;
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 15);

        const timer = setInterval(() => {
          count += Math.ceil(target / 40);
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          numElement.textContent = target === 99 ? `${count}%` : `${count}+`;
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('serviceType').value;
      const message = document.getElementById('message').value;

      const waText = encodeURIComponent(
        `*Nova solicitação via site MKL Serviços:*
` +
        `👤 *Nome:* ${name}
` +
        `📞 *Telefone:* ${phone}
` +
        `🛠️ *Serviço:* ${service}
` +
        `📝 *Mensagem:* ${message}`
      );

      alert(`Obrigado ${name}! Redirecionando para o WhatsApp da MKL Serviços...`);
      window.open(`https://wa.me/5511940392547?text=${waText}`, '_blank');
      form.reset();
    });
  }
}
