document.addEventListener('DOMContentLoaded', () => {
  const modal = new bootstrap.Modal(document.getElementById('userModal'));
  const form = document.getElementById('userForm');
  const title = document.getElementById('userModalTitle');
  const nomeInput = document.getElementById('userNome');
  const emailInput = document.getElementById('userEmail');
  const estadoSelect = document.getElementById('userEstado');
  const cidadeSelect = document.getElementById('userCidade');

  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then((res) => res.json())
    .then((data) => {
      estadoSelect.innerHTML = '<option value="">Selecione um estado</option>';
      data.forEach((e) => {
        const opt = document.createElement('option');
        opt.value = e.sigla;
        opt.textContent = `${e.nome} (${e.sigla})`;
        estadoSelect.appendChild(opt);
      });
    });

  // #region Cidades
  estadoSelect.addEventListener('change', () => {
    cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    if (!estadoSelect.value) return;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelect.value}/municipios`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c.nome;
          opt.textContent = c.nome;
          cidadeSelect.appendChild(opt);
        });
      });
  });

  // #region Modal - Cadastrar
  document.getElementById('createBtn').addEventListener('click', () => {
    title.textContent = 'Cadastrar Usuário';
    nomeInput.value = '';
    emailInput.value = '';
    estadoSelect.value = '';
    cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    modal.show();
  });

  //#region Modal - Atualizar
  document.querySelectorAll('.update-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const nome = btn.dataset.nome;
      const email = btn.dataset.email;
      const estado = btn.dataset.estado;
      const cidade = btn.dataset.cidade;

      form.action = `/usuario/${id}/atualizar/`;
      title.textContent = 'Atualizar Usuário';
      nomeInput.value = nome;
      emailInput.value = email;
      estadoSelect.value = estado;

      // #region Cidades do estado
      cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
      if (!estado) return;
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((c) => {
            const opt = document.createElement('option');
            opt.value = c.nome;
            opt.textContent = c.nome;
            if (c.nome === cidade) opt.selected = true;
            cidadeSelect.appendChild(opt);
          });
        });

      modal.show();
    });
  });
});
