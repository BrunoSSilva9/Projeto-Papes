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

const botaoFormulario = document.getElementById("botaoIrFormulario");
botaoFormulario.addEventListener("click", function () {
  window.location.href = "formulario.html";
});
