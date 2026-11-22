const formulario = document.querySelector('#form-identificacao');
const campoNome = document.querySelector('#nome-convidado');
const retorno = document.querySelector('#retorno-identificacao');

// Preencher depois que o Google Apps Script for implantado como aplicativo Web.
const URL_VALIDACAO = '';

function normalizarNome(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');
}

function consultarConvidado(nome) {
  return new Promise((resolve, reject) => {
    const callback = 'conviteResposta_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => finalizar(new Error('Tempo de resposta excedido')), 12000);

    function finalizar(resultado, erro = false) {
      window.clearTimeout(timeout);
      delete window[callback];
      script.remove();
      if (erro || resultado instanceof Error) reject(resultado);
      else resolve(resultado);
    }

    window[callback] = (dados) => finalizar(dados);
    script.onerror = () => finalizar(new Error('Não foi possível validar o nome'));
    const url = new URL(URL_VALIDACAO);
    url.searchParams.set('nome', nome);
    url.searchParams.set('callback', callback);
    script.src = url.toString();
    document.body.appendChild(script);
  });
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const nomeDigitado = campoNome.value.trim().replace(/\s+/g, ' ');
  if (!normalizarNome(nomeDigitado)) {
    retorno.textContent = 'Digite seu nome.';
    return;
  }

  if (!URL_VALIDACAO) {
    retorno.textContent = 'A confirmação dos convidados está sendo configurada.';
    return;
  }

  retorno.textContent = 'Verificando nome...';
  campoNome.disabled = true;

  try {
    const resposta = await consultarConvidado(nomeDigitado);
    if (resposta.autorizado) {
      sessionStorage.setItem('convidadoAutorizado', resposta.nome);
      retorno.textContent = 'Nome autorizado. A próxima tela será adicionada em breve.';
    } else {
      retorno.textContent = 'Nome não encontrado na lista de convidados.';
    }
  } catch {
    retorno.textContent = 'Não foi possível verificar seu nome. Tente novamente.';
  } finally {
    campoNome.disabled = false;
  }
});

campoNome.addEventListener('input', () => {
  retorno.textContent = '';
});
