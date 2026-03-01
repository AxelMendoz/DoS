const form = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const userList = document.getElementById("userList");
const userIdInput = document.getElementById("userId");

const API_URL = "http://localhost:3000";

async function cargarUsuarios() {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();

    userList.innerHTML = "";

    data.forEach(user => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="user-name">${user.name}</span>
            <div>
                <button class="edit" onclick="editarUsuario(${user.id}, '${user.name}')">Editar</button>
                <button class="delete" onclick="eliminarUsuario(${user.id})">Eliminar</button>
            </div>
        `;

        userList.appendChild(li);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const id = userIdInput.value;

    if (id) {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
    } else {
        await fetch(`${API_URL}/guardar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
    }

    form.reset();
    userIdInput.value = "";
    // leave editing mode after save
    form.classList.remove('editing');
    const editNotice = document.getElementById('editNotice');
    if (editNotice) editNotice.style.display = 'none';
    cargarUsuarios();
});

function editarUsuario(id, name) {
    userIdInput.value = id;
    nameInput.value = name;
    // indicate editing state in the form
    form.classList.add('editing');
    const editNotice = document.getElementById('editNotice');
    if (editNotice) editNotice.style.display = 'inline-block';
    nameInput.focus();
}

async function eliminarUsuario(id) {
    await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE"
    });

    cargarUsuarios();
}

cargarUsuarios();