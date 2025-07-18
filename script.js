
// Variáveis globais para simular dados do usuário e estado de login
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || {};
let loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Usar let para poder reatribuir

// Instâncias de gráficos
let myChartInstance = null; // Agora uma única instância para o gráfico principal

// API Key do OpenWeatherMap (Substitua pela sua chave real)
// ATENÇÃO: Em uma aplicação real, chaves de API nunca devem ser expostas no frontend.
// Elas devem ser gerenciadas por um servidor backend.
const WEATHER_API_KEY = "30a970d545783664fb3999d1595d117f"; // Substitua por sua chave real
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Obter elementos do DOM
const landingPageSection = document.getElementById('landing-page'); // Renomeado
const loginSection = document.getElementById('login');
const registerSection = document.getElementById('register');
const dashboardSection = document.getElementById('dashboard');
const reportsSection = document.getElementById('reports');
const profileSection = document.getElementById('profile');
const aboutUsSection = document.getElementById('about-us'); // Nova seção

const loggedInControls = document.getElementById('logged-in-controls');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('#mobileMenu .nav-link'); // Seleciona apenas links dentro do menu mobile
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsDropdown = document.getElementById('notificationsDropdown');
const menuToggle = document.getElementById('menuToggle');
const closeMenuBtn = document.getElementById('closeMenu'); // Botão para fechar o menu mobile

const goToLoginBtn = document.getElementById('goToLoginBtn');
const goToAboutUsBtn = document.getElementById('goToAboutUsBtn'); // Novo botão
const backToLandingFromAboutUsBtn = document.getElementById('backToLandingFromAboutUsBtn'); // Novo botão
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn'); // Botão de login
const registerForm = document.getElementById('registerForm');
const registerSubmitBtn = document.getElementById('registerSubmitBtn'); // Botão de cadastro
const registerLink = document.getElementById('registerLink');
const backToLoginLink = document.getElementById('backToLoginLink');
const logoutBtn = document.getElementById('logoutBtn');

const welcomeMessageDisplay = document.getElementById('welcomeMessageDisplay');
const weatherInfo = document.getElementById('weatherInfo');
const farmMap = document.getElementById('farmMap');

const cultivatedAreaInput = document.getElementById('cultivatedArea');
const cropTypeSelect = document.getElementById('cropType');
const calculateImpactBtn = document.getElementById('calculateImpactBtn');
const impactResults = document.getElementById('impactResults');
const affectedHectaresSpan = document.getElementById('affectedHectares');
const waterSavedSpan = document.getElementById('waterSaved');
const wasteReductionSpan = document.getElementById('wasteReduction');
const moneySavedSpan = document.getElementById('moneySaved');
const impactCalcMessage = document.getElementById('impactCalcMessage');

const dailyWaterInput = document.getElementById('dailyWaterInput');
const fertilizerUseInput = document.getElementById('fertilizerUseInput');
const soilObservationInput = document.getElementById('soilObservationInput');
const saveManualDataBtn = document.getElementById('saveManualDataBtn');
const manualSaveMessage = document.getElementById('manualSaveMessage');

const waterMeterInput = document.getElementById('waterMeterInput');
const simulateSensorDataBtn = document.getElementById('simulateSensorDataBtn');
const sensorSaveMessage = document.getElementById('sensorSaveMessage');

const generatePdfReportBtn = document.getElementById('generatePdfReportBtn');
const pdfMessage = document.getElementById('pdfMessage'); // Novo elemento de mensagem para PDF

const profileNameInput = document.getElementById('profileNameInput');
const profileEmailInput = document.getElementById('profileEmailInput');
const profileCooperativeInput = document.getElementById('profileCooperativeInput');
const profileFarmDataInput = document.getElementById('profileFarmDataInput');
const headerDarkModeToggle = document.getElementById('headerDarkModeToggle');
const saveProfileBtn = document.getElementById('saveProfileBtn');

const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profilePicImg = document.getElementById('profilePicImg');
const profilePicMessage = document.getElementById('profilePicMessage');

const locationPermissionPopup = document.getElementById('locationPermissionPopup');
const allowLocationBtn = document.getElementById('allowLocationBtn');
const denyLocationBtn = document.getElementById('denyLocationBtn');
const doNotAskAgainCheckbox = document.getElementById('doNotAskAgain'); // Novo checkbox
const locationMessage = document.getElementById('locationMessage');

