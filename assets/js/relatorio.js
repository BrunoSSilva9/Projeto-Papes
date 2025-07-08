let todosOsPacientes = [];

function renderizarPacientes(pacientes) {
  const container = document.getElementById("relatorio-container");
  container.innerHTML = "";

  if (pacientes.length === 0) {
    container.innerHTML =
      "<p>Nenhum registro encontrado com os filtros aplicados.</p>";
    return;
  }

  pacientes.forEach((paciente) => {
    const dataEncerramento = new Date(
      paciente.dataEncerramento
    ).toLocaleDateString("pt-BR");

    const cardHTML = `
            <div class="paciente-card" data-id="${paciente.id}">
                <div class="card-header">
                    <span>Atendimento Encerrado</span>
                    <div class="card-actions">
                        <button class="menu-tres-pontos-btn">...</button>
                        <div class="card-dropdown-menu">
                            <a href="#">Encerrado em: ${dataEncerramento}</a>
                        </div>
                    </div>
                </div>
                <div class="card-body-resumo">
                    <span class="material-symbols-outlined">person</span>
                    <span>${paciente.nome}</span>
                </div>
                <div class="card-body-detalhes">
                    <p><strong>Email:</strong> <span>${
                      paciente.email
                    }</span></p>
                    <p><strong>Número:</strong> <span>${
                      paciente.telefone
                    }</span></p>
                    <p><strong>Curso:</strong> <span>${
                      paciente.curso
                    }</span></p>
                    <p><strong>Matrícula:</strong> <span>${
                      paciente.matricula
                    }</span></p>
                    <p><strong>Bolsista:</strong> <span>${
                      paciente.bolsista || "N/A"
                    }</span></p>
                </div>
                <div class="card-footer">
                    <button class="toggle-details-btn">Ver mais</button>
                </div>
            </div>
        `;
    container.innerHTML += cardHTML;
  });
}

function aplicarFiltros() {
  const termoBusca = document
    .getElementById("filtro-pesquisa")
    .value.toLowerCase();
  const anoSelecionado = document.getElementById("filtro-ano").value;
  const cursoSelecionado = document.getElementById("filtro-curso").value;
  const idadeMaxima = document.getElementById("filtro-idade").value;

  let pacientesFiltrados = todosOsPacientes;

  if (termoBusca) {
    pacientesFiltrados = pacientesFiltrados.filter((p) =>
      p.nome.toLowerCase().includes(termoBusca)
    );
  }
  if (anoSelecionado) {
    pacientesFiltrados = pacientesFiltrados.filter(
      (p) => new Date(p.dataEncerramento).getFullYear() == anoSelecionado
    );
  }
  if (cursoSelecionado) {
    pacientesFiltrados = pacientesFiltrados.filter(
      (p) => p.curso === cursoSelecionado
    );
  }
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return 0;
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };
  pacientesFiltrados = pacientesFiltrados.filter(
    (p) => calcularIdade(p.dataNascimento) <= idadeMaxima
  );

  renderizarPacientes(pacientesFiltrados);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/inscricoes?status=encerrado"
    );
    todosOsPacientes = await response.json();

    const anos = [
      ...new Set(
        todosOsPacientes
          .map((p) =>
            p.dataEncerramento
              ? new Date(p.dataEncerramento).getFullYear()
              : null
          )
          .filter((ano) => ano)
      ),
    ];
    const cursos = [...new Set(todosOsPacientes.map((p) => p.curso))];

    const filtroAno = document.getElementById("filtro-ano");
    anos
      .sort()
      .forEach(
        (ano) =>
          (filtroAno.innerHTML += `<option value="${ano}">${ano}</option>`)
      );

    const filtroCurso = document.getElementById("filtro-curso");
    cursos.forEach(
      (curso) =>
        (filtroCurso.innerHTML += `<option value="${curso}">${curso}</option>`)
    );

    document
      .getElementById("filtro-pesquisa")
      .addEventListener("input", aplicarFiltros);
    document
      .getElementById("filtro-ano")
      .addEventListener("change", aplicarFiltros);
    document
      .getElementById("filtro-curso")
      .addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-idade").addEventListener("input", (e) => {
      document.getElementById(
        "idade-valor"
      ).textContent = `15 - ${e.target.value}`;
      aplicarFiltros();
    });

    renderizarPacientes(todosOsPacientes);
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
  }
});

document
  .getElementById("relatorio-container")
  .addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("toggle-details-btn")) {
      const card = target.closest(".paciente-card");
      card.classList.toggle("expanded");
      target.textContent = card.classList.contains("expanded")
        ? "Ver menos"
        : "Ver mais";
    }

    if (target.classList.contains("menu-tres-pontos-btn")) {
      const menu = target.nextElementSibling;
      document
        .querySelectorAll(".card-dropdown-menu.active")
        .forEach((openMenu) => {
          if (openMenu !== menu) openMenu.classList.remove("active");
        });
      menu.classList.toggle("active");
    }
  });
