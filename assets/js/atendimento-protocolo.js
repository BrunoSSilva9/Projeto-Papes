// /assets/js/atendimentos-protocolo.js

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // A MUDANÇA PRINCIPAL ESTÁ AQUI: busca pelo novo status
        const response = await fetch('http://localhost:3000/inscricoes?status=atendimento_protocolo');
        const pacientes = await response.json();

        document.getElementById('total-pacientes').textContent = pacientes.length;
        
        const container = document.getElementById('pacientes-container');
        container.innerHTML = '';

        if (pacientes.length === 0) {
            container.innerHTML = '<p>Ninguém em atendimento de protocolo no momento.</p>';
            return;
        }

        pacientes.forEach((paciente) => {
            const cardHTML = `
                <div class="paciente-card" data-id="${pacientes.id}">
                    <div class="card-header">
                        <span>${index + 1}º lugar na lista de atendimento de protocolo</span>
                        <div class="card-actions">
                            <button class="menu-tres-pontos-btn">...</button>
                            <div class="card-dropdown-menu">
                                <a href="#" class="acao-encaminhar" data-id="${pacientes.id}">Encaminhar para lista de espera regular</a>
                                <a href="#" class="acao-encerrar" data-id="${pacientes.id}">Encerrar Inscrição</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body-resumo">
                        <span class="material-symbols-outlined">person</span>
                        <span>${pacientes.nome}</span>
                    </div>
                    <div class="card-body-detalhes">
                        <p><strong>Email:</strong> <span>${pacientes.email}</span></p>
                        <p><strong>Número:</strong> <span>${pacientes.telefone}</span></p>
                    </div>
                    <div class="card-footer">
                        <button class="toggle-details-btn">Ver mais</button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Erro ao carregar pacientes de protocolo:", error);
    }
});