// Referências para os spans de texto e spinner dos botões
const loginBtnText = document.getElementById('loginBtnText');
const loginBtnSpinner = document.getElementById('loginBtnSpinner');
const registerSubmitBtnText = document.getElementById('registerSubmitBtnText');
const registerSubmitBtnSpinner = document.getElementById('registerSubmitBtnSpinner');
const calculateImpactBtnText = document.getElementById('calculateImpactBtnText');
const calculateImpactBtnSpinner = document.getElementById('calculateImpactBtnSpinner');
const saveManualDataBtnText = document.getElementById('saveManualDataBtnText');
const saveManualDataBtnSpinner = document.getElementById('saveManualDataBtnSpinner');
const simulateSensorDataBtnText = document.getElementById('simulateSensorDataBtnText');
const simulateSensorDataBtnSpinner = document.getElementById('simulateSensorDataBtnSpinner');
const generatePdfReportBtnText = document.getElementById('generatePdfReportBtnText');
const generatePdfReportBtnSpinner = document.getElementById('generatePdfReportBtnSpinner');
const saveProfileBtnText = document.getElementById('saveProfileBtnText');
const saveProfileBtnSpinner = document.getElementById('saveProfileBtnSpinner');

// Novos botões de voltar para o Dashboard
const backToDashboardFromProfileBtn = document.getElementById('backToDashboardFromProfileBtn');
const backToDashboardFromReportsBtn = document.getElementById('backToDashboardFromReportsBtn');

// Variável para armazenar a seção atual
let currentSectionId = '';

// Função para exibir mensagens
function showMessage(element, message, type = 'info') {
    if (!element) return;
    // Adiciona o ícone com base no tipo de mensagem
    let iconHtml = '';
    if (type === 'success') {
        iconHtml = '<i class="message-icon fas fa-check-circle"></i>';
    } else if (type === 'error') {
        iconHtml = '<i class="message-icon fas fa-times-circle"></i>';
    } else { // 'info' ou qualquer outro
        iconHtml = '<i class="message-icon fas fa-info-circle"></i>';
    }
    element.innerHTML = `${iconHtml}<span>${message}</span>`;
    element.className = `message-box ${type} visible`; // Adiciona 'visible' para animação
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.remove('visible'); // Inicia a transição para esconder
        setTimeout(() => {
            element.classList.add('hidden'); // Esconde após a transição
        }, 300); // Tempo da transição
    }, 5000);
}

// Funções para mostrar/esconder loading spinner em botões
function showLoading(buttonElement, textSpan, spinnerSpan) {
    buttonElement.disabled = true;
    if (textSpan) textSpan.classList.add('hidden');
    if (spinnerSpan) spinnerSpan.classList.remove('hidden');
}

function hideLoading(buttonElement, textSpan, spinnerSpan) {
    buttonElement.disabled = false;
    if (textSpan) textSpan.classList.remove('hidden');
    if (spinnerSpan) spinnerSpan.classList.add('hidden');
}

// Função para alternar seções e gerenciar o histórico do navegador
function showSection(sectionId, pushState = true) {
    const sections = [landingPageSection, loginSection, registerSection, dashboardSection, reportsSection, profileSection, aboutUsSection];
    sections.forEach(section => {
        if (section && section.id === sectionId) {
            section.classList.remove('hidden');
        } else if (section) {
            section.classList.add('hidden');
        }
    });

    // Esconder menu mobile ao navegar
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }

    // Atualizar estado ativo dos links de navegação
    navLinks.forEach(link => {
        if (link.dataset.target === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Gerenciar o histórico do navegador
    if (pushState && currentSectionId !== sectionId) {
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
    currentSectionId = sectionId; // Atualiza a seção atual
}

// Função para verificar o estado de login
function checkLoginState() {
    if (loggedInUserEmail && users[loggedInUserEmail]) {
        currentUser = users[loggedInUserEmail];
        if (welcomeMessageDisplay) welcomeMessageDisplay.textContent = `Bem-vindo(a), ${currentUser.name || currentUser.email}!`;
        showSection('dashboard', false); // Não adiciona ao histórico na inicialização
        loggedInControls.classList.remove('hidden'); // Mostrar controles após login
        checkLocationPermission();
        loadManualData(); // Carrega os dados manuais ao logar
    } else {
        showSection('landing-page', false); // Não adiciona ao histórico na inicialização
        loggedInControls.classList.add('hidden'); // Esconder controles antes do login
    }
}

// Lidar com o evento popstate (navegação do navegador - botões voltar/avançar)
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        showSection(event.state.section, false); // Não adiciona novamente ao histórico
        if (event.state.section === 'profile') {
            loadProfileData();
        }
        if (event.state.section === 'reports') {
            initChart('pie');
        }
    } else {
        // Se não houver estado, volta para a landing page ou dashboard, dependendo do login
        checkLoginState();
    }
});

