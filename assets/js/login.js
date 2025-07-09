document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Verificação simples de domínio do e-mail
    if (email.endsWith('@bolsista.com')) {
        window.location.href = 'bolsista.html';
    } else if (email.endsWith('@admin.com')) {
        window.location.href = 'admin.html';
    } else {
        alert('Acesso negado. Domínio de e-mail não autorizado.');
    }
});
