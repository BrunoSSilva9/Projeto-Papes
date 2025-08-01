const menuButton = document.getElementById("menuButton");
const dropdownMenu = document.getElementById("dropdownMenu");

menuButton.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdownMenu.classList.toggle("active");
});
window.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("active")) {
    dropdownMenu.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/inscricoes")
    .then((response) => response.json())
    .then((inscricoes) => {
      const contadores = {
        atendimento_protocolo: 0,
        atendimento_regular: 0,
      };

      inscricoes.forEach((inscricao) => {
        if (inscricao.status in contadores) {
          contadores[inscricao.status]++;
        }
      });

      document.getElementById("count-lista-espera").textContent =
        contadores.lista_de_espera;
      document.getElementById("count-espera-regulares").textContent =
        contadores.espera_regulares;
      document.getElementById("count-atendimento-protocolo").textContent =
        contadores.atendimento_protocolo;
      document.getElementById("count-atendimento-regular").textContent =
        contadores.atendimento_regular;
    })
    .catch((error) => console.error("Erro ao buscar dados do painel:", error));
});