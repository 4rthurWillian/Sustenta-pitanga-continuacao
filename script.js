// --- INÍCIO DA FERRAMENTA PARA GARANTIR DESLOGADO NO ACESSO AO LINK ---
// Esta linha limpa o estado de login ao carregar a página.
// Isso garante que, ao acessar diretamente o link, o usuário sempre precise fazer login.
// IMPORTANTE: Para uma aplicação em produção onde você deseja que o login persista,
// você precisaria REMOVER ou COMENTAR esta linha.
localStorage.removeItem('isLoggedIn'); // Removido para persistir o login
localStorage.removeItem('loggedInUserEmail'); // Removido para persistir o login
// --- FIM DA FERRAMENTA DE DESLOGAR AO CARREGAR --

// Variáveis globais para simular dados do usuário e estado de login
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || {};
let loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Usar let para poder reatribuir

// Instâncias de gráficos
let myChartInstance = null; // Agora uma única instância para o gráfico principal

// API Keys do OpenWeatherMap
// ATENÇÃO: Em uma aplicação real, chaves de API nunca devem ser expostas no frontend.
// Elas devem ser gerenciadas por um servidor backend.
const WEATHER_API_KEYS = [
    "c907545cefe53d7cd9e2da14805ffd1c",
    "3741e8d7b0a23993ea689bcce514c279"
];
let currentApiKeyIndex = 0; // Índice da chave de API atual a ser usada
// Alterado para o endpoint de previsão
const WEATHER_FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_CURRENT_API_URL = "https://api.openweathermap.org/data/2.5/weather";


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
const notificationsPageSection = document.getElementById('notifications-page'); // Nova seção de notificações
const pointsRedemptionSection = document.getElementById('points-redemption'); // Nova seção de pontos e resgate
const aboutUsSection = document.getElementById('about-us'); // Nova seção
const leaderboardSection = document.getElementById('leaderboard'); // Nova seção de ranking

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

// Referência para o novo elemento de mensagem do perfil
const profileMessage = document.getElementById('profileMessage');

const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profilePicImg = document.getElementById('profilePicImg');
// Removida a referência a profilePicMessage, agora usamos profileMessage para todas as mensagens do perfil
// const profilePicMessage = document.getElementById('profilePicMessage'); 

// --- Variáveis do DOM para o Popup de Permissão de Localização ---
const locationPermissionPopup = document.getElementById('locationPermissionPopup');
const allowLocationBtn = document.getElementById('allowLocationBtn');
const denyLocationBtn = document.getElementById('denyLocationBtn');
const doNotAskAgainCheckbox = document.getElementById('doNotAskAgain');
const locationMessage = document.getElementById('locationMessage'); // Para mensagens relacionadas à localização

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
const backToDashboardFromNotificationsBtn = document.getElementById('backToDashboardFromNotificationsBtn');
const backToDashboardFromPointsBtn = document.getElementById('backToDashboardFromPointsBtn'); // Novo botão de voltar para pontos
const backToDashboardFromLeaderboardBtn = document.getElementById('backToDashboardFromLeaderboardBtn'); // Novo botão de voltar para ranking

// Elementos para a nova seção de notificações
const notificationDropdownList = document.getElementById('notificationDropdownList');
const viewAllNotificationsLink = document.getElementById('viewAllNotificationsLink');
const notificationList = document.getElementById('notificationList'); // Contêiner para notificações na página dedicada
const clearNotificationsBtn = document.getElementById('clearNotificationsBtn'); // Botão de limpar notificações

// Elementos para a nova seção de pontos e resgate
const currentPointsDisplay = document.getElementById('currentPoints');
const dailyLoginPointsDisplay = document.getElementById('dailyLoginPointsDisplay'); // Novo elemento
const redeemDailyPointsBtn = document.getElementById('redeemDailyPointsBtn'); // Novo botão
const redeemDailyPointsBtnText = document.getElementById('redeemDailyPointsBtnText');
const redeemDailyPointsBtnSpinner = document.getElementById('redeemDailyPointsBtnSpinner');
const redeemMessage = document.getElementById('redeemMessage'); // Mensagem para resgate diário
const shareWebsiteBtn = document.getElementById('shareWebsiteBtn'); // Novo botão
const shareWebsiteBtnText = document.getElementById('shareWebsiteBtnText');
const shareWebsiteBtnSpinner = document.getElementById('shareWebsiteBtnSpinner');
const shareMessage = document.getElementById('shareMessage'); // Mensagem para compartilhamento

// Novos botões de compartilhamento
const shareInstagramBtn = document.getElementById('shareInstagramBtn');
const shareFacebookBtn = document.getElementById('shareFacebookBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');

const climateAlertElement = document.getElementById('climateAlert'); // Adicionado para o alerta climático dinâmico

// Elementos para os botões de visualização do mapa e mensagem
const satelliteViewBtn = document.getElementById('satelliteViewBtn');
const terrainViewBtn = document.getElementById('terrainViewBtn');
const measureAreaBtn = document.getElementById('measureAreaBtn');
const addMarkerBtn = document.getElementById('addMarkerBtn');
const mapMessage = document.getElementById('mapMessage');

// Variável para armazenar a seção atual
let currentSectionId = '';

// Array para armazenar as notificações
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// Botão Voltar ao Topo
const backToTopBtn = document.getElementById('backToTopBtn');

// Adicionado: Elementos para o login
const passwordInput = document.getElementById('password');
const togglePasswordVisibilityBtn = document.getElementById('togglePasswordVisibility');
const togglePasswordIcon = document.getElementById('togglePasswordIcon'); // Novo ID para o ícone
const rememberMeCheckbox = document.getElementById('rememberMe');
const rememberMeLabel = document.querySelector('label[for="rememberMe"]'); // Novo para o label
const emailInput = document.getElementById('email');

// Elemento para o corpo da tabela do ranking
const leaderboardBody = document.getElementById('leaderboardBody');

