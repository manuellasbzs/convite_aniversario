/**
 * Google Apps Script da planilha privada de convidados.
 * A planilha do convite já está indicada no código. Não são necessárias propriedades do script.
 * Publicação: aplicativo Web, executar como "Eu", acesso "Qualquer pessoa".
 *
 * É uma barreira simples por nome, NÃO verificação forte de identidade.
 * Uma pessoa que conhece o nome de um convidado pode entrar como ele.
 */
const ABA_CONVIDADOS = 'Convidados';
const DURACAO_SESSAO = 21600; // Máximo do CacheService: 6 horas.

function normalizarNome(nome) {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');
}

function acessarAba_() {
  const planilhaId = '1DzFWw-ZUgqexU7zYt6Crz_LcRz6SX7Eyp_pClmEsOKU';
  const aba = SpreadsheetApp.openById(planilhaId).getSheetByName(ABA_CONVIDADOS);
  if (!aba) throw new Error('Não existe a aba Convidados.');
  return aba;
}

function localizarConvidado_(aba, nomeNormalizado) {
  if (!nomeNormalizado || nomeNormalizado.length > 120) return null;
  const ultima = aba.getLastRow();
  if (ultima < 2) return null;
  const nomes = aba.getRange(2, 1, ultima - 1, 1).getDisplayValues();
  for (let i = 0; i < nomes.length; i++) {
    if (normalizarNome(nomes[i][0]) === nomeNormalizado) {
      const linha = i + 2;
      return {
        linha,
        nome: nomes[i][0],
        confirmacao: aba.getRange(linha, 2).getDisplayValue() || 'Pendente'
      };
    }
  }
  return null;
}

function getSessao_(token) {
  if (!/^[a-fA-F0-9-]{36}$/.test(String(token || ''))) return null;
  return CacheService.getScriptCache().get('sessao:' + token);
}

function respostaJsonp_(callback, dados) {
  // Só chama nomes de callback gerados pelo nosso frontend.
  if (!/^conviteResposta_[0-9]+_[0-9]+$/.test(callback)) {
    return ContentService.createTextOutput('Callback inválido.');
  }
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(dados) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doGet(evento) {
  const p = evento && evento.parameter ? evento.parameter : {};
  const callback = String(p.callback || '');
  if (!/^conviteResposta_[0-9]+_[0-9]+$/.test(callback)) {
    return ContentService.createTextOutput('Callback inválido.');
  }
  let dados;
  try {
    const acao = String(p.acao || '');
    if (acao === 'entrar') {
      const nomeNormalizado = normalizarNome(p.nome);
      const convidado = localizarConvidado_(acessarAba_(), nomeNormalizado);
      if (!convidado) {
        dados = { ok: false, autorizado: false, codigo: 'NAO_ENCONTRADO' };
      } else {
        const token = Utilities.getUuid();
        CacheService.getScriptCache().put('sessao:' + token, nomeNormalizado, DURACAO_SESSAO);
        dados = {
          ok: true, autorizado: true, token,
          nome: convidado.nome, confirmacao: convidado.confirmacao
        };
      }
    } else if (acao === 'sessao') {
      const nomeNormalizado = getSessao_(p.token);
      const convidado = nomeNormalizado
        ? localizarConvidado_(acessarAba_(), nomeNormalizado) : null;
      dados = convidado
        ? { ok: true, autorizado: true, nome: convidado.nome, confirmacao: convidado.confirmacao }
        : { ok: false, autorizado: false, codigo: 'SESSAO_EXPIRADA' };
    } else if (acao === 'confirmar') {
      const nomeNormalizado = getSessao_(p.token);
      const escolha = String(p.resposta || '');
      if (!nomeNormalizado) {
        dados = { ok: false, codigo: 'SESSAO_EXPIRADA' };
      } else if (escolha !== 'sim' && escolha !== 'nao') {
        dados = { ok: false, codigo: 'RESPOSTA_INVALIDA' };
      } else {
        const bloqueio = LockService.getScriptLock();
        bloqueio.waitLock(15000);
        try {
          const aba = acessarAba_();
          const convidado = localizarConvidado_(aba, nomeNormalizado);
          if (!convidado) {
            dados = { ok: false, codigo: 'NAO_ENCONTRADO' };
          } else {
            const confirmacao = escolha === 'sim' ? 'Confirmado' : 'Não comparecerá';
            // Uma única linha por convidado: respostas posteriores substituem a anterior.
            aba.getRange(convidado.linha, 2, 1, 2)
              .setValues([[confirmacao, new Date()]]);
            SpreadsheetApp.flush();
            dados = { ok: true, confirmacao };
          }
        } finally {
          bloqueio.releaseLock();
        }
      }
    } else {
      dados = { ok: false, codigo: 'ACAO_INVALIDA' };
    }
  } catch (erro) {
    console.error(erro);
    dados = { ok: false, codigo: 'ERRO_TEMPORARIO' };
  }
  return respostaJsonp_(callback, dados);
}