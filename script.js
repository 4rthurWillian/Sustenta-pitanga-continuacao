// Variáveis globais para simular dados do usuário e estado de login
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || {};
let loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Usar let para poder reatribuir

// Instâncias de gráficos
let myChartInstance = null; // Agora uma única instância para o o gráfico principal

// API Key do OpenWeatherMap (Substitua pela sua chave real)
// ATENÇÃO: Em uma aplicação real, chaves de API nunca devem ser expostas no frontend.
// Elas devem ser gerenciadas por um servidor backend.
const WEATHER_API_KEY = "30a970d545783664fb3999d1595d117f"; // <<<<<<<<<<<<<<<< SUBSTITUA POR SUA CHAVE REAL AQUI
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Coordenadas padrão para Pitanga, PR (caso a localização seja negada ou indisponível)
const DEFAULT_LATITUDE = -25.2929;
const DEFAULT_LONGITUDE = -51.0425;

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
        checkLocationPermission(); // Chama a verificação de permissão após o login
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
        // Garante que os elementos existam antes de tentar acessar textContent
        const desperdicioText = document.querySelector('#dashboard .card:nth-child(2) .text-4xl') ? document.querySelector('#dashboard .card:nth-child(2) .text-4xl').textContent : 'N/A';
        const adubosText = document.querySelector('#dashboard .card:nth-child(3) .text-4xl') ? document.querySelector('#dashboard .card:nth-child(3) .text-4xl').textContent : 'N/A';
        const climaText = weatherInfo ? weatherInfo.textContent.trim() : 'N/A';

        doc.text(`Desperdício por Hectare: ${desperdicioText}`, 10, y);
        y += 7;
        doc.text(`Adubos Utilizados: ${adubosText}`, 10, y);
        y += 7;
        doc.text(`Clima Atual: ${climaText}`, 10, y);
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
                    }
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
                        ...chartOptions.scales, // Mantém as configurações de escala x/y
                        y: {
                            ...chartOptions.scales.y,
                            max: undefined // A remoção do max de 100 é importante para gráficos de linha que não são baseados em percentual
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
                        r: { // Para gráficos de radar, a escala é 'r'
                            angleLines: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                            },
                            grid: {
                                color: document.body.classList.contains('dark-mode') ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                            },
                            pointLabels: {
                                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333'
                            },
                            ticks: {
                                backdropColor: document.body.classList.contains('dark-mode') ? '#2d3748' : '#fff', // Cor de fundo dos rótulos dos ticks
                                color: document.body.classList.contains('dark-mode') ? '#e2e8f0' : '#333',
                                showLabelBackdrop: true // Mostra o fundo para os rótulos dos ticks
                            },
                            beginAtZero: true,
                            max: 100
                        },
                        x: { display: false }, // Radar não usa escalas x/y tradicionais
                        y: { display: false }
                    }
                }
            };
            break;
        default:
            console.warn('Tipo de gráfico desconhecido:', chartType);
            return;
    }

    // Cria a nova instância do Chart
    myChartInstance = new Chart(ctx, chartConfig);
}

---

### **Funções Otimizadas de Clima e Localização**

Esta é a seção que foi mais modificada para garantir a robustez e a coerência.

