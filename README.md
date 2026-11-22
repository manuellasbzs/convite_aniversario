# Convite de aniversário

Convite digital com a arte de `prototipo2.4.psd` exportada como imagem. Textos e decoração continuam **na imagem**; a única camada HTML visível é o campo de nome posicionado sobre o retângulo vermelho.

## Etapas
- [x] Tela inicial baseada no Photoshop, com campo para nome e sobrenome.
- [x] Arte exportada como PNG para a página inicial.
- [ ] Verificar convidados no Google Planilhas via Apps Script.
- [ ] Página oficial com vídeo do YouTube incorporado.
- [ ] Confirmação de presença e registro na planilha.

## Estrutura
- `index.html` — página inicial.
- `style.css` — responsividade e posicionamento do campo.
- `script.js` — validação local básica do nome preenchido.
- `assets/tela-inicial.png` — arte original exportada do Photoshop.
- `.github/workflows/pages.yml` — publicação no GitHub Pages a cada atualização da `main`.

A validação por lista de convidados e o RSVP ainda **não foram implementados** porque dependem da lista, da planilha e das outras telas.

## Publicação
Nas configurações do repositório, em **Settings > Pages > Build and deployment**, use **GitHub Actions**. Depois de uma execução bem-sucedida, o endereço será:
`https://manuellasbzs.github.io/convite_aniversario/`
