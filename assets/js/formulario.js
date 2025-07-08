const menuButton = document.getElementById("menuButton");
const dropdownMenu = document.getElementById("dropdownMenu");
if (menuButton && dropdownMenu) {
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("active");
  });
  window.addEventListener("click", () => {
    if (dropdownMenu.classList.contains("active")) {
      dropdownMenu.classList.remove("active");
    }
  });
}

const formulario = document.getElementById("inscricaoForm");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = formulario.nome.value.trim();
  if (nome === "") {
    alert("Por favor, preencha o campo Nome.");
    return;
  }

  const email = formulario.email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um endereço de e-mail válido.");
    return;
  }

  const dataNascimento = new Date(formulario["data-nascimento"].value);
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);
  if (!formulario["data-nascimento"].value || dataNascimento > hoje) {
    alert(
      "Por favor, insira uma data de nascimento válida e que não seja no futuro."
    );
    return;
  }

  const telefone = formulario.telefone.value;
  const matricula = formulario.matricula.value;
  const apenasNumerosRegex = /^[0-9]+$/;

  if (!apenasNumerosRegex.test(telefone)) {
    alert("O campo Telefone deve conter apenas números.");
    return;
  }

  if (!apenasNumerosRegex.test(matricula)) {
    alert("O campo Matrícula deve conter apenas números.");
    return;
  }

  console.log("Validação bem-sucedida. Enviando dados...");

  const dadosInscricao = {
    nome: nome,
    email: email,
    telefone: telefone,
    curso: formulario.curso.value,
    dataNascimento: formulario["data-nascimento"].value,
    matricula: matricula,
    motivo: formulario.motivo.value,
    dataEnvio: new Date().toISOString(),
    status: "lista_de_espera",
  };

  fetch("http://localhost:3000/inscricoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosInscricao),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha na resposta do servidor.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Sucesso:", data);
      alert("Inscrição realizada com sucesso!");
      formulario.reset();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao enviar sua inscrição. Tente novamente.");
    });
});