// Função para lidar com o login
if (loginForm && loginBtn) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading(loginBtn, loginBtnText, loginBtnSpinner);
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Validação básica do lado do cliente
        if (!email || !password) {
            showMessage(document.getElementById('loginMessage'), 'Por favor, preencha todos os campos.', 'error');
            hideLoading(loginBtn, loginBtnText, loginBtnSpinner);
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showMessage(document.getElementById('loginMessage'), 'Por favor, insira um e-mail válido.', 'error');
            hideLoading(loginBtn, loginBtnText, loginBtnSpinner);
            return;
        }
        if (password.length < 6) {
            showMessage(document.getElementById('loginMessage'), 'A senha deve ter no mínimo 6 caracteres.', 'error');
            hideLoading(loginBtn, loginBtnText, loginBtnSpinner);
            return;
        }

        // Simulação de delay para a "requisição"
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (users[email] && users[email].password === password) {
            currentUser = users[email];
            localStorage.setItem('loggedInUserEmail', email);
            showMessage(document.getElementById('loginMessage'), 'Login bem-sucedido!', 'success');
            if (welcomeMessageDisplay) welcomeMessageDisplay.textContent = `Bem-vindo(a), ${currentUser.name || currentUser.email}!`;
            loggedInControls.classList.remove('hidden'); // Mostrar controles após login
            showSection('dashboard'); // Adiciona ao histórico
            checkLocationPermission(); // Check location after successful login
            loadManualData(); // Carrega os dados manuais ao logar
        } else {
            showMessage(document.getElementById('loginMessage'), 'E-mail ou senha inválidos.', 'error');
        }
        hideLoading(loginBtn, loginBtnText, loginBtnSpinner);
    });
}

// Função para lidar com o cadastro
if (registerForm && registerSubmitBtn) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
        const name = e.target.registerName.value;
        const email = e.target.registerEmail.value;
        const password = e.target.registerPassword.value;
        const confirmPassword = e.target.confirmPassword.value;
        const cooperative = e.target.registerCooperative.value;
        const farmData = e.target.registerFarmData.value;

        // Validação básica do lado do cliente
        if (!name || !email || !password || !confirmPassword) {
            showMessage(document.getElementById('registerMessage'), 'Por favor, preencha todos os campos obrigatórios.', 'error');
            hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
            return;
        }
        if (password !== confirmPassword) {
            showMessage(document.getElementById('registerMessage'), 'As senhas não coincidem.', 'error');
            hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
            return;
        }
        if (password.length < 6) {
            showMessage(document.getElementById('registerMessage'), 'A senha deve ter no mínimo 6 caracteres.', 'error');
            hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
            return;
        }
        if (users[email]) {
            showMessage(document.getElementById('registerMessage'), 'Este e-mail já está cadastrado.', 'error');
            hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showMessage(document.getElementById('registerMessage'), 'Por favor, insira um e-mail válido.', 'error');
            hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
            return;
        }

        // Simulação de delay para a "requisição"
        await new Promise(resolve => setTimeout(resolve, 1000));

        users[email] = { name, email, password, cooperative, farmData, profilePic: "https://placehold.co/150x150/a7f3d0/065f46?text=Foto", manualData: {} }; // Adiciona foto padrão e objeto para dados manuais
        localStorage.setItem('users', JSON.stringify(users));
        showMessage(document.getElementById('registerMessage'), 'Cadastro realizado com sucesso! Faça login.', 'success');
        e.target.reset(); // Limpa o formulário
        showSection('login'); // Adiciona ao histórico
        hideLoading(registerSubmitBtn, registerSubmitBtnText, registerSubmitBtnSpinner);
    });
}

// Eventos de navegação
if (goToLoginBtn) goToLoginBtn.addEventListener('click', () => showSection('login'));
if (goToAboutUsBtn) goToAboutUsBtn.addEventListener('click', () => showSection('about-us'));

// Lógica do botão "Voltar" na seção "Sobre Nós"
if (backToLandingFromAboutUsBtn) {
    backToLandingFromAboutUsBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection('dashboard');
        } else {
            showSection('landing-page');
        }
    });
}

// Novos botões de "Voltar para o Dashboard"
if (backToDashboardFromProfileBtn) {
    backToDashboardFromProfileBtn.addEventListener('click', () => showSection('dashboard'));
}
if (backToDashboardFromReportsBtn) {
    backToDashboardFromReportsBtn.addEventListener('click', () => showSection('dashboard'));
}

