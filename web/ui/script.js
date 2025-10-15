const API_URL = "http://localhost:3000"; // ou http://localhost:3000

const nomeProfessor = localStorage.getItem("professorNome") || "Nome do Professor";
document.getElementById("professorNome").textContent = nomeProfessor;

async function carregarTurma() {
  const tbody = document.getElementById("listaTurmas");
  tbody.innerHTML = `<tr><td colspan="3">Carregando...</td></tr>`;

  try {
    const resposta = await fetch(`${API_URL}/turma`);
    if (!resposta.ok) {
      throw new Error("Erro ao buscar turma");
    }

    const turma = await resposta.json();

    if (turma.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3">Nenhuma turma cadastrada.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    turma.forEach((turma, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${turma.nome}</td>
        <td>
          <button class="btn-excluir" onclick="excluirTurma(${turma.id})">Excluir</button>
          <button class="btn-visualizar" onclick="visualizarTurma(${turma.id})">Visualizar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro ao carregar turma:", erro);
    tbody.innerHTML = `<tr><td colspan="3" style="color:red;">Erro ao carregar turma</td></tr>`;
  }
}

async function excluirTurma(id) {
  if (!confirm("Deseja realmente excluir esta turma?")) return;

  try {
    const resposta = await fetch(`${API_URL}/turma/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) throw new Error("Erro ao excluir turma");

    alert("Turma excluída com sucesso!");
    carregarTurma();
  } catch (erro) {
    alert("Erro ao excluir turma");
    console.error(erro);
  }
}

function visualizarTurma(id) {
  localStorage.setItem("turmaelecionada", id);
  window.location.href = "atividades.html";
}

document.getElementById("btnCadastrar").addEventListener("click", async () => {
  const nome = prompt("Digite o nome da nova turma:");
  if (!nome) return;

  try {
    const resposta = await fetch(`${API_URL}/turma`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    if (!resposta.ok) throw new Error("Erro ao cadastrar turma");

    alert("Turma cadastrada com sucesso!");
    carregarTurma();
  } catch (erro) {
    console.error("Erro ao cadastrar turma:", erro);
    alert("Erro ao cadastrar turma");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("professorNome");
  window.location.href = "../login/index.html";
});

carregarTurma();
