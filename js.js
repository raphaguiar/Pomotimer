//cronômetro, variáveis declaradas
let timer;
let isRunning = false;
let remainingTime = 25 * 60; 
const timerDisplay = document.getElementById('timer');

//inicia o cronômetro, formata o tempo restante e atualiza a exibição a cada segundo
const startTimer = () => {
    timerDisplay.textContent = formatTime(remainingTime); //formata o tempo restante em minutos e segundos e atualiza

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            return;
        }
        remainingTime--;//tempo restante do cron em segundos
        timerDisplay.textContent = formatTime(remainingTime);//atualiza o tempo restante format em seg e min
    }, 1000);
};

//formato do cronômetro (minutos:segundos)
//converter um valor em segundos para uma string formatada
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

//botões
//inicia o cronômetro pomodoro configurando o tempo para 25 minutos, limpando intervalos anteriores, 
//e atualizando o estado dos botões, se o cronômetro não estiver em execução
const startPomodoro = () => {
    if (!isRunning) {
        clearInterval(timer);
        remainingTime = 25 * 60;
        startTimer();
        toggleButtons('pause');
        isRunning = true;
    }
};

//inicia o cronômetro de intervalo configurando o tempo para 5 minutos, limpando intervalos anteriores,
//e atualizando o estado dos botões, se o cronômetro não estiver em execução
const startBreak = () => {
    if (!isRunning) {
        clearInterval(timer);
        remainingTime = 5 * 60; 
        startTimer();
        toggleButtons('pause');
        isRunning = true;
    }
};


//alterna a visibilidade dos botões de controle com base na ação especificada 
//('pause' oculta os botões de iniciar/pausar e mostra o botão de pausar).
const toggleButtons = (action) => {
    const startPauseButton = document.getElementById('startPauseButton');
    const breakButton = document.getElementById('breakButton');
    const pauseButton = document.getElementById('pauseButton');

    if (action === 'pause') {
        startPauseButton.classList.add('hidden');
        breakButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
        pauseButton.textContent = 'Pausar';
    } else {
        startPauseButton.classList.remove('hidden');
        breakButton.classList.remove('hidden');
        pauseButton.classList.add('hidden');
    }
};

//alterna entre pausar e retomar o cronômetro com base no estado atual (isRunning).
const togglePauseResume = () => {
    if (isRunning) {
        pauseTimer();
    } else {
        resumeTimer();
    }
};

//pausa o cronômetro, limpa o intervalo ativo e atualiza o texto do botão de pausa para "Continuar"
const pauseTimer = () => {
    clearInterval(timer);
    isRunning = false;
    document.getElementById('pauseButton').textContent = 'Continuar'; 
};

//retoma o cronômetro chamando a função startTimer, define isRunning como verdadeiro
//e atualiza o texto do botão de pausa para "Pausar"
const resumeTimer = () => {
    startTimer();
    isRunning = true;
    document.getElementById('pauseButton').textContent = 'Pausar'; 
};

//adiciona eventos de clique aos botões para controlar o cronômetro pomodoro e pausá-lo
document.getElementById('startPauseButton').addEventListener('click', startPomodoro);
document.getElementById('breakButton').addEventListener('click', startBreak);
document.getElementById('pauseButton').addEventListener('click', togglePauseResume);

//lista de tarefas
let tarefas = [];

//carregando as tarefas do localstorage quando a página é carregada
window.onload = () => {
    const savedTasks = localStorage.getItem('tarefas');
    tarefas = savedTasks ? JSON.parse(savedTasks) : [];
    atualizarLista();
};

function adicionarTarefa() {
    const input = document.getElementById('tarefa');
    const novaTarefa = input.value.trim();

    if (novaTarefa) {
        tarefas.push(novaTarefa);
        input.value = '';
        atualizarLista();
        localStorage.setItem('tarefas', JSON.stringify(tarefas)); // salvando as tarefas no localstorage
    }
}

function atualizarLista() {
    const lista = document.getElementById('listaTarefas');
    lista.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
    const item = document.createElement('li');
    item.textContent = tarefa;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✔'; 
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => excluirTarefa(index, item);

    item.appendChild(deleteBtn);
    lista.appendChild(item);
    });
}

function excluirTarefa(index, item) { //removendo os itens da lista de tarefas
    item.classList.add('remover'); 
        setTimeout(() => {
        tarefas.splice(index, 1);
        atualizarLista();
        localStorage.setItem('tarefas', JSON.stringify(tarefas)); //atualizando as tarefas no localstorage
    }, 500); 
}

//troca de temas
const themeToggle = document.getElementById('themeToggle');
const themeStylesheet = document.getElementById('themeStylesheet');

let isDarkTheme = localStorage.getItem('theme') === 'dark'; //verificando o tema ativo na página

//carregando o tema inicial
if (isDarkTheme) {
    themeStylesheet.setAttribute('href', 'dark-theme.css');
    themeToggle.src = 'sun.png'; 
} else {
    themeStylesheet.setAttribute('href', 'light-theme.css');
    themeToggle.src = 'moon.png';
}

//salvando o tema pra que quando o usuário der refresh na página o tema não volte pro defaultl
themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
        themeStylesheet.setAttribute('href', 'dark-theme.css');
        themeToggle.src = 'sun.png';
        localStorage.setItem('theme', 'dark'); //salvando no localstorage
    } else {
        themeStylesheet.setAttribute('href', 'light-theme.css');
        themeToggle.src = 'moon.png';
        localStorage.setItem('theme', 'light'); //salvando no localstorage
    }
});
