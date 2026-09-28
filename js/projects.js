// Função para adicionar um projeto
function addProject(name, type, startDate, endDate) {
    if (!db) {
        console.error("Banco de dados não está disponível.");
        return;
    }

    const transaction = db.transaction("projects", "readwrite");
    const projectStore = transaction.objectStore("projects");

    const project = {
        name,
        type,
        startDate,
        endDate,
        creator: loggedInUser // Associa o projeto ao usuário logado
    };

    const addRequest = projectStore.add(project);

    addRequest.onsuccess = () => {
        console.log("Projeto adicionado com sucesso!");
        alert("Projeto criado com sucesso!");
        loadProjects(); // Atualiza a lista de projetos
    };

    addRequest.onerror = () => {
        console.error("Erro ao adicionar o projeto.");
    };
}

// Função para carregar projetos do usuário logado
function loadProjects() {
    if (!db) {
        console.error("Banco de dados não está disponível.");
        return;
    }

    const transaction = db.transaction("projects", "readonly");
    const projectStore = transaction.objectStore("projects");

    const getAllRequest = projectStore.getAll();

    getAllRequest.onsuccess = () => {
        const projects = getAllRequest.result.filter((project) => project.creator === loggedInUser);
        renderProjects(projects);
    };

    getAllRequest.onerror = () => {
        console.error("Erro ao carregar os projetos.");
    };
}

// Função para renderizar projetos na interface
function renderProjects(projects) {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = "";

    if (projects.length === 0) {
        projectList.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
        return;
    }

    projects.forEach((project) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h5>${project.name}</h5>
            <p>Tipo: ${project.type}</p>
            <p>Início: ${project.startDate} | Término: ${project.endDate}</p>
        `;
        projectList.appendChild(div);
    });
}