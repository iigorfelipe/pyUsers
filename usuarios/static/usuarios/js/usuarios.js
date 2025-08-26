document.addEventListener('DOMContentLoaded', () => {
  const modal = new bootstrap.Modal(document.getElementById('userModal'));
  const form = document.getElementById('userForm');
  const title = document.getElementById('userModalTitle');
  const nomeInput = document.getElementById('userNome');
  const emailInput = document.getElementById('userEmail');
  const estadoSelect = document.getElementById('userEstado');
  const cidadeSelect = document.getElementById('userCidade');
  const submitBtn = form.querySelector('button[type="submit"]');

  // #region Estados
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

  const checkFormValidity = () => {
    submitBtn.disabled = !(
      nomeInput.value.trim() &&
      emailInput.value.trim() &&
      estadoSelect.value &&
      cidadeSelect.value
    );
  };

  [nomeInput, emailInput, estadoSelect, cidadeSelect].forEach((el) => {
    el.addEventListener('input', checkFormValidity);
    el.addEventListener('change', checkFormValidity);
  });

  //#region Cadastrar usuario
  document.getElementById('createBtn').addEventListener('click', () => {
    form.action = '/';
    title.textContent = 'Cadastrar Usuário';
    nomeInput.value = '';
    emailInput.value = '';
    estadoSelect.value = '';
    cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
    submitBtn.disabled = true;
    modal.show();
  });

  // # Atualizar usuario
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

      cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
      if (estado) {
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
      }

      checkFormValidity();
      modal.show();
    });
  });

  // #region Filtragem
  const filterInput = document.getElementById('filterInput');
  const clearBtn = document.getElementById('clearFilterBtn');

  if (filterInput) {
    let timeout;
    let lastQuery = '';
    let lastFetchTime = 0;
    const MIN_LENGTH = 2;
    const CACHE_DURATION = 60 * 1000;

    const applyFilter = (query) => {
      const now = Date.now();
      if (query === lastQuery && now - lastFetchTime < CACHE_DURATION) return;

      lastQuery = query;
      lastFetchTime = now;
      const url = new URL(window.location.href);

      if (query.length >= MIN_LENGTH) {
        clearBtn.style.display = 'inline-block';
        url.searchParams.set('q', query);
        window.location.href = url.toString();
      } else {
        clearBtn.style.display = 'none';
        url.searchParams.delete('q');
        if (query.length === 0) {
          window.location.href = url.toString();
        }
      }
    };

    filterInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => applyFilter(filterInput.value.trim()), 500);
    });

    clearBtn.addEventListener('click', () => {
      filterInput.value = '';
      lastQuery = '';
      clearBtn.style.display = 'none';
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      window.location.href = url.toString();
    });

    // ==== Focar input após reload ====
    if (filterInput.value.trim().length > 0) {
      const val = filterInput.value;
      filterInput.focus();
      filterInput.setSelectionRange(val.length, val.length);
      clearBtn.style.display = 'inline-block';
      lastQuery = val;
      lastFetchTime = Date.now();
    }
  }
});
