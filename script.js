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
    const closeButtons = document.querySelectorAll('.close-button'); // Все кнопки закрытия модальных окон

    const tasksModal = document.getElementById('tasks-modal');
    const tasksModalTitle = document.getElementById('tasks-modal-title');
    const currentSprintNameSpan = document.getElementById('current-sprint-name');
    const tasksList = document.getElementById('tasks-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const taskIdInput = document.getElementById('task-id-input');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description'); // textarea
    const taskPointsInput = document.getElementById('task-points');
    const taskCompletedInput = document.getElementById('task-completed');
    const saveTaskBtn = document.getElementById('save-task-btn');

    const creditsCountSpan = document.getElementById('credits-count');
    const currentCreditsMainSpan = document.getElementById('current-credits-main');
    const addCreditsBtn = document.getElementById('add-credits-btn');
    const spendCreditsBtn = document.getElementById('spend-credits-btn');
    const creditsModal = document.getElementById('credits-modal');
    const creditsAmountInput = document.getElementById('credits-amount');
    const creditsReasonInput = document.getElementById('credits-reason');
    const applyCreditsBtn = document.getElementById('apply-credits-btn');
    const creditsOperationTypeInput = document.getElementById('credits-operation-type'); // Hidden input

    const addTrophyBtn = document.getElementById('add-trophy-btn');
    const trophyModal = document.getElementById('trophy-modal');
    const trophyIdInput = document.getElementById('trophy-id-input');
    const trophyNameInput = document.getElementById('trophy-name');
    const trophyDescriptionInput = document.getElementById('trophy-description');
    const saveTrophyBtn = document.getElementById('save-trophy-btn');
    const trophiesList = document.getElementById('trophies-list');

    const retrospectiveNotesTextarea = document.getElementById('retrospective-notes');
    const saveRetrospectiveBtn = document.getElementById('save-retrospective-btn');

    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataBtn = document.getElementById('import-data-btn');
    const importFileInput = document.getElementById('import-file-input');
    const clearDataBtn = document.getElementById('clear-data-btn');

    // --- App Data (global state) ---
    let appData = {
        sprints: [],
        credits: 0,
        trophies: [],
        retrospective: ""
    };
    let currentSprintId = null; // Used when managing tasks for a specific sprint

    // --- Utility Functions ---

    // Load data from LocalStorage
    function loadData() {
        const storedData = localStorage.getItem('agileAppData');
        if (storedData) {
            appData = JSON.parse(storedData);
        } else {
            // Initialize with some default data if no data exists (optional)
            appData = {
                sprints: [],
                credits: 0,
                trophies: [],
                retrospective: ""
            };
        }
        renderUI();
    }

    // Save data to LocalStorage
    function saveData() {
        localStorage.setItem('agileAppData', JSON.stringify(appData));
        renderUI(); // Re-render after saving
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // --- UI Rendering Functions ---

    function renderUI() {
        renderSprints();
        updateCreditsDisplay();
        renderTrophies();
        retrospectiveNotesTextarea.value = appData.retrospective;
        // Ensure only one section is active
        const activeSection = document.querySelector('.active-section');
        if (activeSection) {
            activeSection.classList.remove('active-section');
        }
        // Set default section to sprints on load
        sprintsSection.classList.add('active-section');
        showSprintsBtn.classList.add('active'); // Set initial active sidebar button
        showRewardsBtn.classList.remove('active');
        showRetrospectiveBtn.classList.remove('active');
        showDataManagementBtn.classList.remove('active');
    }

    function renderSprints() {
        sprintsList.innerHTML = '';
        if (appData.sprints.length === 0) {
            sprintsList.innerHTML = '<p>Пока нет спринтов. Нажмите "Добавить Спринт", чтобы начать!</p>';
            return;
        }

        appData.sprints.forEach(sprint => {
            const sprintCard = document.createElement('div');
            sprintCard.classList.add('sprint-card');
            sprintCard.dataset.id = sprint.id;

            const totalTasks = sprint.tasks.length;
            const completedTasks = sprint.tasks.filter(task => task.completed).length;
            const progressText = totalTasks > 0 ? `${completedTasks} из ${totalTasks}` : 'Нет задач';
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            sprintCard.innerHTML = `
                <h3>${sprint.name}</h3>
                <p>${sprint.goal}</p>
                <div class="sprint-progress">
                    <p>Прогресс: ${progressText}</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                    </div>
                </div>
                <div class="sprint-actions">
                    <button class="view-tasks-btn" data-id="${sprint.id}">Задачи</button>
                    <button class="edit-sprint-btn edit" data-id="${sprint.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-sprint-btn delete" data-id="${sprint.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            sprintsList.appendChild(sprintCard);
        });
    }

    function updateCreditsDisplay() {
        creditsCountSpan.textContent = appData.credits;
        currentCreditsMainSpan.textContent = appData.credits;
    }

    function renderTasks(sprintId) {
        tasksList.innerHTML = '';
        const sprint = appData.sprints.find(s => s.id === sprintId);

        if (!sprint) {
            tasksList.innerHTML = '<p>Спринт не найден.</p>';
            return;
        }

        currentSprintNameSpan.textContent = sprint.name;
        tasksModalTitle.textContent = `Задачи Спринта: "${sprint.name}"`;

        if (sprint.tasks.length === 0) {
            tasksList.innerHTML = '<p>В этом спринте пока нет задач. Добавьте первую задачу!</p>';
            return;
        }

        sprint.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <div>
                    <h4>${task.name} (${task.points} Кр.)</h4>
                    <p>${task.description}</p>
                </div>
                <div class="task-actions">
                    <button class="edit-task-btn edit" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-task-btn delete" data-id="${task.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            tasksList.appendChild(taskItem);
        });
    }

    function renderTrophies() {
        trophiesList.innerHTML = '';
        if (appData.trophies.length === 0) {
            trophiesList.innerHTML = '<p>Пока нет трофеев. Выполняйте задачи и получайте награды!</p>';
            return;
        }

        appData.trophies.forEach(trophy => {
            const li = document.createElement('li');
            li.dataset.id = trophy.id;
            li.innerHTML = `
                <span>${trophy.name}: ${trophy.description}</span>
                <button class="delete-trophy-btn delete" data-id="${trophy.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            trophiesList.appendChild(li);
        });
    }

    // --- Event Listeners ---

    // Navigation
    showSprintsBtn.addEventListener('click', () => {
        document.querySelector('.active-section').classList.remove('active-section');
        sprintsSection.classList.add('active-section');
        document.querySelector('.sidebar nav button.active').classList.remove('active');
        showSprintsBtn.classList.add('active');
    });

    showRewardsBtn.addEventListener('click', () => {
        document.querySelector('.active-section').classList.remove('active-section');
        rewardsSection.classList.add('active-section');
        document.querySelector('.sidebar nav button.active').classList.remove('active');
        showRewardsBtn.classList.add('active');
    });

    showRetrospectiveBtn.addEventListener('click', () => {
        document.querySelector('.active-section').classList.remove('active-section');
        retrospectiveSection.classList.add('active-section');
        document.querySelector('.sidebar nav button.active').classList.remove('active');
        showRetrospectiveBtn.classList.add('active');
    });

    showDataManagementBtn.addEventListener('click', () => {
        document.querySelector('.active-section').classList.remove('active-section');
        dataManagementSection.classList.add('active-section');
        document.querySelector('.sidebar nav button.active').classList.remove('active');
        showDataManagementBtn.classList.add('active');
    });

    // Sprint Management
    addSprintBtn.addEventListener('click', () => {
        sprintIdInput.value = '';
        sprintNameInput.value = '';
        sprintGoalInput.value = '';
        sprintModal.classList.add('visible'); // Show modal
    });

    saveSprintBtn.addEventListener('click', () => {
        const id = sprintIdInput.value;
        const name = sprintNameInput.value.trim();
        const goal = sprintGoalInput.value.trim();

        if (!name || !goal) {
            alert('Пожалуйста, введите название и цель спринта.');
            return;
        }

        if (id) {
            // Edit existing sprint
            const sprintIndex = appData.sprints.findIndex(s => s.id === id);
            if (sprintIndex > -1) {
                appData.sprints[sprintIndex].name = name;
                appData.sprints[sprintIndex].goal = goal;
            }
        } else {
            // Add new sprint
            appData.sprints.push({
                id: generateId(),
                name,
                goal,
                tasks: []
            });
        }
        saveData();
        sprintModal.classList.remove('visible'); // Hide modal
    });

    sprintsList.addEventListener('click', (e) => {
        // View Tasks
        if (e.target.classList.contains('view-tasks-btn')) {
            currentSprintId = e.target.dataset.id;
            renderTasks(currentSprintId);
            tasksModal.classList.add('visible'); // Show tasks modal
        }

        // Edit Sprint
        if (e.target.classList.contains('edit-sprint-btn')) {
            const sprintId = e.target.dataset.id;
            const sprint = appData.sprints.find(s => s.id === sprintId);
            if (sprint) {
                sprintIdInput.value = sprint.id;
                sprintNameInput.value = sprint.name;
                sprintGoalInput.value = sprint.goal;
                sprintModal.classList.add('visible'); // Show modal
            }
        }

        // Delete Sprint
        if (e.target.classList.contains('delete-sprint-btn')) {
            const sprintId = e.target.dataset.id;
            if (confirm('Вы уверены, что хотите удалить этот спринт и все его задачи?')) {
                appData.sprints = appData.sprints.filter(s => s.id !== sprintId);
                saveData();
            }
        }
    });

    // Task Management
    addTaskBtn.addEventListener('click', () => {
        taskIdInput.value = '';
        taskNameInput.value = '';
        taskDescriptionInput.value = '';
        taskPointsInput.value = 0;
        taskCompletedInput.checked = false;
        taskModal.classList.add('visible'); // Show task modal
    });

    saveTaskBtn.addEventListener('click', () => {
        const id = taskIdInput.value;
        const name = taskNameInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const points = parseInt(taskPointsInput.value, 10);
        const completed = taskCompletedInput.checked;

        if (!name || !description || isNaN(points) || points <= 0) {
            alert('Пожалуйста, заполните все поля задачи корректно.');
            return;
        }

        const sprint = appData.sprints.find(s => s.id === currentSprintId);
        if (!sprint) return; // Should not happen if currentSprintId is set correctly

        if (id) {
            // Edit existing task
            const taskIndex = sprint.tasks.findIndex(t => t.id === id);
            if (taskIndex > -1) {
                const oldCompleted = sprint.tasks[taskIndex].completed;
                const oldPoints = sprint.tasks[taskIndex].points;

                sprint.tasks[taskIndex].name = name;
                sprint.tasks[taskIndex].description = description;
                sprint.tasks[taskIndex].points = points;
                sprint.tasks[taskIndex].completed = completed;

                // Adjust credits if completion status changes
                if (completed && !oldCompleted) {
                    appData.credits += points; // Add credits on completion
                } else if (!completed && oldCompleted) {
                    appData.credits -= oldPoints; // Remove credits if un-completed
                } else if (completed && oldCompleted && points !== oldPoints) {
                    // If completed, but points changed, adjust difference
                    appData.credits += (points - oldPoints);
                }
            }
        } else {
            // Add new task
            const newTask = {
                id: generateId(),
                name,
                description,
                points,
                completed
            };
            sprint.tasks.push(newTask);
            if (completed) {
                appData.credits += points; // Add credits if added as completed
            }
        }
        saveData();
        renderTasks(currentSprintId); // Re-render tasks for the current sprint
        taskModal.classList.remove('visible'); // Hide task modal
    });

    tasksList.addEventListener('click', (e) => {
        const sprint = appData.sprints.find(s => s.id === currentSprintId);
        if (!sprint) return;

        // Toggle Task Completion
        if (e.target.type === 'checkbox') {
            const taskId = e.target.dataset.id;
            const task = sprint.tasks.find(t => t.id === taskId);
            if (task) {
                const oldCompleted = task.completed;
                task.completed = e.target.checked;
                if (task.completed && !oldCompleted) {
                    appData.credits += task.points;
                } else if (!task.completed && oldCompleted) {
                    appData.credits -= task.points;
                }
                saveData();
                renderTasks(currentSprintId); // Re-render to update UI
            }
        }

        // Edit Task
        if (e.target.classList.contains('edit-task-btn')) {
            const taskId = e.target.dataset.id;
            const task = sprint.tasks.find(t => t.id === taskId);
            if (task) {
                taskIdInput.value = task.id;
                taskNameInput.value = task.name;
                taskDescriptionInput.value = task.description;
                taskPointsInput.value = task.points;
                taskCompletedInput.checked = task.completed;
                taskModal.classList.add('visible'); // Show task modal
            }
        }

        // Delete Task
        if (e.target.classList.contains('delete-task-btn')) {
            const taskId = e.target.dataset.id;
            if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                const taskToDelete = sprint.tasks.find(t => t.id === taskId);
                if (taskToDelete && taskToDelete.completed) {
                    appData.credits -= taskToDelete.points; // Refund credits if task was completed
                }
                sprint.tasks = sprint.tasks.filter(t => t.id !== taskId);
                saveData();
                renderTasks(currentSprintId); // Re-render tasks for the current sprint
            }
        }
    });

    // Credits Management
    addCreditsBtn.addEventListener('click', () => {
        creditsAmountInput.value = '';
        creditsReasonInput.value = '';
        creditsOperationTypeInput.value = 'add'; // Set operation type
        creditsModal.classList.add('visible'); // Show credits modal
    });

    spendCreditsBtn.addEventListener('click', () => {
        creditsAmountInput.value = '';
        creditsReasonInput.value = '';
        creditsOperationTypeInput.value = 'spend'; // Set operation type
        creditsModal.classList.add('visible'); // Show credits modal
    });

    applyCreditsBtn.addEventListener('click', () => {
        const amount = parseInt(creditsAmountInput.value, 10);
        const reason = creditsReasonInput.value.trim();
        const operationType = creditsOperationTypeInput.value;

        if (isNaN(amount) || amount <= 0 || !reason) {
            alert('Пожалуйста, введите корректную сумму и причину.');
            return;
        }

        if (operationType === 'add') {
            appData.credits += amount;
            alert(`Добавлено ${amount} кредитов. Причина: ${reason}`);
        } else if (operationType === 'spend') {
            if (appData.credits >= amount) {
                appData.credits -= amount;
                alert(`Потрачено ${amount} кредитов. Причина: ${reason}`);
                // Optionally add a trophy for spending credits
                appData.trophies.push({
                    id: generateId(),
                    name: 'Потраченные кредиты',
                    description: `Потрачено ${amount} кредитов на "${reason}"`
                });
            } else {
                alert('Недостаточно кредитов.');
                return; // Don't save if not enough credits
            }
        }
        saveData();
        creditsModal.classList.remove('visible'); // Hide credits modal
    });

    // Trophy Management
    addTrophyBtn.addEventListener('click', () => {
        trophyIdInput.value = '';
        trophyNameInput.value = '';
        trophyDescriptionInput.value = '';
        trophyModal.classList.add('visible'); // Show trophy modal
    });

    saveTrophyBtn.addEventListener('click', () => {
        const id = trophyIdInput.value;
        const name = trophyNameInput.value.trim();
        const description = trophyDescriptionInput.value.trim();

        if (!name || !description) {
            alert('Пожалуйста, введите название и описание трофея.');
            return;
        }

        if (id) {
            // Edit existing trophy
            const trophyIndex = appData.trophies.findIndex(t => t.id === id);
            if (trophyIndex > -1) {
                appData.trophies[trophyIndex].name = name;
                appData.trophies[trophyIndex].description = description;
            }
        } else {
            // Add new trophy
            appData.trophies.push({
                id: generateId(),
                name,
                description
            });
        }
        saveData();
        trophyModal.classList.remove('visible'); // Hide trophy modal
    });

    trophiesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-trophy-btn')) {
            const trophyId = e.target.dataset.id;
            if (confirm('Вы уверены, что хотите удалить этот трофей?')) {
                appData.trophies = appData.trophies.filter(t => t.id !== trophyId);
                saveData();
            }
        }
    });

    // Retrospective
    saveRetrospectiveBtn.addEventListener('click', () => {
        appData.retrospective = retrospectiveNotesTextarea.value.trim();
        saveData();
        alert('Заметки ретроспективы сохранены!');
    });

    // Data Management
    exportDataBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(appData, null, 2); // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agile_app_data.json';
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
                    if (confirm('ВНИМАНИЕ! Это действие заменит ВСЕ ваши текущие данные. Вы уверены?')) {
                        // Basic validation for imported data structure
                        if (importedData.sprints && importedData.credits !== undefined && importedData.trophies && importedData.retrospective !== undefined) {
                            appData = importedData;
                            saveData(); // Save and re-render
                            alert('Данные успешно импортированы!');
                        } else {
                            alert('Ошибка: Некорректный формат файла данных.');
                        }
                    }
                } catch (error) {
                    alert('Ошибка при чтении или парсинге файла JSON: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    });

    clearDataBtn.addEventListener('click', () => {
        if (confirm('ВНИМАНИЕ! Это действие удалит ВСЕ ваши данные (спринты, задачи, кредиты, трофеи, ретроспективу). Вы уверены?')) {
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

    // Close modals - MODIFIED TO USE classList
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('visible'); // Hide modal using class
            }
        });
    });

    // Close modals on outside click - MODIFIED TO USE classList
    window.addEventListener('click', (e) => {
        if (e.target === sprintModal) {
            sprintModal.classList.remove('visible');
        }
        if (e.target === tasksModal) {
            tasksModal.classList.remove('visible');
        }
        if (e.target === taskModal) {
            taskModal.classList.remove('visible');
        }
        if (e.target === creditsModal) {
            creditsModal.classList.remove('visible');
        }
        if (e.target === trophyModal) {
            trophyModal.classList.remove('visible');
        }
    });

    // Initial load
    loadData();
});