if (registerLink) registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('register');
});
if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('login');
});
if (logoutBtn) logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('loggedInUserEmail');
    loggedInControls.classList.add('hidden'); // Esconder controles ao deslogar
    showSection('landing-page'); // Volta para a tela "Sobre o Projeto" (landing-page) ao deslogar
});

// Navegação do menu mobile (agora principal)
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active'); // Mostra o menu
    });
}
if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active'); // Esconde o menu
    });
}

if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.dataset.target;
            if (currentUser || target === 'landing-page' || target === 'about-us') { // Permite acesso a landing-page e about-us sem login
                showSection(target); // Adiciona ao histórico
                if (target === 'profile') {
                    loadProfileData();
                }
                if (target === 'reports') {
                    initChart('pie'); // Inicializa o gráfico de pizza por padrão ao entrar em relatórios
                }
            } else {
                showMessage(document.getElementById('loginMessage'), 'Por favor, faça login para acessar esta seção.', 'info');
                showSection('login'); // Adiciona ao histórico
            }
        });
    });
}

// Notificações
if (notificationsBtn && notificationsDropdown) {
    notificationsBtn.addEventListener('click', () => {
        notificationsDropdown.classList.toggle('hidden');
        notificationsDropdown.classList.toggle('scale-95');
        notificationsDropdown.classList.toggle('opacity-0');
        notificationsDropdown.classList.toggle('scale-100');
        notificationsDropdown.classList.toggle('opacity-100');
    });
}

// Fechar dropdown de notificação e menu mobile ao clicar fora
document.addEventListener('click', (e) => {
    if (notificationsBtn && notificationsDropdown && !notificationsBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.add('hidden');
        notificationsDropdown.classList.remove('scale-100', 'opacity-100');
        notificationsDropdown.classList.add('scale-95', 'opacity-0');
    }
    if (menuToggle && mobileMenu && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target) && !e.target.closest('#mobileMenu')) {
        mobileMenu.classList.remove('active');
    }
});

// Calculadora de Impacto
if (calculateImpactBtn && impactResults) {
    calculateImpactBtn.addEventListener('click', async () => {
        showLoading(calculateImpactBtn, calculateImpactBtnText, calculateImpactBtnSpinner);
        const area = parseFloat(cultivatedAreaInput.value);
        const crop = cropTypeSelect.value;

        if (isNaN(area) || area <= 0) {
            showMessage(impactCalcMessage, 'Por favor, insira uma área cultivada válida (maior que 0).', 'error');
            affectedHectaresSpan.textContent = '0';
            waterSavedSpan.textContent = '0';
            wasteReductionSpan.textContent = '0';
            moneySavedSpan.textContent = '0';
            hideLoading(calculateImpactBtn, calculateImpactBtnText, calculateImpactBtnSpinner);
            return;
        }

        // Simulação de delay para o cálculo
        await new Promise(resolve => setTimeout(resolve, 700));

        let waterSaved = 0;
        let wasteReduction = 0;
        let moneySaved = 0;

        // Simulação de cálculo de impacto baseada na cultura e área
        switch (crop) {
            case 'feijao':
                waterSaved = area * 500; // litros/ano por hectare
                wasteReduction = 0.05; // 5% de redução
                moneySaved = area * 150; // R$/ano por hectare
                break;
            case 'arroz':
                waterSaved = area * 1200;
                wasteReduction = 0.08;
                moneySaved = area * 250;
                break;
            case 'cana':
                waterSaved = area * 800;
                wasteReduction = 0.03;
                moneySaved = area * 100;
                break;
            case 'outro': // Valor padrão para "Outro"
                waterSaved = area * 400;
                wasteReduction = 0.04;
                moneySaved = area * 120;
                break;
            default:
                waterSaved = area * 300;
                wasteReduction = 0.02;
                moneySaved = area * 80;
                break;
        }

        if (affectedHectaresSpan) affectedHectaresSpan.textContent = area.toFixed(2);
        if (waterSavedSpan) waterSavedSpan.textContent = waterSaved.toFixed(0);
        if (wasteReductionSpan) wasteReductionSpan.textContent = (wasteReduction * 100).toFixed(1);
        if (moneySavedSpan) moneySavedSpan.textContent = moneySaved.toFixed(2);
        
        impactResults.classList.add('impact-results-visible');
        showMessage(impactCalcMessage, 'Impacto calculado com sucesso!', 'success');
        hideLoading(calculateImpactBtn, calculateImpactBtnText, calculateImpactBtnSpinner);
    });
}

