# Ativação do Google Planilhas

O convite **ainda não pode liberar os nomes** enquanto o Google Apps Script não for publicado na sua conta.

A planilha de 59 convidados já existe e é privada:
https://docs.google.com/spreadsheets/d/1DzFWw-ZUgqexU7zYt6Crz_LcRz6SX7Eyp_pClmEsOKU/edit

## Configuração (sem propriedades manuais)

1. Abra a planilha acima com a conta proprietária.
2. Clique em **Extensões > Apps Script**.
3. No editor de código, substitua o conteúdo de `Código.gs` pelo conteúdo integral de [`Code.gs`](./Code.gs). Salve.
4. Clique em **Implantar > Nova implantação**, escolha o tipo **Aplicativo da Web**; selecione **Executar como: Eu** e **Quem tem acesso: Qualquer pessoa**; clique em **Implantar** e autorize o acesso à planilha.
5. Copie a URL do aplicativo Web, terminada em `/exec`, e envie-a na conversa. Então será possível colocá-la no `config.js` do GitHub sem editar o site manualmente.

O ID da planilha já está configurado no código `Code.gs`; **não é preciso configurar propriedades do script**.

## Testes após a conexão

- `ESTEVAO` e `Estevão` devem identificar a mesma pessoa.
- `Luís` e `luis` devem identificar a mesma pessoa.
- Um nome não cadastrado não deve entrar.
- A resposta da primeira enquete, após a segunda pergunta visual, deve atualizar a coluna **Confirmação** e o horário em **Respondido em**.

**Importante:** o frontend de GitHub Pages é público. A lista de convidados continua privada na planilha; o endpoint só responde sobre o nome consultado. Identificação exclusivamente por nome **não é autenticação forte**: outra pessoa pode informar o nome de um convidado. O token de sessão não impede isso.

Caso o Apps Script seja alterado depois, faça uma nova versão em **Implantar > Gerenciar implantações > Editar > Nova versão**, para atualizar o backend publicado.