// Dicas de Sustentabilidade
const sustainabilityTips = [
    "Considere a rotação de culturas para melhorar a saúde do solo e reduzir pragas.",
    "Utilize sistemas de irrigação por gotejamento para otimizar o uso da água e economizar.",
    "Monitore a saúde das plantas regularmente para identificar problemas precocemente e evitar perdas.",
    "Invista em compostagem para criar adubo orgânico rico em nutrientes para suas plantas.",
    "Plante árvores e arbustos nativos para atrair polinizadores e aumentar a biodiversidade.",
    "Reduza o uso de pesticidas químicos, optando por métodos de controle biológico.",
    "Aproveite a água da chuva para irrigação, instalando cisternas ou sistemas de captação.",
    "Implemente a agricultura de conservação para proteger o solo da erosão e melhorar sua estrutura.",
    "Diversifique suas culturas para aumentar a resiliência do ecossistema da sua fazenda.",
    "Eduque-se continuamente sobre novas técnicas e tecnologias agrícolas sustentáveis."
];
const sustainabilityTipsList = document.getElementById('sustainabilityTipsList');
const sustainabilityTipsTimer = document.getElementById('sustainabilityTipsTimer');
let currentTipIndex = 0;
let tipsInterval;
let timerSeconds = 30;


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
    element.className = `message-box ${element.classList.contains('message-box-inline') ? 'message-box-inline' : ''} ${type} visible`; // Adiciona 'visible' para animação
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.remove('visible'); // Inicia a transição para esconder
        setTimeout(() => {
            element.classList.add('hidden'); // Esconde após a transição
        }, 5000);
    }, 5000);
}

// Funções para mostrar/esconder loading spinner em botões
function showLoading(buttonElement, textSpan, spinnerSpan) {
    buttonElement.disabled = true;
    if (textSpan) textSpan.classList.add('hidden');
    if (spinnerSpan) spinnerSpan.classList.remove('hidden');
    // Armazena a largura original do botão antes de desabilitá-lo
    buttonElement.dataset.originalWidth = buttonElement.offsetWidth + 'px';
    buttonElement.style.width = buttonElement.dataset.originalWidth;
}

function hideLoading(buttonElement, textSpan, spinnerSpan) {
    buttonElement.disabled = false;
    if (textSpan) textSpan.classList.remove('hidden');
    if (spinnerSpan) spinnerSpan.classList.add('hidden');
    // Remove a largura fixa para que o botão possa se ajustar novamente
    buttonElement.style.width = ''; 
    delete buttonElement.dataset.originalWidth;
}

// Função para alternar seções e gerenciar o histórico do navegador
function showSection(sectionId, pushState = true) {
    const sections = [landingPageSection, loginSection, registerSection, dashboardSection, reportsSection, profileSection, notificationsPageSection, pointsRedemptionSection, aboutUsSection, leaderboardSection];
    sections.forEach(section => {
        if (section && section.id === sectionId) {
            section.classList.remove('hidden');
        } else if (section) {
            section.classList.add('hidden');
        }
    });

    // Adiciona ou remove a classe 'login-background' do body
    if (sectionId === 'login' || sectionId === 'register') {
        document.body.classList.add('login-background');
    } else {
        document.body.classList.remove('login-background');
    }

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

    // Ações específicas ao mostrar certas seções
    if (sectionId === 'notifications-page') {
        renderNotifications(); // Renderiza as notificações ao entrar na página
    }
    if (sectionId === 'points-redemption') {
        updatePointsDisplay(); // Atualiza a exibição de pontos
        checkDailyRedemption(); // Verifica o estado do resgate diário
        checkDailyLoginPointsDisplay(); // Verifica a exibição dos pontos de login diário
    }
    if (sectionId === 'leaderboard') {
        renderLeaderboard(); // Renderiza o ranking
    }
    if (sectionId === 'dashboard') {
        startTipsRotation(); // Inicia a rotação das dicas
    } else {
        stopTipsRotation(); // Para a rotação das dicas
    }
}

// Função para verificar o estado de login
function checkLoginState() {
    // Verifica se há um usuário logado no localStorage
    loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    if (loggedInUserEmail && users[loggedInUserEmail]) {
        currentUser = users[loggedInUserEmail];
        // Inicializa pontos se não existirem
        if (currentUser.points === undefined) {
            currentUser.points = 0;
        }
        // Adiciona lastLoginDate se não existir
        if (currentUser.lastLoginDate === undefined) {
            currentUser.lastLoginDate = new Date().toISOString().split('T')[0]; // Define a data de login como hoje
        }
        // Inicializa lastRedemptionDate se não existir
        if (currentUser.lastRedemptionDate === undefined) {
            currentUser.lastRedemptionDate = null;
        }
        // Inicializa lastShareDate se não existir
        if (currentUser.lastShareDate === undefined) {
            currentUser.lastShareDate = null;
        }

        // Verifica o login diário
        const today = new Date().toISOString().split('T')[0];
        if (currentUser.lastLoginDate !== today) {
            currentUser.points += 50; // Adiciona 50 pontos por login diário
            currentUser.lastLoginDate = today; // Atualiza a data do último login
            addNotification('Parabéns! Você ganhou 50 pontos pelo login diário!', 'success', 'Pontos bônus concedidos por acessar a plataforma hoje. Continue logando diariamente para mais recompensas!');
        }

        localStorage.setItem('users', JSON.stringify(users)); // Salva os usuários atualizados

        if (welcomeMessageDisplay) welcomeMessageDisplay.textContent = `Bem-vindo(a), ${currentUser.name || currentUser.email}!`;
        showSection('dashboard', false); // Não adiciona ao histórico na inicialização
        loggedInControls.classList.remove('hidden'); // Mostrar controles após login
        checkLocationPermission(); // Chama a função para verificar e possivelmente mostrar o popup
        loadManualData(); // Carrega os dados manuais ao logar
        renderNotificationsDropdown(); // Carrega as notificações no dropdown
        startTipsRotation(); // Inicia a rotação das dicas ao entrar no dashboard
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
        if (event.state.section === 'leaderboard') {
            renderLeaderboard();
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
        const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

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
            
            // Lógica para "Lembrar-me"
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Inicializa pontos se não existirem
            if (currentUser.points === undefined) {
                currentUser.points = 0;
            }
            // Inicializa lastLoginDate se não existir
            if (currentUser.lastLoginDate === undefined) {
                currentUser.lastLoginDate = new Date().toISOString().split('T')[0];
            }
            // Inicializa lastRedemptionDate se não existir
            if (currentUser.lastRedemptionDate === undefined) {
                currentUser.lastRedemptionDate = null;
            }
            // Inicializa lastShareDate se não existir
            if (currentUser.lastShareDate === undefined) {
                currentUser.lastShareDate = null;
            }

            // Verifica o login diário para o usuário recém-logado
            const today = new Date().toISOString().split('T')[0];
            if (currentUser.lastLoginDate !== today) {
                currentUser.points += 50; // Adiciona 50 pontos por login diário
                currentUser.lastLoginDate = today; // Atualiza a data do último login
                addNotification('Parabéns! Você ganhou 50 pontos pelo login diário!', 'success', 'Pontos bônus concedidos por acessar a plataforma hoje. Continue logando diariamente para mais recompensas!');
            }

            localStorage.setItem('users', JSON.stringify(users)); // Salva os usuários atualizados

            showMessage(document.getElementById('loginMessage'), 'Login bem-sucedido!', 'success');
            if (welcomeMessageDisplay) welcomeMessageDisplay.textContent = `Bem-vindo(a), ${currentUser.name || currentUser.email}!`;
            loggedInControls.classList.remove('hidden'); // Mostrar controles após login
            showSection('dashboard'); // Adiciona ao histórico
            checkLocationPermission(); // Chama a função para verificar e possivelmente mostrar o popup
            loadManualData(); // Carrega os dados manuais ao logar
            renderNotificationsDropdown(); // Carrega as notificações no dropdown
            startTipsRotation(); // Inicia a rotação das dicas
        } else {
            showMessage(document.getElementById('loginMessage'), 'E-mail ou senha inválidos.', 'error');
        }
        hideLoading(loginBtn, loginBtnText, loginBtnSpinner);
    });
}

