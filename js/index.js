// Variável global para armazenar a conexão com o banco de dados
let db;
let loggedInUser = null; // Variável para armazenar o usuário logado

// Função para abrir ou criar o banco de dados
async function openDatabase() {

    //here!

    const databases = await indexedDB.databases(); // Lista os bancos existentes
    const dbInfo = databases.find((db) => db.name === "UserDatabase");
    const version = dbInfo ? dbInfo.version + 1 : 1; // Incrementa a versão se o banco já existir

    const request = indexedDB.open("UserDatabase", version);

    request.onupgradeneeded = (event) => {
        db = event.target.result;

        // Criar a store de usuários, se não existir
        if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "username" });
        }

        // Criar a store de projetos, se não existir
        if (!db.objectStoreNames.contains("projects")) {
            db.createObjectStore("projects", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Banco de dados aberto com sucesso!");
    };

    request.onerror = (event) => {
        console.error("Erro ao abrir o banco de dados:", event.target.error);
    };
}

// Chamar a função para abrir o banco de dados
openDatabase();

// Função para registrar um novo usuário
function registerUser(username, password) {
    if (!db) {
        console.error("Banco de dados não está disponível.");
        return;
    }

    const transaction = db.transaction("users", "readwrite");
    const userStore = transaction.objectStore("users");

    // Verificar se o usuário já existe
    const getRequest = userStore.get(username);

    getRequest.onsuccess = () => {
        if (getRequest.result) {
            alert("Erro: O nome de usuário já está em uso. Escolha outro.");
        } else {
            // Usuário não existe, prosseguir com o cadastro
            const hashedPassword = btoa(password); // Hash simples para a senha
            userStore.add({ username, password: hashedPassword });

            transaction.oncomplete = () => {
                alert("Usuário cadastrado com sucesso!");
            };

            transaction.onerror = () => {
                alert("Erro ao cadastrar usuário. Tente novamente.");
            };
        }
    };

    getRequest.onerror = () => {
        console.error("Erro ao verificar se o usuário já existe.");
    };
}

// Função para realizar login
function login(username, password) {

    alert('call login');

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
                updateUIAfterLogin();
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

// Função para atualizar a interface após o login
function updateUIAfterLogin() {

    //alert('updateUIAfterLogin');

    // Remover o botão de login
    const loginButton = document.getElementById("loginModalButton");
    loginButton.classList.add("hidden");
 

    // Remover o botão de cadastro
    const cadastreseButton = document.getElementById("cadastreseModalButton");
    cadastreseButton.classList.add("hidden");

    // Adicionar o item "Projetos" ao menu
    const navbarNav = document.querySelector(".navbar-nav");
    const projetosMenuItem = document.createElement("li");
    projetosMenuItem.className = "nav-item";
    projetosMenuItem.innerHTML = `<a id="projetoNav" class="nav-link" href="#projeto">Projetos</a>`;
    navbarNav.appendChild(projetosMenuItem);

    // Exibir a seção "Projetos"
    const projetosSection = document.getElementById("projeto");
    projetosSection.classList.remove("hidden");

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.classList.remove("hidden");
}

// Função para atualizar a interface após o login
function updateUIAfterLogout() {

    try{

    
    // add o botão de login
    const loginButton = document.getElementById("loginModalButton");
    loginButton.classList.remove("hidden");
 

    // add o botão de cadastro
    const cadastreseButton = document.getElementById("cadastreseModalButton");
    cadastreseButton.classList.remove("hidden");
 
    // remove o item "Projetos" ao menu
    const projetoButton = document.getElementById("projeto");
    projetoButton.classList.add("hidden");
  

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.classList.add("hidden");

    }catch(e){
        console.log('Logout com sucesso');
    }

}



// Função para carregar o estado do usuário logado ao carregar a página
document.addEventListener("DOMContentLoaded", () => {

    //alert('DOMContentLoaded');

    const savedUser = localStorage.getItem("loggedInUser");

 
    

    if (savedUser) {
        loggedInUser = savedUser; // Restaura o usuário logado
        updateUIAfterLogin();
    }
});

// Evento de envio do formulário de registro
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }

    // Chama a função para registrar o usuário
    registerUser(username, password);

    // Limpa o formulário e fecha o modal
    document.getElementById("registerForm").reset();
    const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
    registerModal.hide();
});

// Evento de envio do formulário de login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Chama a função para realizar o login
    login(username, password);

    // Limpa o formulário e fecha o modal
    document.getElementById("loginForm").reset();
    const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    loginModal.hide();
});

// Função para redirecionar para a página de projetos
function listaProjetos() {
    window.location.href = "projeto.html";
}



function logout() {
deleteCookie("loggedInUser"); // Remove o cookie
loggedInUser = null; // Reseta o estado do usuário logado
localStorage.setItem("loggedInUser", '');
alert("Você foi desconectado!");

updateUIAfterLogout();

//location.reload(); // Recarrega a página para redefinir a interface

window.location.href = "index.html"; 

}


function getCookie(name) {
const decodedCookie = decodeURIComponent(document.cookie);
const cookies = decodedCookie.split(';');
name = name + "=";
for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
    }
}
return null;
}


function deleteCookie(name) {
document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}