// Coleta de Dados Manuais
if (saveManualDataBtn && manualSaveMessage) {
    saveManualDataBtn.addEventListener('click', async () => {
        showLoading(saveManualDataBtn, saveManualDataBtnText, saveManualDataBtnSpinner);
        const dailyWater = dailyWaterInput.value;
        const fertilizerUse = fertilizerUseInput.value;
        const soilObservation = soilObservationInput.value;

        if (!dailyWater || !fertilizerUse || !soilObservation) {
            showMessage(manualSaveMessage, 'Por favor, preencha todos os campos de dados manuais.', 'error');
            hideLoading(saveManualDataBtn, saveManualDataBtnText, saveManualDataBtnSpinner);
            return;
        }

        // Simulação de delay para o salvamento
        await new Promise(resolve => setTimeout(resolve, 700));

        // Salvar dados no currentUser e localStorage
        if (currentUser) {
            currentUser.manualData = {
                dailyWater: dailyWater,
                fertilizerUse: fertilizerUse,
                soilObservation: soilObservation
            };
            users[currentUser.email] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        console.log('Dados Manuais Salvos:', { dailyWater, fertilizerUse, soilObservation });
        showMessage(manualSaveMessage, 'Dados salvos com sucesso!', 'success');
        // Não limpar campos para manter os dados salvos visíveis
        hideLoading(saveManualDataBtn, saveManualDataBtnText, saveManualDataBtnSpinner);
    });
}

// Função para carregar dados manuais ao entrar no dashboard
function loadManualData() {
    if (currentUser && currentUser.manualData) {
        dailyWaterInput.value = currentUser.manualData.dailyWater || '';
        fertilizerUseInput.value = currentUser.manualData.fertilizerUse || '';
        soilObservationInput.value = currentUser.manualData.soilObservation || '';
    } else {
        // Limpa os campos se não houver dados salvos
        dailyWaterInput.value = '';
        fertilizerUseInput.value = '';
        soilObservationInput.value = '';
    }
}

// Simulação de Dados de Sensor
if (simulateSensorDataBtn && sensorSaveMessage) {
    simulateSensorDataBtn.addEventListener('click', async () => {
        showLoading(simulateSensorDataBtn, simulateSensorDataBtnText, simulateSensorDataBtnSpinner);
        const waterReading = parseFloat(waterMeterInput.value);

        if (isNaN(waterReading) || waterReading < 0) {
            showMessage(sensorSaveMessage, 'Por favor, insira uma leitura de medidor de água válida.', 'error');
            hideLoading(simulateSensorDataBtn, simulateSensorDataBtnText, simulateSensorDataBtnSpinner);
            return;
        }

        // Simulação de delay para o salvamento
        await new Promise(resolve => setTimeout(resolve, 700));

        console.log('Leitura do Sensor Salva:', { waterReading });
        showMessage(sensorSaveMessage, 'Leitura do sensor simulada e salva!', 'success');
        waterMeterInput.value = '';
        hideLoading(simulateSensorDataBtn, simulateSensorDataBtnText, simulateSensorDataBtnSpinner);
    });
}

// Geração de Relatório PDF
if (generatePdfReportBtn) {
    generatePdfReportBtn.addEventListener('click', async () => {
        showLoading(generatePdfReportBtn, generatePdfReportBtnText, generatePdfReportBtnSpinner);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Relatório de Sustentabilidade - Sustenta Pitanga", 10, 20);
        doc.setFontSize(12);
        doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 10, 30);
        doc.text(`Usuário: ${currentUser ? currentUser.name : 'Convidado'}`, 10, 40);

        let y = 60;

        // Adicionar dados do dashboard
        doc.setFontSize(16);
        doc.text("Resumo do Dashboard", 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.text(`Desperdício por Hectare: ${document.querySelector('#dashboard .card:nth-child(2) .text-4xl').textContent}`, 10, y);
        y += 7;
        doc.text(`Adubos Utilizados: ${document.querySelector('#dashboard .card:nth-child(3) .text-4xl').textContent}`, 10, y);
        y += 7;
        doc.text(`Clima Atual: ${weatherInfo.textContent.trim()}`, 10, y);
        y += 15;

        // Adicionar gráfico principal como imagem
        const canvas = document.getElementById('myChart');
        if (canvas) {
            const imgData = canvas.toDataURL('image/png');
            doc.text("Desperdício vs. Uso Eficiente", 10, y);
            y += 5;
            doc.addImage(imgData, 'PNG', 10, y, 180, 90); // Ajuste as dimensões conforme necessário
            y += 100;
        }
        
        // Simulação de delay para a geração do PDF
        await new Promise(resolve => setTimeout(resolve, 1500));

        doc.save('relatorio_sustenta_pitanga.pdf');
        showMessage(pdfMessage, 'Relatório PDF gerado com sucesso!', 'success'); // Atualizado
        hideLoading(generatePdfReportBtn, generatePdfReportBtnText, generatePdfReportBtnSpinner);
    });
}

// Função para renderizar gráfico (agora uma única função para o gráfico principal)
function initChart(chartType = 'pie') {
    const ctx = document.getElementById('myChart');

    if (myChartInstance) {
        myChartInstance.destroy();
    }

    let chartConfig = {};
    const data = {
        labels: ['Desperdício Atual (15%)', 'Uso Eficiente (85%)'],
        datasets: [{
            data: [15, 85],
            backgroundColor: [
                '#ef4444', /* Vermelho para desperdício */
                '#22c55e'  /* Verde para eficiente */
            ],
            borderColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#ffffff', /* Borda adapta ao tema */
            borderWidth: 2,
        }]
    };

    const barData = {
        labels: ['Desperdício', 'Uso Eficiente'],
        datasets: [{
            label: 'Percentual',
            data: [15, 85],
            backgroundColor: [
                '#ef4444',
                '#22c55e'
            ],
            borderColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#ffffff',
            borderWidth: 1,
        }]
    };

    const lineData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Desperdício Mensal (%)',
            data: [20, 18, 15, 12, 10, 8],
            borderColor: document.body.classList.contains('dark-mode') ? '#63b3ed' : '#3b82f6', /* Azul adapta ao tema */
            backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(99, 179, 237, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    const radarData = {
        labels: ['Desperdício', 'Adubos', 'Água', 'Solo'],
        datasets: [{
            label: 'Métricas',
            data: [15, 80, 70, 85],
            backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(183, 148, 244, 0.2)' : 'rgba(139, 92, 246, 0.2)', /* Roxo adapta ao tema */
            borderColor: document.body.classList.contains('dark-mode') ? '#b794f4' : '#805ad5',
            borderWidth: 1,
            pointBackgroundColor: document.body.classList.contains('dark-mode') ? '#b794f4' : '#805ad5',
            pointBorderColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#fff',
            pointHoverBackgroundColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#fff',
            pointHoverBorderColor: document.body.classList.contains('dark-mode') ? '#b794f4' : '#805ad5'
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333' // Cor da legenda
                }
            },
            title: {
                display: false,
            }
        },
        scales: {
            x: {
                ticks: {
                    color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333' // Cor dos ticks do eixo X
                },
                grid: {
                    color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' // Cor da grade do eixo X
                }
            },
            y: {
                ticks: {
                    color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333' // Cor dos ticks do eixo Y
                },
                grid: {
                    color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' // Cor da grade do eixo Y
                },
                beginAtZero: true,
                max: 100 // Para gráficos de barra e radar que representam percentuais/pontuações
            }
        }
    };

    switch (chartType) {
        case 'pie':
        case 'doughnut':
            chartConfig = {
                type: chartType,
                data: data,
                options: {
                    ...chartOptions,
                    scales: {} // Pie/Doughnut não usam escalas x/y
                }
            };
            break;
        case 'bar-column':
            chartConfig = {
                type: 'bar',
                data: barData,
                options: {
                    ...chartOptions,
                    indexAxis: 'x',
                    plugins: {
                        ...chartOptions.plugins,
                        legend: { display: false }
                    },
                }
            };
            break;
        case 'bar-horizontal':
            chartConfig = {
                type: 'bar',
                data: barData,
                options: {
                    ...chartOptions,
                    indexAxis: 'y',
                    plugins: {
                        ...chartOptions.plugins,
                        legend: { display: false }
                    },
                }
            };
            break;
        case 'line':
            chartConfig = {
                type: 'line',
                data: lineData,
                options: {
                    ...chartOptions,
                    scales: {
                        ...chartOptions.scales,
                        y: {
                            ...chartOptions.scales.y,
                            max: 25 // Ajuste para o range do desperdício mensal
                        }
                    }
                }
            };
            break;
        case 'radar':
            chartConfig = {
                type: 'radar',
                data: radarData,
                options: {
                    ...chartOptions,
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: {
                                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333'
                            },
                            pointLabels: {
                                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333'
                            },
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }
                        }
                    }
                }
            };
            break;
        default:
            chartConfig = {
                type: 'pie',
                data: data,
                options: {
                    ...chartOptions,
                    scales: {}
                }
            };
            break;
    }

    myChartInstance = new Chart(ctx, chartConfig);
}

