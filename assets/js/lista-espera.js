// /assets/js/lista-espera.js

// Lógica do menu dropdown do header
const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');
if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    window.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
        }
    });
}

// --- FUNÇÕES DE AÇÃO (API) ---

// Função para ENCAMINHAR um paciente (mudar o status)
async function encaminharParaProtocolo(pacienteId) {
    try {
        const response = await fetch(`http://localhost:3000/inscricoes/${pacienteId}`, {
            method: 'PATCH', // PATCH é usado para atualizar parcialmente um recurso
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'atendimento_protocolo' // O novo status
            }),
        });

        if (!response.ok) throw new Error('Falha ao encaminhar paciente.');
        
        console.log(`Paciente ${pacienteId} encaminhado para protocolo.`);
        // Remove o card da tela e atualiza a contagem
        document.querySelector(`.paciente-card[data-id="${pacienteId}"]`).remove();
        atualizarContador();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível encaminhar o paciente.");
    }
}

// Função para ENCERRAR uma inscrição (deletar o registro)
async function encerrarInscricao(pacienteId) {
    // Confirmação antes de deletar
    if (!confirm('Tem certeza que deseja encerrar esta inscrição? Esta ação não pode ser desfeita.')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/inscricoes/${pacienteId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Falha ao encerrar inscrição.');

        console.log(`Inscrição ${pacienteId} encerrada.`);
        // Remove o card da tela e atualiza a contagem
        document.querySelector(`.paciente-card[data-id="${pacienteId}"]`).remove();
        atualizarContador();

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível encerrar a inscrição.");
    }
}

// Função para atualizar o contador no banner
function atualizarContador() {
    const totalCards = document.querySelectorAll('.paciente-card').length;
    document.getElementById('total-pacientes').textContent = totalCards;
}


// --- FUNÇÃO PRINCIPAL PARA CARREGAR E RENDERIZAR OS PACIENTES ---
async function carregarPacientes() {
    try {
        const response = await fetch('http://localhost:3000/inscricoes?status=lista_de_espera');
        if (!response.ok) throw new Error('Não foi possível buscar os dados.');
        const pacientes = await response.json();

        const container = document.getElementById('pacientes-container');
        container.innerHTML = ''; 

        if (pacientes.length === 0) {
            container.innerHTML = '<p>Não há ninguém na lista de espera no momento.</p>';
            atualizarContador();
            return;
        }

        pacientes.forEach((paciente, index) => {
            const cardHTML = `
                <div class="paciente-card" data-id="${paciente.id}">
                    <div class="card-header">
                        <span>${index + 1}º lugar na lista de espera</span>
                        <div class="card-actions">
                            <button class="menu-tres-pontos-btn">...</button>
                            <div class="card-dropdown-menu">
                                <a href="#" class="acao-encaminhar" data-id="${paciente.id}">Encaminhar para Protocolo</a>
                                <a href="#" class="acao-encerrar" data-id="${paciente.id}">Encerrar Inscrição</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body-resumo">
                        <span class="material-symbols-outlined">person</span>
                        <span>${paciente.nome}</span>
                    </div>
                    <div class="card-body-detalhes">
                        <p><strong>Email:</strong> <span>${paciente.email}</span></p>
                        <p><strong>Número:</strong> <span>${paciente.telefone}</span></p>
                    </div>
                    <div class="card-footer">
                        <button class="toggle-details-btn">Ver mais</button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
        
        atualizarContador();

    } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
    }
}

// --- GERENCIADOR DE EVENTOS (EVENT LISTENER) ---
document.getElementById('pacientes-container').addEventListener('click', function(event) {
    const target = event.target;

    // Ação: Mostrar/Esconder detalhes do card
    if (target.classList.contains('toggle-details-btn')) {
        const card = target.closest('.paciente-card');
        card.classList.toggle('expanded');
        target.textContent = card.classList.contains('expanded') ? 'Ver menos' : 'Ver mais';
    }

    // Ação: Mostrar/Esconder o menu de ações do card
    if (target.classList.contains('menu-tres-pontos-btn')) {
        const menu = target.nextElementSibling;
        menu.classList.toggle('active');
    }
    
    // Ação: Encaminhar para protocolo
    if (target.classList.contains('acao-encaminhar')) {
        event.preventDefault();
        const pacienteId = target.dataset.id;
        encaminharParaProtocolo(pacienteId);
    }

    // Ação: Encerrar inscrição
    if (target.classList.contains('acao-encerrar')) {
        event.preventDefault();
        const pacienteId = target.dataset.id;
        encerrarInscricao(pacienteId);
    }
});

// Carrega tudo quando a página é aberta
document.addEventListener('DOMContentLoaded', carregarPacientes);