// Adicionado: Lógica para alternar a visibilidade da senha
if (togglePasswordVisibilityBtn && passwordInput && togglePasswordIcon) {
    togglePasswordVisibilityBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Altera o ícone do olho
        togglePasswordIcon.classList.toggle('fa-eye');
        togglePasswordIcon.classList.toggle('fa-eye-slash');

        // Adiciona e remove a classe de animação
        togglePasswordIcon.classList.add('animate');
        setTimeout(() => {
            togglePasswordIcon.classList.remove('animate');
        }, 300); // Deve corresponder à duração da animação no CSS
    });
}

// Adicionado: Animação para o checkbox "Lembrar-me"
if (rememberMeCheckbox) {
    rememberMeCheckbox.addEventListener('click', () => {
        rememberMeCheckbox.classList.add('animate');
        setTimeout(() => {
            rememberMeCheckbox.classList.remove('animate');
        }, 300); // Deve corresponder à duração da animação no CSS
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

        // Simulação de delay para a "requisição"
        await new Promise(resolve => setTimeout(resolve, 1000));

        users[email] = { 
            name, 
            email, 
            password, 
            cooperative, 
            farmData, 
            profilePic: "https://placehold.co/150x150/a7f3d0/065f46?text=Foto", 
            manualData: {}, 
            points: 0,
            lastLoginDate: null, // Novo campo para a data do último login
            lastRedemptionDate: null, // Novo campo para o último resgate diário
            lastShareDate: null // Novo campo para o último compartilhamento
        }; // Adiciona foto padrão, objeto para dados manuais e pontos
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
if (backToDashboardFromNotificationsBtn) {
    backToDashboardFromNotificationsBtn.addEventListener('click', () => showSection('dashboard'));
}
if (backToDashboardFromPointsBtn) {
    backToDashboardFromPointsBtn.addEventListener('click', () => showSection('dashboard'));
}
if (backToDashboardFromLeaderboardBtn) {
    backToDashboardFromLeaderboardBtn.addEventListener('click', () => showSection('dashboard'));
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
    // Adicionado: Limpa o campo de senha ao deslogar
    if (passwordInput) passwordInput.value = ''; 
    // Adicionado: Desmarca "Lembrar-me" ao deslogar
    if (rememberMeCheckbox) rememberMeCheckbox.checked = false;
    localStorage.removeItem('rememberedEmail'); // Remove o email lembrado
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
            // Permite acesso a landing-page, about-us, notifications-page e points-redemption sem login
            if (currentUser || target === 'landing-page' || target === 'about-us' || target === 'notifications-page' || target === 'points-redemption' || target === 'leaderboard') {
                showSection(target); // Adiciona ao histórico
                if (target === 'profile') {
                    loadProfileData();
                }
                if (target === 'reports') {
                    initChart('pie'); // Inicializa o gráfico de pizza por padrão ao entrar em relatórios
                }
                if (target === 'leaderboard') {
                    renderLeaderboard(); // Renderiza o ranking ao entrar na página
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

// Lógica para o link "Ver todas" no dropdown de notificações
if (viewAllNotificationsLink) {
    viewAllNotificationsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('notifications-page');
        notificationsDropdown.classList.add('hidden'); // Esconde o dropdown ao navegar
    });
}

// Funções para gerenciar notificações
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function addNotification(message, type = 'info', conceptExplanation = '') {
    const newNotification = {
        id: Date.now(), // ID único
        message: message,
        type: type, // 'info', 'success', 'error', 'warning'
        timestamp: new Date().toLocaleString(),
        read: false,
        conceptExplanation: conceptExplanation // Nova propriedade para o tooltip
    };
    notifications.unshift(newNotification); // Adiciona no início para as mais recentes aparecerem primeiro
    saveNotifications();
    renderNotificationsDropdown(); // Atualiza o dropdown
    // Se estiver na página de notificações, atualiza também
    if (currentSectionId === 'notifications-page') {
        renderNotifications();
    }
}

function renderNotificationsDropdown() {
    if (!notificationDropdownList) return;

    notificationDropdownList.innerHTML = '';
    if (notifications.length === 0) {
        notificationDropdownList.innerHTML = '<p class="text-sm text-gray-500 p-4 text-center">Nenhuma notificação.</p>';
        return;
    }

    // Exibe apenas as 3 notificações mais recentes no dropdown
    const recentNotifications = notifications.slice(0, 3);
    recentNotifications.forEach(notification => {
        const notificationItem = document.createElement('a');
        notificationItem.href = "#"; // Pode ser um link para detalhes da notificação
        notificationItem.classList.add('block', 'px-4', 'py-3', 'hover:bg-gray-100', 'border-b', 'border-gray-100', 'notification-item'); // Adiciona classe para estilo de data
        
        // Garante que o texto da notificação se adapte ao dark mode
        if (document.body.classList.contains('dark-mode')) {
            notificationItem.style.backgroundColor = 'var(--card-bg)';
            notificationItem.style.color = 'var(--text-color)';
            notificationItem.style.borderColor = 'var(--border-gray-200-color)';
        } else {
            notificationItem.style.backgroundColor = ''; // Reseta para o padrão
            notificationItem.style.color = '';
            notificationItem.style.borderColor = '';
        }

        notificationItem.title = notification.conceptExplanation; // Adiciona o tooltip
        notificationItem.innerHTML = `
            <p class="text-sm font-medium text-gray-900">${notification.message}</p>
            <p class="text-xs text-gray-500">${notification.timestamp}</p>
        `;
        // Adiciona o event listener para navegar para a página de notificações
        notificationItem.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('notifications-page');
            notificationsDropdown.classList.add('hidden'); // Esconde o dropdown
        });
        notificationDropdownList.appendChild(notificationItem);
    });
}

function renderNotifications() {
    if (!notificationList) return;

    notificationList.innerHTML = ''; // Limpa a lista existente

    if (notifications.length === 0) {
        notificationList.innerHTML = '<p class="text-gray-600 text-center">Nenhuma notificação para exibir.</p>';
        return;
    }

    notifications.forEach(notification => {
        const notificationCard = document.createElement('div');
        notificationCard.classList.add('card', 'p-4', 'mb-4', 'notification-item'); // Adiciona classe para estilo de data
        notificationCard.title = notification.conceptExplanation; // Adiciona o tooltip
        let bgColorClass = '';
        let textColorClass = '';
        let iconClass = '';

        switch (notification.type) {
            case 'success':
                bgColorClass = 'bg-green-50';
                textColorClass = 'text-green-800';
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                bgColorClass = 'bg-red-50';
                textColorClass = 'text-red-800';
                iconClass = 'fas fa-times-circle';
                break;
            case 'warning':
                bgColorClass = 'bg-yellow-50';
                textColorClass = 'text-yellow-800';
                iconClass = 'fas fa-exclamation-triangle';
                break;
            case 'info':
            default:
                bgColorClass = 'bg-blue-50';
                textColorClass = 'text-blue-800';
                iconClass = 'fas fa-info-circle';
                break;
        }

        notificationCard.classList.add(bgColorClass, textColorClass);
        // Garante que o texto dentro do card de notificação se adapte ao tema
        if (document.body.classList.contains('dark-mode')) {
            notificationCard.style.backgroundColor = 'var(--card-bg)';
            notificationCard.style.color = 'var(--text-color)';
        }


        notificationCard.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="${iconClass} mr-2"></i>
                <p class="font-semibold">${notification.message}</p>
            </div>
            <p class="text-xs text-gray-500">${notification.timestamp}</p>
        `;
        notificationList.appendChild(notificationCard);
    });
}

// Função para limpar todas as notificações
function clearNotifications() {
    notifications = []; // Esvazia o array de notificações
    saveNotifications(); // Salva o estado vazio no localStorage
    renderNotificationsDropdown(); // Atualiza o dropdown
    renderNotifications(); // Atualiza a página de notificações
    showMessage(document.getElementById('notifications-page').querySelector('.message-box') || notificationList, 'Todas as notificações foram limpas.', 'success');
}

// Event listener para o botão de limpar notificações
if (clearNotificationsBtn) {
    clearNotificationsBtn.addEventListener('click', clearNotifications);
}

// Simula a chegada de algumas notificações iniciais (apenas para demonstração)
async function simulateInitialNotifications() {
    if (notifications.length === 0) { // Adiciona apenas se não houver notificações
        addNotification('Sistema em desenvolvimento: Novas funcionalidades em breve!', 'info', 'Esta notificação indica que o sistema está em constante melhoria e novas funcionalidades serão lançadas.');
        addNotification('Relatório Mensal: Seu relatório de junho está disponível.', 'info', 'Seu relatório mensal de desempenho agrícola está pronto para visualização.');
        addNotification('Recomendação: Reduza a irrigação de água em 4 litros por hectare.', 'info', 'Uma recomendação para otimizar o uso da água e economizar recursos.');
        addNotification('Sensoriamento detectou melhora na qualidade do solo.', 'success', 'Seus sensores IoT indicaram uma melhoria nos parâmetros de qualidade do solo.');
    }
}

// Função para atualizar a exibição de pontos
function updatePointsDisplay() {
    if (currentPointsDisplay && currentUser) {
        currentPointsDisplay.textContent = currentUser.points;
    }
}

// Função para verificar e exibir a mensagem de pontos de login diário
function checkDailyLoginPointsDisplay() {
    if (dailyLoginPointsDisplay && currentUser) {
        const today = new Date().toISOString().split('T')[0];
        if (currentUser.lastLoginDate === today) {
            dailyLoginPointsDisplay.classList.remove('hidden');
        } else {
            dailyLoginPointsDisplay.classList.add('hidden');
        }
    }
}

// Função para verificar o estado do resgate diário
function checkDailyRedemption() {
    if (redeemDailyPointsBtn && currentUser) {
        const today = new Date().toISOString().split('T')[0];
        if (currentUser.lastRedemptionDate === today) {
            redeemDailyPointsBtn.disabled = true;
            redeemDailyPointsBtn.classList.add('opacity-50', 'cursor-not-allowed');
            redeemDailyPointsBtnText.textContent = 'Pontos Diários Resgatados Hoje!';
        } else {
            redeemDailyPointsBtn.disabled = false;
            redeemDailyPointsBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            redeemDailyPointsBtnText.textContent = 'Resgatar 10 Pontos Diários';
        }
    }
}

// Event listener para o botão de resgate diário
if (redeemDailyPointsBtn) {
    redeemDailyPointsBtn.addEventListener('click', async () => {
        if (!currentUser) {
            showMessage(redeemMessage, 'Você precisa estar logado para resgatar pontos.', 'error');
            return;
        }
        showLoading(redeemDailyPointsBtn, redeemDailyPointsBtnText, redeemDailyPointsBtnSpinner);
        await new Promise(resolve => setTimeout(resolve, 700)); // Simula delay

        const today = new Date().toISOString().split('T')[0];
        if (currentUser.lastRedemptionDate !== today) {
            currentUser.points = (currentUser.points || 0) + 10;
            currentUser.lastRedemptionDate = today;
            users[currentUser.email] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            updatePointsDisplay();
            checkDailyRedemption(); // Atualiza o estado do botão
            addNotification('Você resgatou 10 pontos diários!', 'success', 'Pontos bônus concedidos por resgatar pontos diários. Pode ser feito uma vez por dia.');
            showMessage(redeemMessage, '10 pontos diários resgatados com sucesso!', 'success');
        } else {
            showMessage(redeemMessage, 'Você já resgatou seus pontos diários hoje.', 'info');
        }
        hideLoading(redeemDailyPointsBtn, redeemDailyPointsBtnText, redeemDailyPointsBtnSpinner);
    });
}

// Link para compartilhamento
const SHARE_LINK = "https://4rthurwillian.github.io/Sustenta-pitanga-continuacao/";
const SHARE_TEXT = "Confira esta plataforma incrível para agricultura sustentável!";

// Função para lidar com o compartilhamento e conceder pontos
async function handleShare(platform) {
    if (!currentUser) {
        showMessage(shareMessage, 'Você precisa estar logado para compartilhar o site.', 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (currentUser.lastShareDate === today) {
        showMessage(shareMessage, 'Você já ganhou pontos por compartilhar hoje.', 'info');
        return;
    }

    let sharedSuccessfully = false;
    let shareUrl = '';

    switch (platform) {
        case 'instagram':
            // Instagram sharing is tricky for web. This will open Instagram, but won't pre-fill content.
            // A direct share API for Instagram usually requires server-side integration.
            // This is a fallback to open Instagram.
            shareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(SHARE_LINK)}`;
            window.open(shareUrl, '_blank');
            sharedSuccessfully = true; // Assume success for simplicity in simulation
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_LINK)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
            window.open(shareUrl, '_blank');
            sharedSuccessfully = true;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_LINK)}`;
            window.open(shareUrl, '_blank');
            sharedSuccessfully = true;
            break;
        case 'copy':
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const tempInput = document.createElement('textarea');
                tempInput.value = SHARE_LINK;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showMessage(shareMessage, 'Link copiado para a área de transferência!', 'success');
                sharedSuccessfully = true;
            } catch (err) {
                console.error('Erro ao copiar o link:', err);
                showMessage(shareMessage, 'Não foi possível copiar o link. Por favor, copie manualmente.', 'error');
            }
            break;
    }

    if (sharedSuccessfully) {
        currentUser.points = (currentUser.points || 0) + 30;
        currentUser.lastShareDate = today;
        users[currentUser.email] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        updatePointsDisplay();
        addNotification(`Você ganhou 30 pontos por compartilhar o site via ${platform}!`, 'success', `Pontos bônus concedidos por compartilhar a plataforma com amigos e familiares via ${platform}.`);
        if (platform !== 'copy') { // Avoid double message for copy
            showMessage(shareMessage, `Site compartilhado via ${platform}! Você ganhou 30 pontos!`, 'success');
        }
    }
}

// Event listeners para os novos botões de compartilhamento
if (shareInstagramBtn) {
    shareInstagramBtn.addEventListener('click', () => handleShare('instagram'));
}
if (shareFacebookBtn) {
    shareFacebookBtn.addEventListener('click', () => handleShare('facebook'));
}
if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener('click', () => handleShare('whatsapp'));
}
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => handleShare('copy'));
}
// Event listener para o botão de compartilhar site (o original)
if (shareWebsiteBtn) {
    shareWebsiteBtn.addEventListener('click', () => handleShare('website')); // Can be a generic share
}


// Função para renderizar o ranking de pontuação
function renderLeaderboard() {
    if (!leaderboardBody) return;

    leaderboardBody.innerHTML = ''; // Limpa a lista existente

    const allUsers = Object.values(users);
    // Filtra usuários sem pontos ou com pontos inválidos e depois ordena
    const sortedUsers = allUsers
        .filter(user => typeof user.points === 'number' && !isNaN(user.points))
        .sort((a, b) => b.points - a.points); // Ordena do maior para o menor

    if (sortedUsers.length === 0) {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="3" class="py-3 px-6 text-center text-gray-500 dark:text-gray-400">Nenhum usuário no ranking ainda.</td>
            </tr>
        `;
        return;
    }

    sortedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-200', 'dark:border-gray-700', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        if (index % 2 === 0) {
            row.classList.add('bg-gray-50', 'dark:bg-gray-800');
        } else {
            row.classList.add('bg-white', 'dark:bg-gray-900');
        }

        row.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap">
                <span class="font-bold text-lg">${index + 1}º</span>
            </td>
            <td class="py-3 px-6 text-left">
                <div class="flex items-center">
                    <img src="${user.profilePic || 'https://placehold.co/40x40/a7f3d0/065f46?text=Foto'}" alt="Foto de perfil de ${user.name}" class="w-10 h-10 rounded-full mr-3 object-cover">
                    <span>${user.name || user.email.split('@')[0]}</span>
                </div>
            </td>
            <td class="py-3 px-6 text-left">${user.points}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}


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
            // Exemplo de como adicionar pontos por ação positiva
            currentUser.points = (currentUser.points || 0) + 20; // Ganha 20 pontos por salvar dados manuais
            users[currentUser.email] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        console.log('Dados Manuais Salvos:', { dailyWater, fertilizerUse, soilObservation });
        showMessage(manualSaveMessage, 'Dados salvos com sucesso!', 'success');
        addNotification(`Novos dados manuais registrados: Água ${dailyWater}L, Fertilizante ${fertilizerUse}kg. Você ganhou 20 pontos!`, 'info', 'Registro de dados manuais da sua fazenda. Contribui para o monitoramento e pode gerar pontos de recompensa.');
        updatePointsDisplay(); // Atualiza a exibição de pontos
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
        addNotification(`Nova leitura do sensor de água: ${waterReading} litros/min.`, 'info', 'Dados simulados de um sensor IoT de medição de água. Em um sistema real, esses dados seriam coletados automaticamente.');
        // Exemplo de como adicionar pontos por ação positiva
        if (currentUser) {
            currentUser.points = (currentUser.points || 0) + 10; // Ganha 10 pontos por simular leitura
            users[currentUser.email] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        updatePointsDisplay(); // Atualiza a exibição de pontos
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
        // Verifica se weatherInfo existe antes de tentar acessar textContent
        if (weatherInfo) {
            doc.text(`Clima Atual: ${weatherInfo.textContent.trim()}`, 10, y);
        } else {
            doc.text(`Clima Atual: N/A`, 10, y);
        }
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
        addNotification('Relatório PDF gerado com sucesso!', 'success', 'Um relatório detalhado sobre o desempenho de sustentabilidade da sua fazenda foi gerado em formato PDF.');
        // Exemplo de como adicionar pontos por ação positiva
        if (currentUser) {
            currentUser.points = (currentUser.points || 0) + 50; // Ganha 50 pontos por gerar relatório
            users[currentUser.email] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        updatePointsDisplay(); // Atualiza a exibição de pontos
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

            // Usa o novo elemento profileMessage
            showMessage(profileMessage, 'Dados do perfil atualizados com sucesso!', 'success');
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
                    // Usa o novo elemento profileMessage para mensagens da foto de perfil também
                    showMessage(profileMessage, 'Foto de perfil atualizada!', 'success');
                }
            };
            reader.onerror = () => {
                showMessage(profileMessage, 'Erro ao carregar a imagem.', 'error');
            };
            reader.readAsDataURL(file); // Lê o arquivo como Data URL
        } else {
            showMessage(profileMessage, 'Nenhuma imagem selecionada.', 'info');
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
    // Re-renderizar notificações para atualizar cores
    renderNotificationsDropdown();
    renderNotifications();
    // Re-renderizar ranking para atualizar cores
    renderLeaderboard();
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
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden'); // Usa 'hidden' para esconder visualmente
    } else if (locationPermissionStatus === 'denied' && doNotAsk === 'true') {
        // Se negado e "não perguntar novamente" marcado, não mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible');
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        if (locationMessage) showMessage(locationMessage, 'Permissão de localização negada. O clima e o mapa podem não ser exibidos corretamente.', 'error');
        if (weatherInfo) showMessage(weatherInfo, 'Permissão de localização negada. O clima e o mapa podem não ser exibidos corretamente.', 'error'); // Adicionado
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível sem permissão de localização.</p>';
        fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Tenta carregar com coordenadas padrão
        fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Tenta carregar alerta com coordenadas padrão
    } else {
        // Se não há status ou "não perguntar novamente" não está marcado, mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.add('visible'); // Mostra o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('hidden'); // Remove 'hidden'
    }
}

