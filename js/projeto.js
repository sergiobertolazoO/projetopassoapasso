


        // Abrir ou criar um banco de dados
        const request = indexedDB.open("UserDatabase", 1); // Atualize a versão do banco para 2

        request.onupgradeneeded = (event) => {
            db = event.target.result;
        
            // Criar uma store para usuários, se ainda não existir
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "username" });
            }
        
            // Criar uma store para projetos
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
        
        
        
        
        
        
        
                // Variável global para armazenar os projetos
                let projects = [];
        
                // Função para renderizar a lista de projetos
                function renderProjects() {
                    const projectList = document.getElementById("projectList");
                    projectList.innerHTML = ""; // Limpa a lista
        
                    if (projects.length === 0) {
                        projectList.innerHTML = '<p class="text-center">Nenhum projeto encontrado. Clique em "Criar Projeto" para adicionar um novo.</p>';
                        return;
                    }
        
                    const ul = document.createElement("ul");
                    ul.className = "list-group";
        
                    projects.forEach((project, index) => {
                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex justify-content-between align-items-center";
                        li.innerHTML = `
                            <div>
                                <h5>${project.name}</h5>
                                <p>Tipo: ${project.type}</p>
                                <p>Início: ${project.startDate} | Término: ${project.endDate}</p>
                            </div>
                            <button class="btn btn-danger btn-sm" onclick="deleteProject(${index})">Excluir</button>
                        `;
                        ul.appendChild(li);
                    });
        
                    projectList.appendChild(ul);
                }
        
                // Função para adicionar um novo projeto
                document.getElementById("projectForm").addEventListener("submit", function (event) {
                    event.preventDefault();
        
                    const name = document.getElementById("projectName").value;
                    const type = document.getElementById("projectType").value;
                    const startDate = document.getElementById("startDate").value;
                    const endDate = document.getElementById("endDate").value;
        
                    // Adiciona o projeto à lista
                    projects.push({ name, type, startDate, endDate });
        
                    // Atualiza a lista de projetos
                    renderProjects();
        
                    // Limpa o formulário e fecha o modal
                    document.getElementById("projectForm").reset();
                    const projectModal = bootstrap.Modal.getInstance(document.getElementById("projectModal"));
                    projectModal.hide();
                });
        
                // Função para excluir um projeto
                function deleteProject(index) {
                    projects.splice(index, 1); // Remove o projeto pelo índice
                    renderProjects(); // Atualiza a lista
                }
        
        
        
                // Função para salvar um projeto no IndexedDB
        function saveProject(name, type, startDate, endDate, creator) {
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
                creator, // Nome do usuário que criou o projeto
            };
        
            projectStore.add(project);
        
            transaction.oncomplete = () => {
                console.log("Projeto salvo com sucesso!");
                renderProjects(); // Atualiza a lista de projetos
            };
        
            transaction.onerror = () => {
                console.error("Erro ao salvar o projeto.");
            };
        }
        
                // Renderiza a lista de projetos ao carregar a página
                renderProjects();
        
        
        
        
        
        
        
        