```javascript
// Função para exibir os dados do clima
function displayWeather(data) {
    if (weatherInfo) {
        const temp = data.main.temp.toFixed(0);
        const description = data.weather[0].description;
        const city = data.name;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherInfo.innerHTML = `
            <div class="flex items-center justify-center space-x-4">
                <img src="${iconUrl}" alt="${description}" class="w-16 h-16">
                <div>
                    <p class="text-4xl font-bold text-blue-700">${temp}°C</p>
                    <p class="text-lg text-gray-600 capitalize">${description}</p>
                    <p class="text-md text-gray-500">${city}</p>
                </div>
            </div>
        `;
    }
}

// Função para buscar dados climáticos
async function fetchWeather(latitude, longitude) {
    // Verificar se a chave da API é válida
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "30a970d545783664fb3999d1595d117f") {
        if (weatherInfo) {
            weatherInfo.innerHTML = '<span class="text-red-500"><i class="fas fa-exclamation-triangle"></i> Erro: Chave da API do Clima ausente ou inválida.</span>';
        }
        console.error("Chave da API do OpenWeatherMap não configurada ou é a chave padrão. Por favor, substitua pela sua chave real.");
        return;
    }

    try {
        // Exibir mensagem de carregamento enquanto busca os dados
        weatherInfo.innerHTML = '<p class="text-lg text-gray-500 flex items-center"><i class="fas fa-spinner fa-spin mr-2"></i>Carregando clima...</p>';
        const response = await fetch(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`);
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Erro de autenticação com a API do Clima. Verifique sua chave de API.");
            }
            throw new Error(`Erro ao buscar dados do clima: ${response.statusText}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
        if (weatherInfo) {
            weatherInfo.innerHTML = `<span class="text-red-500"><i class="fas fa-exclamation-triangle"></i> Não foi possível carregar o clima: ${error.message}</span>`;
        }
    }
}

// Função para tentar obter a localização do usuário ou usar padrão
function getUserLocationAndFetchWeather() {
    // Verifica se o navegador suporta geolocalização
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Permissão concedida
                localStorage.setItem('locationPermission', 'granted');
                // Esconde o pop-up se ele estiver visível
                if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
                // Remove a flag 'doNotAskAgainLocation' caso o usuário tenha permitido após negar antes
                localStorage.removeItem('doNotAskAgainLocation');
                fetchWeather(position.coords.latitude, position.coords.longitude);
                // TODO: Chamar função para inicializar o mapa aqui, ex: initFarmMap(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Permissão negada ou erro
                console.error("Erro ao obter localização:", error);
                localStorage.setItem('locationPermission', 'denied'); // Registra a negação

                let errorMessage = 'Localização negada. O clima pode não ser preciso.';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Permissão de localização negada pelo usuário.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Informações de localização indisponíveis.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'A solicitação para obter a localização expirou.';
                }

                // Se o checkbox "Não perguntar novamente" estiver marcado ao negar
                if (doNotAskAgainCheckbox && doNotAskAgainCheckbox.checked) {
                    localStorage.setItem('doNotAskAgainLocation', 'true');
                    errorMessage += ' Não perguntaremos novamente.';
                } else {
                    localStorage.removeItem('doNotAskAgainLocation'); // Limpa se não marcou "não perguntar"
                }

                // Esconde o pop-up e exibe a mensagem de erro
                if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
                showMessage(locationMessage, errorMessage, 'error');
                // Tenta carregar clima para localização padrão (Pitanga, PR)
                fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Opções para geolocalização
        );
    } else {
        // Navegador não suporta Geolocation
        localStorage.setItem('locationPermission', 'unsupported');
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        showMessage(locationMessage, 'Seu navegador não suporta geolocalização. O clima pode não ser preciso.', 'error');
        // Tenta carregar clima para localização padrão (Pitanga, PR)
        fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    }
}

// Função principal para verificar o estado da permissão de localização
function checkLocationPermission() {
    const permissionStatus = localStorage.getItem('locationPermission');
    const doNotAskAgain = localStorage.getItem('doNotAskAgainLocation');

    // Cenário 1: Usuário negou e marcou "Não perguntar novamente"
    if (permissionStatus === 'denied' && doNotAskAgain === 'true') {
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        showMessage(locationMessage, 'Permissão de localização negada e não será solicitada novamente. O clima pode não ser preciso.', 'info');
        fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        return; // Sai da função
    }

    // Cenário 2: Permissão já foi concedida ou é a primeira vez (status nulo)
    // ou o usuário negou anteriormente mas não marcou "não perguntar novamente"
    // e o pop-up precisa ser exibido novamente.
    if (permissionStatus === 'granted' || permissionStatus === null) {
        // Tenta obter a localização diretamente ou solicita se for a primeira vez
        getUserLocationAndFetchWeather();
    } else if (permissionStatus === 'denied') {
        // Se negado anteriormente SEM "não perguntar novamente", mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('hidden');
    } else if (permissionStatus === 'unsupported') {
        // Cenário 3: Navegador não suporta geolocalização
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        showMessage(locationMessage, 'Seu navegador não suporta geolocalização. O clima pode não ser preciso.', 'info');
        fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    }
}

// Eventos para o popup de permissão de localização
if (allowLocationBtn) {
    allowLocationBtn.addEventListener('click', () => {
        // Ocultar o pop-up e acionar a lógica de geolocalização
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        localStorage.removeItem('doNotAskAgainLocation'); // Garante que a flag de "não perguntar" seja removida se o usuário permitir
        getUserLocationAndFetchWeather();
    });
}

if (denyLocationBtn) {
    denyLocationBtn.addEventListener('click', () => {
        // Esconder o pop-up
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');

        // Definir o status de permissão como negado
        localStorage.setItem('locationPermission', 'denied');

        // Verificar o checkbox "Não perguntar novamente"
        if (doNotAskAgainCheckbox && doNotAskAgainCheckbox.checked) {
            localStorage.setItem('doNotAskAgainLocation', 'true');
            showMessage(locationMessage, 'Localização negada e não será solicitada novamente. O clima pode não ser preciso.', 'info');
        } else {
            localStorage.removeItem('doNotAskAgainLocation'); // Garante que a flag seja removida se o usuário apenas negou
            showMessage(locationMessage, 'Localização negada. O clima pode não ser preciso.', 'info');
        }

        // Carregar clima para a localização padrão
        fetchWeather(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    });
}