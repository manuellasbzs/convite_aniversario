# Convite de aniversário

Convite digital criado com HTML, CSS, JavaScript, Photoshop e Google Planilhas.

## Telas e comportamento

1. **Identificação:** imagem original do PSD e campo transparente sobre o retângulo vermelho.
2. **Convite:** imagem do segundo PSD; vídeo do YouTube incorporado na área livre abaixo do cabeçalho; as palavras “sim” e “não” já são parte da imagem.
3. **Primeira enquete:** escolha `sim` ou `não` (ainda sem gravar).
4. **Segunda enquete:** a imagem troca para o PSD original com “certeza?” sem mexer no vídeo; **qualquer uma das duas opções** confirma a escolha registrada na primeira enquete.
5. **Planilha:** somente após a segunda resposta a linha do convidado é atualizada: `Confirmado` ou `Não comparecerá`, com data/hora.
6. **Primeira resposta `não`:** após a segunda pergunta abre o PSD original da tela de encerramento (“até a próxima…”), em `assets/tela-nao.png`.
7. **Primeira resposta `sim`:** após a pergunta visual "certeza?", registra a confirmação e abre o **convite completo do Photoshop**, em `assets/convite-final.webp`, com rolagem vertical natural para ler a arte inteira.

## Integração com Google Planilhas

O Google Apps Script já foi implantado e a URL está em `config.js`. A resposta da **primeira enquete** só é registrada depois de qualquer clique na **segunda enquete visual**; caso a gravação falhe, não abre a tela final. Consulte `integracao/README.md` para configuração e testes.

A lista de 59 convidados **não está no repositório público**; está numa planilha Google privada. A comparação de nomes ignora acentos, caixa e espaços excedentes.

## Links

- Repositório: https://github.com/manuellasbzs/convite_aniversario
- Site: https://manuellasbzs.github.io/convite_aniversario/