// Event listeners para botões de tipo de gráfico
document.querySelectorAll('#chartTypeButtons .chart-type-btn').forEach(button => {
    button.addEventListener('click', function() {
        const chartType = this.dataset.chartType;

        document.querySelectorAll('#chartTypeButtons .chart-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');

        initChart(chartType);
    });
});

// Atualizar seção de perfil
function loadProfileData() {
    if (currentUser) {
        profileNameInput.value = currentUser.name || '';
        profileEmailInput.value = currentUser.email || '';
        profileCooperativeInput.value = currentUser.cooperative || '';
        profileFarmDataInput.value = currentUser.farmData || '';
        profilePicImg.src = currentUser.profilePic || "https://placehold.co/150x150/a7f3d0/065f46?text=Foto";
    }
}

// Função para salvar dados do perfil
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        showLoading(saveProfileBtn, saveProfileBtnText, saveProfileBtnSpinner);
        if (currentUser) {
            currentUser.name = profileNameInput.value;
            currentUser.cooperative = profileCooperativeInput.value;
            currentUser.farmData = profileFarmDataInput.value;
            currentUser.profilePic = profilePicImg.src; // Salva a URL da imagem
            users[currentUser.email] = currentUser; // Atualiza no objeto users
            localStorage.setItem('users', JSON.stringify(users)); // Salva no localStorage

            // Simulação de delay para o salvamento
            await new Promise(resolve => setTimeout(resolve, 700));

            showMessage(profilePicMessage, 'Dados do perfil atualizados com sucesso!', 'success');
        }
        hideLoading(saveProfileBtn, saveProfileBtnText, saveProfileBtnSpinner);
    });
}

