# Integração com Google Planilhas

A lista de **59 convidados** está numa planilha privada do Google Sheets (fora do GitHub).

1. Abra a planilha privada e escolha **Extensões > Apps Script**.
2. Cole o conteúdo de `Code.gs` no editor.
3. Em **Configurações do projeto > Propriedades do script**, crie `SPREADSHEET_ID` com o ID da planilha privada.
4. Implante como **Aplicativo da Web**, executar como **Eu**, acesso **Qualquer pessoa**. Autorize a execução na sua conta.
5. Copie a URL terminada em `/exec` e cole na constante `URL_VALIDACAO` de `script.js`.
6. Faça commit e teste um convidado cadastrado e outro não cadastrado.

Não coloque nomes no código público do GitHub. Esta validação apenas por nome é adequada como barreira simbólica, não como autenticação forte. O convite oficial e RSVP serão adicionados após receber o PSD da segunda tela.

A forma de comparar nomes remove acentos, espaços extras e diferenças de maiúsculas/minúsculas. Ex.: `ESTEVAO` = `Estevão`, `guilherme antônio` = `Guilherme Antônio`. Nomes distintos continuam distintos: `Guilherme Fazoll` e `Guilherme Fazollo`.