// Event listeners para os botões do popup (eles devem existir no HTML com esses IDs)
if (allowLocationBtn) {
    allowLocationBtn.addEventListener('click', () => {
        getLocation();
        if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Esconde o popup
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
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
        if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden');
        localStorage.setItem('locationPermission', 'denied'); // Salva o status da permissão
        if (doNotAskAgainCheckbox && doNotAskAgainCheckbox.checked) {
            localStorage.setItem('doNotAskAgain', 'true');
        } else {
            localStorage.removeItem('doNotAskAgain');
        }
        if (locationMessage) showMessage(locationMessage, 'Permissão de localização negada. O clima e o mapa podem não ser exibidos corretamente.', 'error');
        if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Localização negada. Não foi possível obter o clima.</p>';
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível devido a erro de localização.</p>';
        fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Tenta carregar com coordenadas padrão
        fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Tenta carregar alerta com coordenadas padrão
    });
}

// A função getLocation agora pode receber coordenadas opcionais para forçar um local
async function getLocation(lat = null, lon = null) {
    // Se coordenadas forem passadas, usa-as diretamente para buscar clima/mapa
    if (lat !== null && lon !== null) {
        fetchWeatherAndMap(lat, lon);
        fetchNextDayWeatherAlert(lat, lon); // Chama também a função para o alerta do próximo dia
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const currentLat = position.coords.latitude;
                const currentLon = position.coords.longitude;
                fetchWeatherAndMap(currentLat, currentLon);
                fetchNextDayWeatherAlert(currentLat, currentLon); // Chama também a função para o alerta do próximo dia
                if (locationMessage) showMessage(locationMessage, 'Localização obtida com sucesso!', 'success');
            },
            showError
        );
    } else {
        if (locationMessage) showMessage(locationMessage, 'Geolocalização não é suportada por este navegador.', 'error');
        if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Geolocalização não suportada.</p>';
        if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível.</p>';
        // Se a geolocalização não for suportada, usa as coordenadas padrão
        fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE); // Tenta carregar alerta com coordenadas padrão
    }
}