// Lógica para alterar a foto de perfil
if (changeProfilePicBtn && profilePicInput && profilePicImg) {
    changeProfilePicBtn.addEventListener('click', () => {
        profilePicInput.click(); // Abre o seletor de arquivos
    });

    profilePicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                profilePicImg.src = reader.result; // Atualiza a imagem exibida
                if (currentUser) {
                    currentUser.profilePic = reader.result; // Salva a imagem no objeto do usuário
                    users[currentUser.email] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users)); // Persiste no localStorage
                    showMessage(profilePicMessage, 'Foto de perfil atualizada!', 'success');
                }
            };
            reader.onerror = () => {
                showMessage(profilePicMessage, 'Erro ao carregar a imagem.', 'error');
            };
            reader.readAsDataURL(file); // Lê o arquivo como Data URL
        } else {
            showMessage(profilePicMessage, 'Nenhuma imagem selecionada.', 'info');
        }
    });
}

// Função para alternar o modo escuro
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Atualiza o localStorage
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.removeItem('darkMode');
    }

    // Atualiza o estado do toggle no header
    if (headerDarkModeToggle) headerDarkModeToggle.innerHTML = `<i class="fas fa-${isDarkMode ? 'sun' : 'moon'}"></i>`;

    // Re-renderizar gráfico principal para atualizar cores
    if (myChartInstance) {
        initChart(myChartInstance.config.type);
    }
}

// Event listeners para o toggle de modo escuro do header
if (headerDarkModeToggle) {
    headerDarkModeToggle.addEventListener('click', toggleDarkMode);
}

// Aplicar modo escuro ao carregar
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    if (headerDarkModeToggle) headerDarkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    if (headerDarkModeToggle) headerDarkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// --- Lógica do Popup de Permissão de Localização ---
function checkLocationPermission() {
    const locationPermissionStatus = localStorage.getItem('locationPermission');
    const doNotAsk = localStorage.getItem('doNotAskAgain');

    if (locationPermissionStatus === 'granted') {
        getLocation();
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Garante que o popup esteja escondido
    } else if (locationPermissionStatus === 'denied' && doNotAsk === 'true') {
        // Se negado e "não perguntar novamente" marcado, não mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible');
        if (weatherInfo) showMessage(weatherInfo, 'Permissão de localização negada. O clima e o mapa podem não ser exibidos corretamente.', 'error');
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível sem permissão de localização.</p>';
    } else {
        // Se não há status ou "não perguntar novamente" não está marcado, mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.add('visible');
    }
}

