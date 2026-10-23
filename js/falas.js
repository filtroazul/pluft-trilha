/* a trilha: todas as falas do jogo, num lugar só */
(function () {
  const P = window.P;

  P.T = {
    inicio: {
      titulo: 'a trilha',
      sub: 'tá escuro. fica perto da luz.',
      botao: 'entrar',
      nota: 'com som, de preferência. e fora do silencioso.',
    },

    cutucadas: [
      'ei.',
      'sou eu mesmo, pode relaxar.',
      'não cutuca. eu tô nervoso.',
      'quer parar? vc tá me assustando.',
    ],

    /* ---------- 1. a trilha ---------- */
    trilha: {
      abre: ['tá muito escuro.', 'eu nem sei como vim parar aqui.', 'só tenho a lanterna. melhor andar.'],
      escolha1: 'toque no caminho que vc quer seguir',
      escolha: 'qual caminho?',

      ev: {
        howl: ['isso foi um lobo.', 'longe. foi longe. eu acho.'],
        passos: ['tem passo atrás de mim.', 'não tem ninguém. continua andando.'],
        olhos: ['tem dois olhos ali.', 'sumiram. eu não vi nada.'],
        galho: ['um galho quebrou. perto.', 'foi o vento. foi o vento.'],
        coruja: ['é só uma coruja.', 'é só uma coruja. respira.'],
        uivoPerto: ['esse foi perto demais.', 'tem coisa por todo lado.'],
      },

      relance: ['tinha alguém ali.', 'um vulto. passou correndo.'],
      vulto: ['tem alguém parado na trilha.', 'não tá se mexendo.'],
      decisao: ['ir até lá', 'voltar'],
      voltar: ['atrás também tem coisa.', 'então é pra frente.'],
      passo: 'toque pra dar um passo',
      passo2: 'devagar. mais um toque',
      p1: 'ele não tá se mexendo.',
      p3: 'ele ouviu.',
      p4: 'tá tremendo?',
    },

    /* ---------- 2. o encontro ---------- */
    encontro: {
      grito: 'AAAAAAAAAAAH',
      nao: ['n-n-n-não me come!!', 'eu sou duro! eu tenho gosto de mato!'],
      ela: ['calma. sou eu.', 'tá tudo bem.'],
      dica: 'segure o dedo nele pra acalmar',
      l1: 'respira.',
      l2: 'eu respiro junto.',
      demora: ['sem pressa.', 'a lanterna não morde.'],
      ah: ['...', 'ah.', 'é vc.'],
      fugi: [
        'eu fugi de vc a floresta inteira.',
        'vi um vulto enorme com uma luz e pensei, é o monstro da floresta, é agora que eu viro janta.',
        'a sombra da sua lanterna é gigante, sabia?',
      ],
      porque: 'o que vc tá fazendo aqui sozinho?',
      resp: [
        'e-eu... é que...',
        'eu vim te procurar. eu t-tenho umas coisas pra te dizer.',
        'só que toda vez que eu vou falar o negócio sai todo torto. t-torto assim, ó.',
        'peraí.',
      ],
      frio: ['tá frio, né.', 'me ajuda a acender essa fogueira? eu tenho medo de fósforo, mas com vc eu tenho menos.'],
      dicaFogo: 'toque na lenha pra acender',
      fogo: ['pronto.', 'agora dá pra ver a sua cara.', 'tá bem melhor.'],
      papel: ['vou fazer diferente. eu não consigo falar, então eu escrevo.', 'tenho um papel amassado aqui. é o que sobrou da floresta.'],
    },

    /* ---------- 3. os papéis ---------- */
    papeis: {
      escreve: ['...', '(escrevendo)'],
      entre: [
        'ainda tem mais.',
        'esse eu escrevi tremendo, desculpa a letra.',
        'tá borrado. foi o suor. não foi choro. foi o suor.',
        'não olha, esse tá feio. mas é verdade.',
        'só mais um. só mais um. é o importante.',
        'peraí, tô organizando.',
      ],
      /* um papel por elogio. cada um vira uma tela de papel rasgado */
      lista: [
        'em uma floresta inteira em um breu e uma escuridão avassaladora, você é uma protagonista que acende na mata densa que rouba até mesmo a cena do céu estrelado. e no teu brilho eu me guio',
        'e porque eu te equiparo às estrelas? bom, vc simplesmente entra em coisas GIGANTESCAS com vontades e ambições absurdas, sem garantia de nada e vai com medo mesmo. alguém corajosa como você não se esconde só nessa beleza radiante que reside em ti.',
        'o jeito que você pensa é proporcional à moldura que seus olhos são. congruente ao mundo que resguarda nesse fito profundo seu, em um mundo que permite sonhar quando olho no teu olhar.',
        'você é alguém que vale muito mais a pena ter por perto do que sequer um dia imaginei. quase ninguém repara em como você se preocupa do pouco ao máximo, em como você dá a mão as vezes se não até o braço pra quem é próximo de você.',
        'vc ri de um jeito que desarma o lugar inteiro. eu tava de cara fechada pro mundo e vc soltou uma risada e o mundo encolheu. isso é poder, viu. acho que vc nem usa de propósito, e é por isso que funciona.',
        'e em ti sonho acordado com um mundo de possibilidades que antes pareciam impossíveis. pois cada vez mais tenho certeza que te admiro do pé à cabeça, pois a sua próxima melhor versão é sempre a do dia seguinte.',
        'eu atravessei uma floresta morrendo de medo pra te dizer isso e atravessava de novo. de todo mundo que eu podia achar no escuro, ainda bem que foi vc. onde vc tá eu tô bem.',
      ],
      fim: ['...', 'pronto. acabaram os papéis.', 'agora o monstro da floresta não precisa mais ter medo de falar.'],
    },

    fim: {
      titulo: 'fim.',
      oficial: 'o monstro da floresta era só vc com uma lanterna. e ainda bem.',
      de_novo: 'de novo?',
    },
  };
})();
