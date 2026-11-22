# Convite de aniversário

Convite digital criado com HTML, CSS, JavaScript, Photoshop e Google Planilhas.

## Telas e comportamento

1. **Identificação:** imagem original do PSD e campo transparente sobre o retângulo vermelho.
2. **Convite:** imagem do segundo PSD; vídeo do YouTube incorporado na área livre abaixo do cabeçalho; as palavras “sim” e “não” já são parte da imagem.
3. **Primeira enquete:** escolha `sim` ou `não` (ainda sem gravar).
4. **Segunda enquete:** a imagem troca para o PSD original com “certeza?” sem mexer no vídeo; **qualquer uma das duas opções** confirma a escolha registrada na primeira enquete.
5. **Planilha:** somente após a segunda resposta a linha do convidado é atualizada: `Confirmado` ou `Não comparecerá`, com data/hora.
6. **Primeira resposta `não`:** após a segunda pergunta abre o PSD original da tela de encerramento (“até a próxima…”), em `assets/tela-nao.png`.
7. **Primeira resposta `sim`:** confirma a presença e mantém o vídeo disponível na tela do convite.

## Pendência para ativar o login e o registro real de confirmações

O projeto do Apps Script está no arquivo `integracao/Code.gs`, mas **o script ainda precisa ser implantado/autorizado pela conta Google** e a URL `/exec` inserida em `config.js`. Consulte `integracao/README.md`.

A lista de 59 convidados **não está no repositório público**; está numa planilha Google privada. A comparação de nomes ignora acentos, caixa e espaços excedentes.

## Links

- Repositório: https://github.com/manuellasbzs/convite_aniversario
- Site: https://manuellasbzs.github.io/convite_aniversario/