// Nova função para buscar o clima atual e exibir o mapa
async function fetchWeatherAndMap(lat, lon) {
    console.log(`A obter clima atual e mapa para Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);

    let success = false;
    for (let i = 0; i < WEATHER_API_KEYS.length; i++) {
        const apiKey = WEATHER_API_KEYS[i];
        try {
            const apiUrl = `${WEATHER_CURRENT_API_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            console.log(`Tentando API Key (Atual): ${apiKey.substring(0, 5)}...`);
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro HTTP: ${response.status} - ${errorData.message || response.statusText}`);
            }
            const data = await response.json();
            if (data && data.main && weatherInfo) {
                weatherInfo.innerHTML = `
                    <p class="text-lg"><i class="fas fa-cloud-sun mr-2"></i>${data.main.temp}°C, ${data.weather[0].description}</p>
                    <p class="text-sm">Umidade: ${data.main.humidity}%, Vento: ${data.wind.speed} m/s</p>
                    <p class="text-xs">Localização: ${data.name || 'Desconhecida'}, Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</p>
                `;
                success = true;
                break; // Sai do loop se a requisição for bem-sucedida
            } else {
                if (weatherInfo) weatherInfo.innerHTML = '<p class="text-lg">Não foi possível obter os dados climáticos atuais.</p>';
            }
        } catch (error) {
            console.error(`Erro ao buscar dados climáticos atuais com API Key ${apiKey.substring(0, 5)}...:`, error);
            if (i === WEATHER_API_KEYS.length - 1) { // Se for a última chave e falhar
                if (weatherInfo) {
                    weatherInfo.innerHTML = `<p class="text-lg">Erro ao obter o clima atual. Verifique suas chaves de API ou conexão. Detalhes: ${error.message}</p>`;
                }
            }
        }
    }

    if (!success) {
        // Exibir clima simulado se todas as API Keys falharem
        if (weatherInfo) {
            weatherInfo.innerHTML = `
                <p class="text-lg"><i class="fas fa-cloud-sun mr-2"></i>25°C, Ensolarado (Dados Simulados)</p>
                <p class="text-sm">Umidade: 60%, Vento: 10 km/h</p>
                <p class="text-xs">Localização: Pitanga, Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}</p>
                <p class="text-red-500 text-sm mt-1">Atenção: Todas as chaves de API do OpenWeatherMap falharam ou não foram configuradas. Dados climáticos são simulados.</p>
            `;
        }
    }

    // Carregar mapa (simulado com OpenStreetMap)
    if (farmMap) {
        farmMap.innerHTML = `
            <iframe id="mapIframe"
                width="100%"
                height="100%"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.005},${lon + 0.01},${lat + 0.005}&amp;layer=mapnik&amp;marker=${lat},${lon}"
                style="border: 1px solid var(--input-border); border-radius: 0.5rem;">
            </iframe>
        `;
    }
}

// Nova função para buscar a previsão do clima para o próximo dia e gerar alerta
async function fetchNextDayWeatherAlert(lat, lon) {
    console.log(`A obter previsão do clima para Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);

    let success = false;
    for (let i = 0; i < WEATHER_API_KEYS.length; i++) {
        const apiKey = WEATHER_API_KEYS[i];
        try {
            const apiUrl = `${WEATHER_FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            console.log(`Tentando API Key (Previsão): ${apiKey.substring(0, 5)}...`);
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro HTTP: ${response.status} - ${errorData.message || response.statusText}`);
            }
            const data = await response.json();
            
            if (data && data.list && climateAlertElement) {
                const now = new Date();
                const nextDay = new Date(now);
                nextDay.setDate(now.getDate() + 1); // Define para o próximo dia

                let nextDayForecast = null;
                // Encontra a primeira previsão para o próximo dia (geralmente por volta do meio-dia do próximo dia)
                for (const forecast of data.list) {
                    const forecastDate = new Date(forecast.dt * 1000); // Convert timestamp to Date object
                    if (forecastDate.getDate() === nextDay.getDate() && 
                        forecastDate.getMonth() === nextDay.getMonth() &&
                        forecastDate.getFullYear() === nextDay.getFullYear() &&
                        forecastDate.getHours() >= 12 && forecastDate.getHours() < 18) { // Busca por um horário entre 12h e 18h
                        nextDayForecast = forecast;
                        break;
                    }
                }

                if (nextDayForecast) {
                    const temp = nextDayForecast.main.temp;
                    const description = nextDayForecast.weather[0].description;
                    const mainWeather = nextDayForecast.weather[0].main.toLowerCase();

                    if (temp > 30) {
                        climateAlertElement.innerHTML = `<span class="font-semibold text-red-600">Alerta:</span> Temperatura alta (${temp}°C) prevista para amanhã - Considere irrigar!`;
                        addNotification(`Alerta: Temperatura alta (${temp}°C) prevista para amanhã.`, 'warning', 'Previsão de temperatura elevada para o próximo dia. Pode ser necessário aumentar a irrigação.');
                    } else if (mainWeather.includes('rain')) {
                        climateAlertElement.innerHTML = `<span class="font-semibold text-blue-600">Alerta:</span> Chuva (${description}) prevista para amanhã - Não irrigue!`;
                        addNotification(`Alerta: Chuva (${description}) prevista para amanhã.`, 'warning', 'Previsão de chuva para o próximo dia. Evite irrigar para economizar água.');
                    } else {
                        climateAlertElement.innerHTML = `<span class="font-semibold text-green-600">Clima:</span> ${description} (${temp}°C) previsto para amanhã. Condições favoráveis.`;
                        addNotification(`Previsão: ${description} (${temp}°C) para amanhã.`, 'info', 'Previsão de tempo estável e favorável para o próximo dia.');
                    }
                } else {
                    climateAlertElement.innerHTML = `<span class="font-semibold text-gray-500">Alerta:</span> Previsão para amanhã indisponível.`;
                }
                success = true;
                break; // Sai do loop se a requisição for bem-sucedida
            } else {
                if (climateAlertElement) climateAlertElement.innerHTML = `<span class="font-semibold text-gray-500">Alerta:</span> Previsão do tempo indisponível.`;
            }
        } catch (error) {
            console.error(`Erro ao buscar previsão climática com API Key ${apiKey.substring(0, 5)}...:`, error);
            if (i === WEATHER_API_KEYS.length - 1) { // Se for a última chave e falhar
                if (climateAlertElement) climateAlertElement.innerHTML = `<span class="font-semibold text-gray-500">Alerta:</span> Erro ao obter previsão. Verifique suas chaves de API.`;
            }
        }
    }

    if (!success) {
        // Exibir alerta simulado se todas as API Keys falharem
        if (climateAlertElement) {
            climateAlertElement.innerHTML = `
                <span class="font-semibold text-gray-500">Alerta:</span> Previsão para amanhã: 28°C, parcialmente nublado (Dados Simulados).
                <p class="text-red-500 text-sm mt-1">Atenção: Todas as chaves de API do OpenWeatherMap falharam ou não foram configuradas. Alerta climático é simulado.</p>
            `;
        }
    }
}


