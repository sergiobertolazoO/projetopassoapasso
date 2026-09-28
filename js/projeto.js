



        
        
        
        
        
                // Variável global para armazenar os projetos
                let projects = [];
        
                // Função para renderizar a lista de projetos
                function renderProjectsOld() {
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

                function renderProjects() {
                    const projectList = document.getElementById("projectList"); // Elemento onde os projetos serão exibidos
                    projectList.innerHTML = ""; // Limpa a lista antes de renderizar
                
                    //verifica se existe 
                    //checkUserProjects();

                    //alert('render! ');

                  
                    const ul = document.createElement("ul");
                    ul.className = "list-group";
                
                    projects.forEach((project) => {
                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex justify-content-between align-items-center";
                        li.innerHTML = `
                            <div>
                                <h5>${project.name}</h5>
                                <p>Tipo: ${project.type}</p>
                                <p>Início: ${project.startDate} | Término: ${project.endDate}</p>
                            </div>
                            <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Excluir</button>
                        `;
                        ul.appendChild(li);
                    });
                
                    projectList.appendChild(ul);
                }


                function checkUserProjects() {
                    
                    try{
                    if (!db) {
                        console.log("Banco de dados não está disponível.");
                        return;
                    }
                
                    
                    const transaction = db.transaction("projects", "readonly");
                    const projectStore = transaction.objectStore("projects");
                    
                    //console.log(projectStore);
                
                    const getAllRequest = projectStore.getAll();

                    console.log(getAllRequest);
                
                    getAllRequest.onsuccess = () => {
                        const projectsFiltred = getAllRequest.result;

                        console.log(projectsFiltred);
                
                        // Filtrar projetos do usuário logado
                        const userProjects = projectsFiltred.filter((project) => project.creator === loggedInUser);
                
                        //alert('here')

                        //alert(userProjects)

                        if (userProjects.length > 0) {

                            //alert('here 2')

                            console.log(`Usuário ${loggedInUser} tem ${userProjects.length} projeto(s) cadastrado(s).`);

                         projects = userProjects;

                         renderProjects();

                        } else {

                            if (projects.length === 0) {
                        
                                projectList.innerHTML = '<p class="text-center">Nenhum projeto encontrado.</p>';
                                return;
                            }
                        

                            console.log(`Usuário ${loggedInUser} não tem projetos cadastrados.`);
                        }
                    };
                
                    getAllRequest.onerror = () => {
                        console.error("Erro ao verificar os projetos do usuário.");
                    };

                    }catch(e){
                        return;
                    }
                }




 
        
                // Função para adicionar um novo projeto
                document.getElementById("projectForm").addEventListener("submit", function (event) {
                    event.preventDefault();
        
                    const name = document.getElementById("projectName").value;
                    const type = document.getElementById("projectType").value;
                    const startDate = document.getElementById("startDate").value;
                    const endDate = document.getElementById("endDate").value;
         

                    saveProject(name, type, startDate, endDate, loggedInUser);


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

            //alert('saveProject');
        
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


        function loadProjectsxxxx() {
            if (!db) {
                console.error("Banco de dados não está disponível.");
                return;
            }
        
            //const transaction = db.transaction("projects", "readonly");
            const projectStore = transaction.objectStore("projects");
        
            const getAllRequest = projectStore.getAll();
        
            getAllRequest.onsuccess = () => {
                const projects = getAllRequest.result; // Todos os projetos salvos no IndexedDB
                checkkUserProjects(); // Chama a função para renderizar os projetos na interface
            };
        
            getAllRequest.onerror = () => {
                console.error("Erro ao carregar os projetos.");
            };
        }

        function openDatabaseAfterCheckUser(){

            const MAX_TENTATIVAS = 5;
            const TEMPO_ESPERA = 5000; // Tempo em milissegundos (2 segundos)
            
            let tentativas = 0;

    

               // Chamar a função para abrir o banco de dados
               openDatabase();
    
  
    console.log("Iniciando checagem no Banco de Dados...");
  
    // O "while" controlado por tentativas e pela condição do DB
    while (tentativas < MAX_TENTATIVAS) {
      tentativas++;
      console.log(`Tentativa ${tentativas} de ${MAX_TENTATIVAS}...`);
       
  
   
  
      // Se ainda não achou e não estourou as tentativas, espera antes de tentar de novo
      if (tentativas < MAX_TENTATIVAS) {
        console.log(`Ainda é null. Aguardando ${TEMPO_ESPERA / 1000}s para a próxima tentativa...`);
        //await new Promise(resolve => );
        setTimeout(TEMPO_ESPERA);
                try{
                // Renderiza a lista de projetos ao carregar a página

                if (db != null && db != undefined) {

                    //alert(db);
                    //alert('start check proj');
                    checkUserProjects();
                    console.log("Dados encontrados com sucesso!");
                    
                    break; // Sai do loop imediatamente se achar os dados
                  }
                
                }
                catch(e){
                    console.log('tentativa fail');
                }
      }
    }
  
        // Verificação final após sair do loop
        if (db == null) {
        console.log("Erro: Timeout atingido. O valor do DB continuou null após 5 tentativas.");
        // Aqui você trata o erro (ex: joga um throw, avisa o usuário, etc)
        return;
        }
    
 

        }

        openDatabaseProjects();   

        //openDatabaseAfterCheckUser();
  
        
        
        
        
        
        
        
        