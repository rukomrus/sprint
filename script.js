document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const showSprintsBtn = document.getElementById('show-sprints');
    const showRewardsBtn = document.getElementById('show-rewards');
    const showRetrospectiveBtn = document.getElementById('show-retrospective');
    const showDataManagementBtn = document.getElementById('show-data-management');

    const sprintsSection = document.getElementById('sprints-section');
    const rewardsSection = document.getElementById('rewards-section');
    const retrospectiveSection = document.getElementById('retrospective-section');
    const dataManagementSection = document.getElementById('data-management-section');

    const sprintsList = document.getElementById('sprints-list');
    const addSprintBtn = document.getElementById('add-sprint-btn');
    const sprintModal = document.getElementById('sprint-modal');
    const sprintIdInput = document.getElementById('sprint-id-input');
    const sprintNameInput = document.getElementById('sprint-name');
    const sprintGoalInput = document.getElementById('sprint-goal');
    const saveSprintBtn = document.getElementById('save-sprint-btn');
    const closeButtons = document.querySelectorAll('.close-button');

    const tasksModal = document.getElementById('tasks-modal');
    const tasksModalTitle = document.getElementById('tasks-modal-title');
    const currentSprintNameSpan = document.getElementById('current-sprint-name');
    const tasksList = document.getElementById('tasks-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const taskIdInput = document.getElementById('task-id-input');
    const taskDescriptionInput = document.getElementById('task-description');
    const saveTaskBtn = document.getElementById('save-task-btn');

    const creditsCountSpan = document.getElementById('credits-count');
    const currentCreditsMainSpan = document.getElementById('current-credits-main');
    const addCreditsBtn = document.getElementById('add-credits-btn');
    const spendCreditsBtn = document.getElementById('spend-credits-btn');
    const creditsModal = document.getElementById('credits-modal');
    const creditsAmountInput = document.getElementById('credits-amount');
    const creditsReasonInput = document.getElementById('credits-reason');
    const applyCreditsBtn = document.getElementById('apply-credits-btn');

    const trophiesList = document.getElementById('trophies-list');
    const addTrophyBtn = document.getElementById('add-trophy-btn');
    const trophyModal = document.getElementById('trophy-modal');
    const trophyDescriptionInput = document.getElementById('trophy-description');
    const saveTrophyBtn = document.getElementById('save-trophy-btn');

    const retrospectiveNotes = document.getElementById('retrospective-notes');
    const saveRetrospectiveBtn = document.getElementById('save-retrospective-btn');

    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    const importFileInput = document.getElementById('import-file-input');
    const clearDataBtn = document.getElementById('clear-data-btn');

    // Add active class to the initial active button
    showSprintsBtn.classList.add('active');

    // --- Global Data Storage ---
    let appData = {
        sprints: [],
        credits: 0,
        trophies: [],
        retrospective: ""
    };

    let currentSprintId = null; // Used for managing tasks in the tasks modal

    // --- Data Management Functions ---
    const saveData = () => {
        localStorage.setItem('agileAppData', JSON.stringify(appData));
        updateCreditsDisplay();
    };

    const loadData = () => {
        const storedData = localStorage.getItem('agileAppData');
        if (storedData) {
            appData = JSON.parse(storedData);
        } else {
            // Initialize with your sample data if no data exists
            appData.sprints = [
                {
                    id: 'sprint1',
                    name: 'Спринт 1',
                    goal: 'Цель спринта 1.',
                    tasks: [
                        { id: 't1_1', description: 'Задача 1', completed: false },
                        { id: 't1_2', description: 'Задача 2', completed: false }
                    ]
                },
                {
                    id: 'sprint2',
                    name: 'Космический полёт в JavaScript',
                    goal: 'Освоить основы JavaScript и добавить интерактивность в проект.',
                    tasks: [
                        { id: 't2_1', description: 'Пройти уроки по JavaScript (переменные, функции, события) на freeCodeCamp', completed: false },
                        { id: 't2_2', description: 'Добавить на страницу интерактив (кнопку, меняющую текст или цвет)', completed: false },
                        { id: 't2_3', description: 'Использовать ИИ для генерации простого JS-кода', completed: false },
                        { id: 't2_4', description: 'Собрать 5 идей приложения, обсудить 1–2 с друзьями', completed: false }
                    ]
                },
                {
                    id: 'sprint3',
                    name: 'Гиперпрыжок к MVP',
                    goal: 'Выбрать идею приложения и начать прототип.',
                    tasks: [
                        { id: 't3_1', description: 'Выбрать 1 идею приложения (на основе анализа и обратной связи)', completed: false },
                        { id: 't3_2', description: 'Создать прототип MVP (базовый интерфейс с 1–2 функциями)', completed: false },
                        { id: 't3_3', description: 'Изучить основы работы с API', completed: false },
                        { id: 't3_4', description: 'Использовать ИИ для генерации макета дизайна или проверки кода', completed: false }
                    ]
                },
                {
                    id: 'sprint4',
                    name: 'Посадка на рынок',
                    goal: 'Доработать прототип и подготовить к публикации.',
                    tasks: [
                        { id: 't4_1', description: 'Добавить 1–2 ключевые функции в прототип', completed: false },
                        { id: 't4_2', description: 'Опубликовать приложение на бесплатной платформе', completed: false },
                        { id: 't4_3', description: 'Протестировать приложение с 2–3 пользователями, собрать обратную связь', completed: false },
                        { id: 't4_4', description: 'Исследовать способы монетизации', completed: false }
                    ]
                }
            ];
            saveData(); // Save initial data to localStorage
        }
        renderSprints();
        renderTrophies();
        retrospectiveNotes.value = appData.retrospective;
        updateCreditsDisplay();
    };

    // --- UI Rendering Functions ---
    const updateCreditsDisplay = () => {
        creditsCountSpan.textContent = appData.credits;
        currentCreditsMainSpan.textContent = appData.credits;
    };

    const renderSprints = () => {
        sprintsList.innerHTML = '';
        appData.sprints.forEach(sprint => {
            const sprintCard = document.createElement('div');
            sprintCard.classList.add('sprint-card');
            sprintCard.innerHTML = `
                <div>
                    <h3>${sprint.name}</h3>
                    <p>${sprint.goal}</p>
                </div>
                <div class="sprint-actions">
                    <button class="view-tasks-btn" data-sprint-id="${sprint.id}">Задачи</button>
                    <button class="edit-sprint-btn edit" data-sprint-id="${sprint.id}" title="Редактировать">&#9998;</button>
                    <button class="delete-sprint-btn delete" data-sprint-id="${sprint.id}" title="Удалить">&#128465;</button>
                </div>
            `;
            sprintsList.appendChild(sprintCard);
        });
    };

    const renderTasks = (sprintId) => {
        tasksList.innerHTML = '';
        const sprint = appData.sprints.find(s => s.id === sprintId);
        if (sprint) {
            currentSprintNameSpan.textContent = sprint.name;
            sprint.tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                taskItem.innerHTML = `
                    <input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span>${task.description}</span>
                    <div class="task-actions">
                        <button class="edit-task-btn" data-task-id="${task.id}" data-sprint-id="${sprintId}" title="Редактировать">&#9998;</button>
                        <button class="delete-task-btn delete" data-task-id="${task.id}" data-sprint-id="${sprintId}" title="Удалить">&#128465;</button>
                    </div>
                `;
                tasksList.appendChild(taskItem);
            });
        }
    };

    const renderTrophies = () => {
        trophiesList.innerHTML = '';
        appData.trophies.forEach(trophy => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${trophy.description}</span>
                <button class="delete-trophy-btn" data-trophy-id="${trophy.id}" title="Удалить">&#128465;</button>
            `;
            trophiesList.appendChild(li);
        });
    };

    // --- Event Handlers ---
    const switchSection = (sectionToShow, activeButton) => {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden-section');
        section.classList.remove('active-section');
    });
    // Remove active class from all sidebar buttons
    document.querySelectorAll('.sidebar nav button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected section
    sectionToShow.classList.remove('hidden-section');
    sectionToShow.classList.add('active-section');
    // Add active class to the clicked button
    if (activeButton) {
        activeButton.classList.add('active');
    }
};

// Update event listeners to pass the button element
showSprintsBtn.addEventListener('click', (e) => switchSection(sprintsSection, e.target));
showRewardsBtn.addEventListener('click', (e) => switchSection(rewardsSection, e.target));
showRetrospectiveBtn.addEventListener('click', (e) => switchSection(retrospectiveSection, e.target));
showDataManagementBtn.addEventListener('click', (e) => switchSection(dataManagementSection, e.target));

// Also update the initial load to set the active button
showSprintsBtn.click(); // Simulate click to set initial active state

    // Sprint Management
    addSprintBtn.addEventListener('click', () => {
        sprintModal.style.display = 'flex';
        sprintIdInput.value = '';
        sprintNameInput.value = '';
        sprintGoalInput.value = '';
    });

    sprintsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-tasks-btn')) {
            currentSprintId = e.target.dataset.sprintId;
            renderTasks(currentSprintId);
            tasksModal.style.display = 'flex';
        } else if (e.target.classList.contains('edit-sprint-btn')) {
            const sprintId = e.target.dataset.sprintId;
            const sprint = appData.sprints.find(s => s.id === sprintId);
            if (sprint) {
                sprintIdInput.value = sprint.id;
                sprintNameInput.value = sprint.name;
                sprintGoalInput.value = sprint.goal;
                sprintModal.style.display = 'flex';
            }
        } else if (e.target.classList.contains('delete-sprint-btn')) {
            const sprintId = e.target.dataset.sprintId;
            if (confirm('Вы уверены, что хотите удалить этот спринт и все его задачи?')) {
                appData.sprints = appData.sprints.filter(s => s.id !== sprintId);
                saveData();
                renderSprints();
            }
        }
    });

    saveSprintBtn.addEventListener('click', () => {
        const id = sprintIdInput.value;
        const name = sprintNameInput.value.trim();
        const goal = sprintGoalInput.value.trim();

        if (!name || !goal) {
            alert('Пожалуйста, заполните все поля для спринта.');
            return;
        }

        if (id) {
            // Edit existing sprint
            const sprintIndex = appData.sprints.findIndex(s => s.id === id);
            if (sprintIndex !== -1) {
                appData.sprints[sprintIndex].name = name;
                appData.sprints[sprintIndex].goal = goal;
            }
        } else {
            // Add new sprint
            appData.sprints.push({
                id: 'sprint' + Date.now(),
                name,
                goal,
                tasks: []
            });
        }
        saveData();
        renderSprints();
        sprintModal.style.display = 'none';
    });

    // Task Management
    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        taskIdInput.value = '';
        taskDescriptionInput.value = '';
    });

    tasksList.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            const taskId = e.target.dataset.taskId;
            const sprint = appData.sprints.find(s => s.id === currentSprintId);
            if (sprint) {
                const task = sprint.tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = e.target.checked;
                    saveData();
                    renderTasks(currentSprintId); // Re-render to update class
                }
            }
        } else if (e.target.classList.contains('edit-task-btn')) {
            const taskId = e.target.dataset.taskId;
            const sprint = appData.sprints.find(s => s.id === currentSprintId);
            if (sprint) {
                const task = sprint.tasks.find(t => t.id === taskId);
                if (task) {
                    taskIdInput.value = task.id;
                    taskDescriptionInput.value = task.description;
                    taskModal.style.display = 'flex';
                }
            }
        } else if (e.target.classList.contains('delete-task-btn')) {
            const taskId = e.target.dataset.taskId;
            if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                const sprint = appData.sprints.find(s => s.id === currentSprintId);
                if (sprint) {
                    sprint.tasks = sprint.tasks.filter(t => t.id !== taskId);
                    saveData();
                    renderTasks(currentSprintId);
                }
            }
        }
    });

    saveTaskBtn.addEventListener('click', () => {
        const id = taskIdInput.value;
        const description = taskDescriptionInput.value.trim();

        if (!description) {
            alert('Пожалуйста, введите описание задачи.');
            return;
        }

        const sprint = appData.sprints.find(s => s.id === currentSprintId);
        if (sprint) {
            if (id) {
                // Edit existing task
                const taskIndex = sprint.tasks.findIndex(t => t.id === id);
                if (taskIndex !== -1) {
                    sprint.tasks[taskIndex].description = description;
                }
            } else {
                // Add new task
                sprint.tasks.push({
                    id: 'task' + Date.now(),
                    description,
                    completed: false
                });
            }
            saveData();
            renderTasks(currentSprintId);
            taskModal.style.display = 'none';
        }
    });

    // Reward Management
    addCreditsBtn.addEventListener('click', () => {
        creditsModal.style.display = 'flex';
        creditsAmountInput.value = '0';
        creditsReasonInput.value = '';
        applyCreditsBtn.dataset.type = 'add'; // Custom attribute to determine action
        applyCreditsBtn.textContent = 'Добавить';
    });

    spendCreditsBtn.addEventListener('click', () => {
        creditsModal.style.display = 'flex';
        creditsAmountInput.value = '0';
        creditsReasonInput.value = '';
        applyCreditsBtn.dataset.type = 'spend'; // Custom attribute to determine action
        applyCreditsBtn.textContent = 'Потратить';
    });

    applyCreditsBtn.addEventListener('click', () => {
        let amount = parseInt(creditsAmountInput.value);
        const reason = creditsReasonInput.value.trim();
        const type = applyCreditsBtn.dataset.type;

        if (isNaN(amount) || amount <= 0) {
            alert('Пожалуйста, введите положительное число кредитов.');
            return;
        }

        if (type === 'add') {
            appData.credits += amount;
        } else if (type === 'spend') {
            if (appData.credits < amount) {
                alert('Недостаточно космических кредитов!');
                return;
            }
            appData.credits -= amount;
        }

        // Optionally, store credit history with reason
        // appData.creditHistory.push({ type, amount, reason, date: new Date().toISOString() });

        saveData();
        updateCreditsDisplay();
        creditsModal.style.display = 'none';
    });

    addTrophyBtn.addEventListener('click', () => {
        trophyModal.style.display = 'flex';
        trophyDescriptionInput.value = '';
    });

    saveTrophyBtn.addEventListener('click', () => {
        const description = trophyDescriptionInput.value.trim();
        if (!description) {
            alert('Пожалуйста, введите описание трофея.');
            return;
        }
        appData.trophies.push({ id: 'trophy' + Date.now(), description });
        saveData();
        renderTrophies();
        trophyModal.style.display = 'none';
    });

    trophiesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-trophy-btn')) {
            const trophyId = e.target.dataset.trophyId;
            if (confirm('Вы уверены, что хотите удалить этот трофей?')) {
                appData.trophies = appData.trophies.filter(t => t.id !== trophyId);
                saveData();
                renderTrophies();
            }
        }
    });

    // Retrospective Management
    saveRetrospectiveBtn.addEventListener('click', () => {
        appData.retrospective = retrospectiveNotes.value.trim();
        saveData();
        alert('Заметки по ретроспективе сохранены!');
    });

    // Data Import/Export/Clear
    exportDataBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(appData, null, 2); // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agile_plan_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importDataBtn.addEventListener('click', () => {
        importFileInput.click(); // Trigger file input click
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (confirm('Импортированные данные заменят текущие. Вы уверены?')) {
                        appData = importedData;
                        saveData();
                        loadData(); // Re-render all sections with new data
                        alert('Данные успешно импортированы!');
                    }
                } catch (error) {
                    alert('Ошибка при импорте данных. Убедитесь, что это корректный JSON-файл.');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        }
    });

    clearDataBtn.addEventListener('click', () => {
        if (confirm('ВНИМАНИЕ! Это действие удалит ВСЕ ваши данные (спринты, задачи, кредиты, трофеи). Вы уверены?')) {
            localStorage.removeItem('agileAppData');
            appData = {
                sprints: [],
                credits: 0,
                trophies: [],
                retrospective: ""
            };
            loadData(); // Re-load to reset UI and initial data
            alert('Все данные удалены!');
        }
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === sprintModal) {
            sprintModal.style.display = 'none';
        }
        if (e.target === tasksModal) {
            tasksModal.style.display = 'none';
        }
        if (e.target === taskModal) {
            taskModal.style.display = 'none';
        }
        if (e.target === creditsModal) {
            creditsModal.style.display = 'none';
        }
        if (e.target === trophyModal) {
            trophyModal.style.display = 'none';
        }
    });

    // --- Initial Load ---
    loadData();
});