function showError(error) {
    let errorMessage = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Usuário negou a requisição de Geolocalização.';
            localStorage.setItem('locationPermission', 'denied'); // Salva o status de negado
            // Após a negação, tenta carregar o clima/mapa com as coordenadas padrão
            fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização indisponível.';
            // Tenta carregar o clima/mapa com as coordenadas padrão
            fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            break;
        case error.TIMEOUT:
            errorMessage = 'A requisição para obter a localização expirou.';
            // Tenta carregar o clima/mapa com as coordenadas padrão
            fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = 'Um erro desconhecido ocorreu.';
            // Tenta carregar o clima/mapa com as coordenadas padrão
            fetchWeatherAndMap(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            fetchNextDayWeatherAlert(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
            break;
    }
    if (locationMessage) showMessage(locationMessage, `Erro de Geolocalização: ${errorMessage}`, 'error');
    if (weatherInfo) weatherInfo.innerHTML = `<p class="text-lg">Erro ao obter o clima: ${errorMessage}</p>`;
    if (farmMap) farmMap.innerHTML = '<p class="text-gray-500">Mapa não disponível devido a erro de localização.</p>';
    if (locationPermissionPopup) locationPermissionPopup.classList.remove('visible'); // Esconde o popup em caso de erro
    if (locationPermissionPopup) locationPermissionPopup.classList.add('hidden'); // Garante que esteja escondido
}

// Lógica para os botões de visualização do mapa
if (satelliteViewBtn) {
    satelliteViewBtn.addEventListener('click', () => {
        const mapIframe = document.getElementById('mapIframe');
        if (mapIframe) {
            // OpenStreetMap não tem uma camada de satélite nativa para o embed simples.
            // Simula uma mudança para "satélite" ou apenas informa.
            const currentSrc = mapIframe.src;
            let newSrc = currentSrc;
            // Tenta mudar a camada para algo que pareça diferente, se possível.
            // Para OpenStreetMap, 'hydda-full' ou 'osm-intl' podem dar uma aparência diferente,
            // mas não são satélite. Vamos apenas simular.
            if (currentSrc.includes('layer=mapnik')) {
                // Poderíamos tentar outra camada se soubéssemos de uma URL de tile que simule satélite
                // Ou simplesmente exibir uma mensagem
                showMessage(mapMessage, 'Visualização Satélite simulada. Esta funcionalidade é limitada com o mapa atual.', 'info');
            } else {
                showMessage(mapMessage, 'Visualização Satélite ativada (simulada).', 'info');
            }
        } else {
            showMessage(mapMessage, 'Mapa não encontrado para alterar visualização.', 'error');
        }
    });
}

if (terrainViewBtn) {
    terrainViewBtn.addEventListener('click', () => {
        const mapIframe = document.getElementById('mapIframe');
        if (mapIframe) {
            showMessage(mapMessage, 'Visualização Terreno ativada (simulada).', 'info');
            // Poderíamos reverter para a camada padrão 'mapnik' se tivéssemos alterado para outra
            // Ou apenas informar que a visualização de terreno está ativa
        } else {
            showMessage(mapMessage, 'Mapa não encontrado para alterar visualização.', 'error');
        }
    });
}

if (measureAreaBtn) {
    measureAreaBtn.addEventListener('click', () => {
        showMessage(mapMessage, 'Funcionalidade "Medir Área" em desenvolvimento.', 'info');
    });
}

if (addMarkerBtn) {
    addMarkerBtn.addEventListener('click', () => {
        showMessage(mapMessage, 'Funcionalidade "Adicionar Marcador" em desenvolvimento.', 'info');
    });
}

// Lógica para o botão Voltar ao Topo
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        // Mostra o botão após rolar 200px para baixo
        if (window.scrollY > 200) {
            backToTopBtn.classList.add('show');
            backToTopBtn.classList.remove('hidden'); // Garante que a classe 'hidden' seja removida
        } else {
            backToTopBtn.classList.remove('show');
            // Adiciona 'hidden' após a transição para um desaparecimento suave
            setTimeout(() => {
                backToTopBtn.classList.add('hidden');
            }, 300); // Corresponde à duração da transição CSS
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rolagem suave
        });
    });
}

