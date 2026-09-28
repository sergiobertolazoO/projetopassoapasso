let loggedInUser = null; // Variável para armazenar o usuário logado

// Função para realizar login
function login(username, password) {
    if (!db) {
        console.error("Banco de dados não está disponível.");
        return;
    }

    const transaction = db.transaction("users", "readonly");
    const userStore = transaction.objectStore("users");

    const getRequest = userStore.get(username);

    getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (user) {
            const hashedPassword = btoa(password);
            if (user.password === hashedPassword) {
                alert("Login bem-sucedido!");
                loggedInUser = username; // Define o usuário logado
                localStorage.setItem("loggedInUser", username); // Salva o usuário logado no localStorage
            } else {
                alert("Senha incorreta!");
            }
        } else {
            alert("Usuário não encontrado!");
        }
    };

    getRequest.onerror = () => {
        console.error("Erro ao verificar o usuário.");
    };
}

// Função para carregar o estado do usuário logado
function loadLoggedInUser() {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
        loggedInUser = savedUser;
    }
}

// Função para realizar logout
function logout() {
    localStorage.removeItem("loggedInUser");
    loggedInUser = null;
    alert("Você foi desconectado!");
    window.location.href = "index.html"; // Redireciona para a página inicial
}

// Carregar o usuário logado ao carregar a página
loadLoggedInUser();