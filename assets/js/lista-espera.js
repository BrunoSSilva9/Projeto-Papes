// /assets/js/lista-espera.js

// Lógica do menu dropdown do header (pode ser movido para um arquivo global no futuro)
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

// Função principal para carregar os pacientes
async function carregarPacientes() {
  try {
    // Busca apenas os pacientes com status 'lista_de_espera'
    const response = await fetch(
      "http://localhost:3000/inscricoes?status=lista_de_espera"
    );
    if (!response.ok) {
      throw new Error("Não foi possível buscar os dados.");
    }
    const pacientes = await response.json();

    // Atualiza o contador do banner
    document.getElementById("total-pacientes").textContent = pacientes.length;

    const container = document.getElementById("pacientes-container");
    container.innerHTML = ""; // Limpa o container

    if (pacientes.length === 0) {
      container.innerHTML =
        "<p>Não há ninguém na lista de espera no momento.</p>";
      return;
    }

    // Cria e adiciona cada card na tela
    pacientes.forEach((paciente, index) => {
      const cardHTML = `
                <div class="paciente-card" data-id="${paciente.id}">
                    <div class="card-header">
                        <span>${index + 1}º lugar na lista de espera</span>
                        <span class="menu-tres-pontos">...</span>
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
    document.getElementById("pacientes-container").innerHTML =
      "<p>Erro ao carregar a lista. Tente novamente mais tarde.</p>";
  }
}

// Adiciona o Event Listener para a funcionalidade "Ver mais"
document
  .getElementById("pacientes-container")
  .addEventListener("click", function (event) {
    // Verifica se o elemento clicado é o botão "Ver mais/Ver menos"
    if (event.target.classList.contains("toggle-details-btn")) {
      const card = event.target.closest(".paciente-card");
      card.classList.toggle("expanded");

      // Altera o texto do botão
      if (card.classList.contains("expanded")) {
        event.target.textContent = "Ver menos";
      } else {
        event.target.textContent = "Ver mais";
      }
    }
  });

// Carrega os pacientes quando a página é aberta
document.addEventListener("DOMContentLoaded", carregarPacientes);
