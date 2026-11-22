const telaInicial = document.querySelector('#tela-inicial');
const telaConvite = document.querySelector('#tela-convite');
const telaNao = document.querySelector('#tela-nao');
const formulario = document.querySelector('#form-identificacao');
const campoNome = document.querySelector('#nome-convidado');
const retornoIdentificacao = document.querySelector('#retorno-identificacao');
const retornoPresenca = document.querySelector('#retorno-presenca');
const botoesPresenca = Array.from(document.querySelectorAll('.opcao-presenca'));
const iframeVideo = document.querySelector('#video-convite');
const arteCerteza = document.querySelector('#arte-certeza');

const URL_VALIDACAO = window.CONVITE_CONFIG?.appsScriptUrl?.trim() || '';
const CHAVE_SESSAO = 'convite_aniversario_sessao';
const URL_VIDEO = 'https://www.youtube.com/embed/UtyNtXRu9zQ?rel=0';
let sessaoAtiva = null;
let escolhaInicial = null;
let etapa = 'presenca';
let salvando = false;
let numeroSolicitacao = 0;

function normalizarNome(nome) {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');
}

function consultarPlanilha(parametros) {
  return new Promise((resolve, reject) => {
    if (!URL_VALIDACAO) return reject(new Error('INTEGRACAO_PENDENTE'));
    let endereco;
    try {
      endereco = new URL(URL_VALIDACAO);
      if (endereco.protocol !== 'https:') throw new Error('URL_INVALIDA');
    } catch {
      return reject(new Error('URL_INVALIDA'));
    }

    const callback = `conviteResposta_${Date.now()}_${++numeroSolicitacao}`;
    const script = document.createElement('script');
    let concluido = false;
    const temporizador = window.setTimeout(() => finalizar(new Error('SEM_RESPOSTA')), 15000);

    function finalizar(resultado) {
      if (concluido) return;
      concluido = true;
      window.clearTimeout(temporizador);
      delete window[callback];
      script.remove();
      if (resultado instanceof Error) reject(resultado);
      else resolve(resultado);
    }

    window[callback] = finalizar;
    script.onerror = () => finalizar(new Error('ERRO_REDE'));
    Object.entries(parametros).forEach(([chave, valor]) => endereco.searchParams.set(chave, valor));
    endereco.searchParams.set('callback', callback);
    script.src = endereco.toString();
    document.body.appendChild(script);
  });
}

function alternarTela(destino) {
  telaInicial.hidden = destino !== 'inicial';
  telaConvite.hidden = destino !== 'convite';
  telaNao.hidden = destino !== 'nao';
  window.scrollTo(0, 0);
}

function mostrarPerguntaInicial() {
  etapa = 'presenca';
  escolhaInicial = null;
  arteCerteza.hidden = true;
  document.querySelector('#opcoes-presenca').setAttribute('aria-label', 'Marcar presença');
  botoesPresenca.forEach(botao => {
    botao.disabled = false;
    botao.setAttribute('aria-label', botao.dataset.resposta === 'sim'
      ? 'Sim, irei' : 'Não poderei comparecer');
    botao.removeAttribute('aria-pressed');
  });
}

function mostrarSegundaPergunta(resposta) {
  if (!sessaoAtiva || !['sim', 'nao'].includes(resposta)) return;
  escolhaInicial = resposta;
  etapa = 'certeza';
  retornoPresenca.textContent = '';
  arteCerteza.hidden = false;
  document.querySelector('#opcoes-presenca').setAttribute('aria-label', 'Tem certeza?');
  botoesPresenca.forEach(botao => botao.setAttribute('aria-label', botao.dataset.resposta === 'sim'
    ? 'Sim, tenho certeza' : 'Não, não tenho certeza'));
}

function exibirConvite(sessao) {
  sessaoAtiva = sessao;
  mostrarPerguntaInicial();
  alternarTela('convite');
  retornoPresenca.textContent = sessao.confirmacao === 'Confirmado'
    ? 'Sua presença já está confirmada.' : '';
  // Um único iframe: mudar a enquete não interrompe a reprodução.
  if (!iframeVideo.getAttribute('src')) iframeVideo.src = URL_VIDEO;
}

