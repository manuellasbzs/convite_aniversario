const formulario = document.querySelector('#form-identificacao');
const campoNome = document.querySelector('#nome-convidado');
const retorno = document.querySelector('#retorno-identificacao');

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nomeCompleto = campoNome.value.trim().replace(/\s+/g, ' ');

  if (nomeCompleto.split(' ').length < 2) {
    retorno.textContent = 'Digite seu nome e sobrenome.';
    campoNome.focus();
    return;
  }

  // A checagem de convidados será ligada à planilha Google nesta próxima etapa.
  retorno.textContent = 'Nome preenchido. A validação dos convidados ainda não está ativada.';
});

campoNome.addEventListener('input', () => {
  retorno.textContent = '';
});
