// Variável global para armazenar a conexão com o banco de dados
let db;

// Função para abrir ou criar o banco de dados
async function openDatabase() {
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