function exibirTelaNao() {
  alternarTela('nao');
}

function encerrarSessao(mensagem) {
  sessaoAtiva = null;
  sessionStorage.removeItem(CHAVE_SESSAO);
  alternarTela('inicial');
  iframeVideo.removeAttribute('src');
  campoNome.disabled = false;
  retornoIdentificacao.textContent = mensagem || '';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const digitado = campoNome.value.trim().replace(/\s+/g, ' ');
  if (!normalizarNome(digitado)) {
    retornoIdentificacao.textContent = 'Digite seu nome.';
    campoNome.focus();
    return;
  }
  if (!URL_VALIDACAO) {
    retornoIdentificacao.textContent = 'A lista de convidados está sendo conectada. Tente novamente em breve.';
    return;
  }

  campoNome.disabled = true;
  retornoIdentificacao.textContent = 'Verificando nome...';
  try {
    const resposta = await consultarPlanilha({ acao: 'entrar', nome: digitado });
    if (resposta.ok && resposta.autorizado && resposta.token && resposta.nome) {
      const sessao = { nome: resposta.nome, token: resposta.token, confirmacao: resposta.confirmacao };
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
      exibirConvite(sessao);
    } else if (resposta.codigo === 'NAO_ENCONTRADO') {
      retornoIdentificacao.textContent = 'Nome não encontrado na lista de convidados.';
    } else {
      retornoIdentificacao.textContent = 'Não foi possível verificar seu nome agora. Tente novamente.';
    }
  } catch {
    retornoIdentificacao.textContent = 'Não foi possível verificar seu nome agora. Tente novamente.';
  } finally {
    campoNome.disabled = false;
  }
});

campoNome.addEventListener('input', () => { retornoIdentificacao.textContent = ''; });

botoesPresenca.forEach(botao => botao.addEventListener('click', async () => {
  if (!sessaoAtiva || salvando) return;
  if (etapa === 'presenca') {
    // A primeira resposta vale para a planilha; ainda não salva.
    mostrarSegundaPergunta(botao.dataset.resposta);
    return;
  }
  if (etapa !== 'certeza' || !escolhaInicial) return;

  // A segunda enquete é apenas visual. "Sim" OU "Não" nela fazem a
  // mesma coisa: registram a escolha da PRIMEIRA enquete.
  salvando = true;
  botoesPresenca.forEach(b => { b.disabled = true; });
  retornoPresenca.textContent = 'Salvando resposta...';
  try {
    const resposta = await consultarPlanilha({
      acao: 'confirmar', token: sessaoAtiva.token, resposta: escolhaInicial
    });
    if (resposta.ok && ['Confirmado', 'Não comparecerá'].includes(resposta.confirmacao)) {
      sessaoAtiva.confirmacao = resposta.confirmacao;
      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessaoAtiva));
      if (escolhaInicial === 'nao') {
        // Direciona à tela final específica da resposta "Não".
        exibirTelaNao();
      } else {
        mostrarPerguntaInicial();
        retornoPresenca.textContent = 'Sua presença foi confirmada!';
      }
    } else if (resposta.codigo === 'SESSAO_EXPIRADA') {
      encerrarSessao('Sua sessão expirou. Digite seu nome novamente.');
    } else {
      retornoPresenca.textContent = 'Não foi possível salvar. Tente novamente.';
    }
  } catch {
    retornoPresenca.textContent = 'Não foi possível salvar. Tente novamente.';
  } finally {
    salvando = false;
    if (!telaConvite.hidden) botoesPresenca.forEach(b => { b.disabled = false; });
  }
}));

(async function restaurarSessao() {
  if (!URL_VALIDACAO) return;
  let salva;
  try { salva = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO)); } catch { return; }
  if (!salva || typeof salva.token !== 'string') return;
  try {
    const resposta = await consultarPlanilha({ acao: 'sessao', token: salva.token });
    if (resposta.ok && resposta.autorizado) {
      const sessao = { token: salva.token, nome: resposta.nome, confirmacao: resposta.confirmacao };
      exibirConvite(sessao);
    } else {
      sessionStorage.removeItem(CHAVE_SESSAO);
    }
  } catch {
    // Uma falha na verificação nunca libera a segunda tela.
  }
})();