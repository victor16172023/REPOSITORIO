const languageSelect = document.getElementById('languageSelect');
const refreshButton = document.getElementById('refreshButton');
const loader = document.getElementById('loader');
const statusMessage = document.getElementById('statusMessage');
const repoCard = document.getElementById('repoCard');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  showToast('Tema cambiado');
});

refreshButton.addEventListener('click', () => {
  const language = languageSelect.value;
  if (!language) {
    statusMessage.textContent = '⚠️ Selecciona un lenguaje';
    return;
  }
  fetchRandomRepo(language);
});

function showLoader() {
  loader.classList.remove('hidden');
  statusMessage.textContent = '';
  repoCard.innerHTML = '';
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function fetchRandomRepo(language) {
  showLoader();
  const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=50`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Error de conexión');
      return res.json();
    })
    .then(data => {
      hideLoader();
      if (data.items.length === 0) {
        statusMessage.textContent = 'Sin resultados.';
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.items.length);
      const repo = data.items[randomIndex];
      displayRepo(repo);
    })
    .catch(err => {
      hideLoader();
      statusMessage.textContent = '❌ Error: ' + err.message;
    });
}

function displayRepo(repo) {
  repoCard.innerHTML = `
    <h2>${repo.name}</h2>
    <p>${repo.description || 'Sin descripción.'}</p>
    <div class="card-stats">
      ⭐ ${repo.stargazers_count}
      🍴 ${repo.forks_count}
      🐛 ${repo.open_issues_count}
    </div>
    <div class="card-meta">
      👨‍💻 ${repo.owner.login}
      <a href="${repo.html_url}" target="_blank">🔗 Ver</a>
    </div>
  `;
  statusMessage.textContent = '';
}