// Função para exibir as dicas de sustentabilidade
function displayTips() {
    if (!sustainabilityTipsList) return;

    sustainabilityTipsList.innerHTML = '';
    const tipsToShow = [];
    for (let i = 0; i < 3; i++) {
        tipsToShow.push(sustainabilityTips[(currentTipIndex + i) % sustainabilityTips.length]);
    }

    tipsToShow.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        sustainabilityTipsList.appendChild(li);
    });

    currentTipIndex = (currentTipIndex + 1) % sustainabilityTips.length;
}

// Função para atualizar o timer das dicas
function updateTipsTimer() {
    if (sustainabilityTipsTimer) {
        sustainabilityTipsTimer.textContent = `Próxima dica em ${timerSeconds} segundos...`;
        timerSeconds--;
        if (timerSeconds < 0) {
            timerSeconds = 30;
        }
    }
}

// Iniciar a rotação das dicas
function startTipsRotation() {
    if (tipsInterval) clearInterval(tipsInterval); // Limpa qualquer intervalo anterior
    currentTipIndex = 0; // Reinicia o índice
    timerSeconds = 30; // Reinicia o timer
    displayTips();
    updateTipsTimer(); // Exibe o timer inicial
    tipsInterval = setInterval(() => {
        displayTips();
        timerSeconds = 30; // Reinicia o timer para a próxima rodada
        updateTipsTimer();
    }, 30000); // Troca a cada 30 segundos

    // Atualiza o timer a cada segundo
    setInterval(updateTipsTimer, 1000);
}

// Parar a rotação das dicas
function stopTipsRotation() {
    if (tipsInterval) {
        clearInterval(tipsInterval);
        tipsInterval = null;
    }
    if (sustainabilityTipsTimer) {
        sustainabilityTipsTimer.textContent = ''; // Limpa o timer
    }
}


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    simulateInitialNotifications(); // Adiciona notificações iniciais para demonstração
    // Adiciona o estado inicial ao histórico para que o botão de voltar funcione corretamente
    if (location.hash) {
        const initialSection = location.hash.substring(1);
        showSection(initialSection, false); // Não empurra novamente se já está na URL
    } else {
        // Se não houver hash na URL, empurra o estado da landing page
        history.replaceState({ section: 'landing-page' }, '', '#landing-page');
        currentSectionId = 'landing-page';
    }
    // Inicia a rotação das dicas se o dashboard for a seção inicial
    if (currentSectionId === 'dashboard') {
        startTipsRotation();
    }
});
