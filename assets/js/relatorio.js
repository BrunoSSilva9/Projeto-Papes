document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("relatorio-container");
  const filtroPesquisaInput = document.getElementById("filtro-pesquisa");
  const filtroAnoSelect = document.getElementById("filtro-ano");
  const filtroCursoSelect = document.getElementById("filtro-curso");
  const filtroIdadeInput = document.getElementById("filtro-idade");
  const idadeValorSpan = document.getElementById("idade-valor");

  let pacientesEncerrados = [];

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;
    let dia, mes, ano;

    if (dataNascimento.includes("-")) {
      [ano, mes, dia] = dataNascimento.split("-").map(Number);
    } else if (dataNascimento.includes("/")) {
      [dia, mes, ano] = dataNascimento.split("/").map(Number);
    } else {
      return null;
    }
    const hoje = new Date();
    const nasc = new Date(ano, mes - 1, dia);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  }

  function renderizarPacientes(listaDePacientes) {
    container.innerHTML = "";
    if (listaDePacientes.length === 0) {
      container.innerHTML =
        "<p>Nenhum registro encontrado com os filtros aplicados.</p>";
      return;
    }
    listaDePacientes.forEach((paciente) => {
      const dataEncerramento = paciente.dataEncerramento
        ? new Date(paciente.dataEncerramento).toLocaleDateString("pt-BR")
        : "N/A";

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
                    <p><strong>Idade:</strong> <span>${
                      calcularIdade(paciente.dataNascimento) || "N/A"
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
    const textoBusca = filtroPesquisaInput.value.toLowerCase().trim();
    const cursoSelecionado = filtroCursoSelect.value;
    const anoSelecionado = filtroAnoSelect.value;
    const idadeSelecionada = parseInt(filtroIdadeInput.value, 10);

    const pacientesFiltrados = pacientesEncerrados.filter((paciente) => {
      const nomeMatch =
        textoBusca === "" || paciente.nome.toLowerCase().includes(textoBusca);
      const cursoMatch =
        cursoSelecionado === "" || paciente.curso === cursoSelecionado;
      const anoMatch =
        anoSelecionado === "" ||
        (paciente.dataEncerramento &&
          new Date(paciente.dataEncerramento).getFullYear() == anoSelecionado);
      const idade = calcularIdade(paciente.dataNascimento);
      const idadeMatch =
        idadeSelecionada >= 40 || (idade !== null && idade <= idadeSelecionada);

      return nomeMatch && cursoMatch && anoMatch && idadeMatch;
    });

    renderizarPacientes(pacientesFiltrados);
  }

  try {
    const response = await fetch(
      "http://localhost:3000/inscricoes?status=encerrado"
    );
    pacientesEncerrados = await response.json();

    const anoFim = new Date().getFullYear();
    for (let ano = 2019; ano <= anoFim; ano++) {
      filtroAnoSelect.innerHTML += `<option value="${ano}">${ano}</option>`;
    }
    const cursos = [...new Set(pacientesEncerrados.map((p) => p.curso))];
    cursos.forEach((curso) => {
      if (curso)
        filtroCursoSelect.innerHTML += `<option value="${curso}">${curso}</option>`;
    });

    renderizarPacientes(pacientesEncerrados);

    filtroPesquisaInput.addEventListener("input", aplicarFiltros);
    filtroCursoSelect.addEventListener("change", aplicarFiltros);
    filtroAnoSelect.addEventListener("change", aplicarFiltros);
    filtroIdadeInput.addEventListener("input", () => {
      idadeValorSpan.textContent = `15 - ${filtroIdadeInput.value}`;
      if (filtroIdadeInput.value >= 40) {
        idadeValorSpan.textContent = "Todos";
      }
      aplicarFiltros();
    });
  } catch (error) {
    console.error(
      "Erro ao carregar e configurar a página de relatórios:",
      error
    );
    container.innerHTML =
      "<p>Ocorreu um erro ao carregar os dados. Verifique a conexão com a API e o console (F12).</p>";
  }

  container.addEventListener("click", function (event) {
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
});
