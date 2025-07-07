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

// Código para envio do formulário com async/await
const formulario = document.getElementById("inscricaoForm");

formulario.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosFormulario = {
    nome: formulario.nome.value,
    email: formulario.email.value,
    telefone: formulario.telefone.value,
    curso: formulario.curso.value,
    dataNascimento: formulario["data-nascimento"].value,
    matricula: formulario.matricula.value,
    motivo: formulario.motivo.value,
  };

  try {
    const response = await fetch("http://localhost:3000/inscricoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosFormulario),
    });

    if (response.ok) {
      alert("Formulário enviado com sucesso!");
      formulario.reset();
    } else {
      alert("Erro ao enviar o formulário.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro na comunicação com o servidor.");
  }
});
