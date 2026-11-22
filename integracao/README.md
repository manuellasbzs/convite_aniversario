# Configuração do Google Planilhas (etapa obrigatória)

A lista dos 59 convidados está nesta planilha privada:
https://docs.google.com/spreadsheets/d/1DzFWw-ZUgqexU7zYt6Crz_LcRz6SX7Eyp_pClmEsOKU/edit

O site **ainda não valida nomes nem salva presença em produção** até a implantação do Apps Script. O código já está pronto para isso.

1. Abra a planilha usando sua conta Google e clique em **Extensões > Apps Script**.
2. Substitua o código padrão do editor pelo conteúdo do arquivo `integracao/Code.gs` e salve.
3. Vá a **Configurações do projeto > Propriedades do script > Adicionar propriedade**. Nome: `SPREADSHEET_ID`; valor: `1DzFWw-ZUgqexU7zYt6Crz_LcRz6SX7Eyp_pClmEsOKU`.
4. Em **Implantar > Nova implantação**, selecione **Aplicativo da Web**, execute como **Eu** e acesso **Qualquer pessoa**. Autorize na sua conta.
5. Copie o endereço terminado em `/exec` da implantação e preencha a propriedade `appsScriptUrl` em `config.js` no GitHub. A URL de implantação não é segredo; não publique a planilha nem a lista de nomes.
6. Aguarde o commit ser publicado no GitHub Pages e confira o acesso com `ESTEVAO`, `Luís` e um nome que não esteja na lista. Clique em `sim` e depois `não`: a coluna **Confirmação** da mesma linha deve atualizar e **Respondido em** deve registrar o horário, sem criar outra linha.

**Mudanças no arquivo `integracao/Code.gs` exigem nova versão implantada** no Apps Script (Implantar > Gerenciar implantações > Editar > Nova versão). Atualizar só o GitHub não altera o código que já está publicado no Google.

**Acesso por nome não é autenticação segura.** Quem souber um nome autorizado poderá entrar e responder por esse convidado. GitHub Pages publica os arquivos estáticos e a imagem do convite; a planilha permanece privada. O token de sessão temporário (até 6 horas) limita atualizações acidentais ou sem login, mas não resolve a possibilidade de alguém informar o nome de outra pessoa.

**Não usar um endpoint para publicar a lista inteira.** O Apps Script fornece apenas a resposta ao nome informado. Não colocar dados pessoais em arquivos de domínio público.