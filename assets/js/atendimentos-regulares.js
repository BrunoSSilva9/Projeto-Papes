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

async function encerrarInscricao(pacienteId) {
  if (
    !confirm(
      "Tem certeza que deseja encerrar esta inscrição? O registro será movido para os relatórios."
    )
  ) {
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/inscricoes/${pacienteId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "encerrado",
          dataEncerramento: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) throw new Error("Falha ao encerrar inscrição.");

    alert(`Inscrição encerrada e movida para o relatório.`);
    document.querySelector(`.paciente-card[data-id="${pacienteId}"]`).remove();
    atualizarContador();
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível encerrar a inscrição.");
  }
}

function atualizarContador() {
  const totalCards = document.querySelectorAll(".paciente-card").length;
  document.getElementById("total-pacientes").textContent = totalCards;
}

async function carregarAtendimentosRegulares() {
  try {
    const response = await fetch(
      "http://localhost:3000/inscricoes?status=atendimento_regular"
    );
    if (!response.ok) throw new Error("Não foi possível buscar os dados.");
    const pacientes = await response.json();

    const container = document.getElementById("pacientes-container");
    container.innerHTML = "";
    document.getElementById("total-pacientes").textContent = pacientes.length;

    if (pacientes.length === 0) {
      container.innerHTML = "<p>Ninguém em atendimento regular no momento.</p>";
      return;
    }

    pacientes.forEach((paciente) => {
      const cardHTML = `
                <div class="paciente-card" data-id="${paciente.id}">
                    <div class="card-header">
                        <span>Em Atendimento Regular</span>
                        <div class="card-actions">
                            <button class="menu-tres-pontos-btn">...</button>
                            <div class="card-dropdown-menu">
                                <a href="#" class="acao-encerrar" data-id="${
                                  paciente.id
                                }">Encerrar Inscrição</a>
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
                        <p><strong>Motivo:</strong> <span>${
                          paciente.motivo
                        }</span></p>
                        <p><strong>Bolsista:</strong> <span>${
                          paciente.bolsista || "Não definido"
                        }</span></p>
                    </div>
                    <div class="card-footer">
                        <button class="toggle-details-btn">Ver mais</button>
                    </div>
                </div>
            `;
      container.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Erro ao carregar pacientes:", error);
  }
}

document
  .getElementById("pacientes-container")
  .addEventListener("click", function (event) {
    const target = event.target;
    event.preventDefault();

    if (target.classList.contains("toggle-details-btn")) {
      const card = target.closest(".paciente-card");
      card.classList.toggle("expanded");
      target.textContent = card.classList.contains("expanded")
        ? "Ver menos"
        : "Ver mais";
    }

    if (target.classList.contains("menu-tres-pontos-btn")) {
      target.nextElementSibling.classList.toggle("active");
    }

    if (target.classList.contains("acao-encerrar")) {
      encerrarInscricao(target.dataset.id);
    }
  });

document.addEventListener("DOMContentLoaded", carregarAtendimentosRegulares);