if (allowLocationBtn) {
    allowLocationBtn.addEventListener('click', () => {
        getLocation();
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Esconde o popup imediatamente
        localStorage.setItem('locationPermission', 'granted'); // Salva o status da permissão
        if (doNotAskAgainCheckbox && doNotAskAgainCheckbox.checked) {
            localStorage.setItem('doNotAskAgain', 'true');
        } else {
            localStorage.removeItem('doNotAskAgain');
        }
    });
}

if (denyLocationBtn) {
    denyLocationBtn.addEventListener('click', () => {
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Esconde o popup
        localStorage.setItem('locationPermission', 'denied'); // Salva o status da permissão
        if (doNotAskAgainCheckbox && doNotAskAgainCheckbox.checked) {
            localStorage.setItem('doNotAskAgain', 'true');
        } else {
            localStorage.removeItem('doNotAskAgain');
        }
        if (locationMessage) showMessage(locationMessage, 'Permissão de localização negada. O clima e o mapa podem não ser exibidos corretamente.', 'error');
        if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Localização negada. Não foi possível obter o clima.</p>';
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível devido a erro de localização.</p>';
    });
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Exibir clima usando OpenWeatherMap API
                if (WEATHER_API_KEY && WEATHER_API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY") {
                    try {
                        const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`);
                        const data = await response.json();
                        if (data && data.main && weatherInfo) {
                            weatherInfo.innerHTML = `
                                <p class="text-lg"><i class="fas fa-cloud-sun mr-2"></i>${data.main.temp}°C, ${data.weather[0].description}</p>
                                <p class="text-sm">Umidade: ${data.main.humidity}%, Vento: ${data.wind.speed} m/s</p>
                                <p class="text-xs">Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</p>
                            `;
                        } else {
                            if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Não foi possível obter os dados climáticos.</p>';
                        }
                    } catch (error) {
                        console.error("Erro ao buscar dados climáticos:", error);
                        if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Erro ao obter o clima.</p>';
                    }
                } else {
                    // Exibir clima simulado se a API Key não estiver configurada
                    if (weatherInfo) {
                        weatherInfo.innerHTML = `
                            <p class="text-lg"><i class="fas fa-cloud-sun mr-2"></i>25°C, Ensolarado</p>
                            <p class="text-sm">Umidade: 60%, Vento: 10 km/h</p>
                            <p class="text-xs">Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</p>
                        `;
                    }
                }
                if (locationMessage) showMessage(locationMessage, 'Localização obtida com sucesso!', 'success');

                // Carregar mapa (simulado com OpenStreetMap)
                if (farmMap) {
                    farmMap.innerHTML = `
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameborder="0" 
                            scrolling="no" 
                            marginheight="0" 
                            marginwidth="0" 
                            src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.005},${lon + 0.01},${lat + 0.005}&amp;layer=mapnik&amp;marker=${lat},${lon}" 
                            style="border: 1px solid var(--input-border); border-radius: 0.5rem;">
                        </iframe>
                        <small class="mt-2 block"><a href="https://www.openstreetmap.org/#map=16/${lat}/${lon}" class="text-blue-500 hover:underline" target="_blank">Ver Mapa Maior</a></small>
                    `;
                }
            }, 
            showError
        );
    } else {
        if (locationMessage) showMessage(locationMessage, 'Geolocalização não é suportada por este navegador.', 'error');
        if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Geolocalização não suportada.</p>';
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível.</p>';
    }
}

function showError(error) {
    let errorMessage = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Usuário negou a requisição de Geolocalização.';
            localStorage.setItem('locationPermission', 'denied'); // Salva o status de negado
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização indisponível.';
            break;
        case error.TIMEOUT:
            errorMessage = 'A requisição para obter a localização expirou.';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = 'Um erro desconhecido ocorreu.';
            break;
    }
    if (locationMessage) showMessage(locationMessage, `Erro de Geolocalização: ${errorMessage}`, 'error');
    if (weatherInfo) weatherInfo.innerHTML = `<p class="text-lg">Erro ao obter o clima: ${errorMessage}</p>`;
    if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível devido a erro de localização.</p>';
    if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Esconde o popup em caso de erro
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    // Adiciona o estado inicial ao histórico para que o botão de voltar funcione corretamente
    if (location.hash) {
        const initialSection = location.hash.substring(1);
        showSection(initialSection, false); // Não empurra novamente se já está na URL
    } else {
        // Se não houver hash na URL, empurra o estado da landing page
        history.replaceState({ section: 'landing-page' }, '', '#landing-page');
        currentSectionId = 'landing-page';
    }
});
