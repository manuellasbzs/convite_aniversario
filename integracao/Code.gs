/**
 * Código do Apps Script associado à planilha PRIVADA de convidados.
 * Em Propriedades do script, cadastrar SPREADSHEET_ID com o ID da planilha.
 * Implementar como "Aplicativo da Web", execução: "Eu",
 * acesso: "Qualquer pessoa" (a planilha continua privada).
 *
 * ATENÇÃO: conferir nome é um controle de acesso simples, NÃO autenticação
 * forte. Pessoas que sabem o nome de um convidado podem se passar por ele.
 */

function normalizarNome(nome) {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('pt-BR');
}

function doGet(evento) {
  const parametros = evento && evento.parameter ? evento.parameter : {};
  const callback = String(parametros.callback || '');
  if (!/^conviteResposta_[a-zA-Z0-9_]+$/.test(callback)) {
    return ContentService.createTextOutput('Callback inválido');
  }

  let resultado = { autorizado: false };
  try {
    const nome = normalizarNome(parametros.nome);
    if (nome && nome.length <= 120) {
      const idPlanilha = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
      if (!idPlanilha) throw new Error('SPREADSHEET_ID não configurado');
      const aba = SpreadsheetApp.openById(idPlanilha).getSheetByName('Convidados');
      if (!aba) throw new Error('Aba Convidados não encontrada');
      const ultimaLinha = aba.getLastRow();
      const nomes = ultimaLinha > 1
        ? aba.getRange(2, 1, ultimaLinha - 1, 1).getDisplayValues()
        : [];

      const encontrado = nomes.find(linha => normalizarNome(linha[0]) === nome);
      if (encontrado) {
        resultado = { autorizado: true, nome: encontrado[0] };
      }
    }
  } catch (erro) {
    resultado = { autorizado: false, erro: 'Não foi possível verificar agora' };
  }

  // Retorna apenas a confirmação do nome solicitado; não publica toda a lista.
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(resultado) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
