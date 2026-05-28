const $ = (id) => document.getElementById(id);

const els = {
  landingPage: $("landingPage"),
  userPage: $("userPage"),
  forumPage: $("forumPage"),
  forumContent: $("forumContent"),
  forumCabinet: $("forumCabinet"),
  forumBackHomeBtn: $("forumBackHomeBtn"),
  forumCreateHeroBtn: $("forumCreateHeroBtn"),
  forumMyPostsBtn: $("forumMyPostsBtn"),
  productGrid: $("productGrid"),
  fxParticles: $("fxParticles"),
  shopGrid: $("shopGrid"),
  shopNavBtn: $("shopNavBtn"),
  languageToggle: $("languageToggle"),
  productsPrev: $("productsPrev"),
  productsNext: $("productsNext"),
  accountBtn: $("accountBtn"),
  heroAccountBtn: $("heroAccountBtn"),
  supportAccountBtn: $("supportAccountBtn"),
  logoutBtn: $("logoutBtn"),
  logoutConfirmModal: $("logoutConfirmModal"),
  logoutConfirmBackdrop: $("logoutConfirmBackdrop"),
  cancelLogoutBtn: $("cancelLogoutBtn"),
  confirmLogoutBtn: $("confirmLogoutBtn"),
  loginModal: $("loginModal"),
  modalBackdrop: $("modalBackdrop"),
  closeLogin: $("closeLogin"),
  mediaModal: $("mediaModal"),
  mediaBackdrop: $("mediaBackdrop"),
  closeMedia: $("closeMedia"),
  mediaViewerBody: $("mediaViewerBody"),
  mediaViewerCaption: $("mediaViewerCaption"),
  heroMenuPreview: $("heroMenuPreview"),
  loginForm: $("loginForm"),
  registerBtn: $("registerBtn"),
  turnstileSlot: $("turnstileSlot"),
  passwordInput: $("passwordInput"),
  passwordToggle: $("passwordToggle"),
  loginError: $("loginError"),
  backHomeBtn: $("backHomeBtn"),
  profileCover: $("profileCover"),
  profileAvatar: $("profileAvatar"),
  profileKicker: $("profileKicker"),
  profileTitle: $("profileTitle"),
  profileSubtitle: $("profileSubtitle"),
  publicProfile: $("publicProfile"),
  publicUid: $("publicUid"),
  publicLogin: $("publicLogin"),
  publicSub: $("publicSub"),
  ownerCabinet: $("ownerCabinet"),
  profileBalance: $("profileBalance"),
  profilePaid: $("profilePaid"),
  ownerUid: $("ownerUid"),
  ownerTelegram: $("ownerTelegram"),
  ownerLanguage: $("ownerLanguage"),
  ownerReferral: $("ownerReferral"),
  subscriptionList: $("subscriptionList"),
  invoiceList: $("invoiceList"),
  paymentList: $("paymentList"),
  adminPanel: $("adminPanel"),
  adminTabBtn: $("adminTabBtn"),
  profileShopBtn: $("profileShopBtn"),
  refreshBtn: $("refreshBtn"),
  buyQuickBtn: $("buyQuickBtn"),
  toast: $("toast"),
};

let session = null;
let csrfToken = null;
let currentUserIsAdmin = false;
let products = [];
let publicConfig = { turnstileEnabled: false, turnstileSiteKey: "" };
let selectedProductId = null;
let selectedPlanDays = null;
let selectedPaymentSystemId = 0;
let appSettings = { purchaseEnabled: true };
let userHasActiveSubscription = false;
let forumFilter = "approved";
let currentLang = localStorage.getItem("antiloseLanguage") === "en" ? "en" : "ru";
let lenis = null;
let lenisRafId = null;
let lenisRefreshFrame = null;
let lenisRefreshTimer = null;
let scrollEffectsFrame = null;
let pointerEffectsFrame = null;
let revealFrame = null;
let tiltFrame = null;
let activeTiltNode = null;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let particleFrame = null;
let particles = [];
const choiceAnimations = new WeakMap();
const choiceTimers = new WeakMap();
let turnstileWidgetId = null;
const LOGIN_MIN_LENGTH = 3;
const LOGIN_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 72;
const ALNUM_RE = /^[A-Za-z0-9]+$/;
const TILT_SELECTOR = ".media-card, .product-card, .card, .support-card, .checkout-card, .spec-card, .purchase-preview, .forum-post-card, .forum-detail-card, .forum-create-card";
const MAGNETIC_SELECTOR = ".btn, .lang-toggle, .tab, .round-btn, .modal-close";

const PARTICLE_SEEDS = [
  [0.08, 0.18, 5, 0.9],
  [0.18, 0.72, 4, 0.55],
  [0.29, 0.36, 7, 0.35],
  [0.38, 0.84, 3, 0.72],
  [0.49, 0.16, 4, 0.42],
  [0.58, 0.64, 6, 0.68],
  [0.67, 0.28, 3, 0.5],
  [0.74, 0.78, 5, 0.32],
  [0.82, 0.42, 4, 0.84],
  [0.9, 0.14, 6, 0.46],
  [0.93, 0.68, 3, 0.62],
  [0.12, 0.48, 4, 0.28],
];

const I18N = {
  ru: {
    navPlans: "Тарифы",
    navShop: "Магазин",
    navFeatures: "Возможности",
    navSupport: "Поддержка",
    heroTitleLine1: "Чистый доступ",
    heroTitleLine2: "к Antilose.",
    heroLead: "Удобный доступ к продукту, подпискам и устройствам в одном аккуратном кабинете.",
    heroLogin: "Войти в кабинет",
    heroPlans: "Смотреть тарифы",
    newsShort: "TG",
    newsChannel: "Новости проекта",
    subscription: "Подписка",
    forum: "Конфиги",
    forumTitle: "Конфиги",
    forumLead: "Публикуйте свои настройки, смотрите оценки и скачивайте одобренные конфиги от пользователей Antilose.",
    forumCreate: "Опубликовать конфиг",
    forumCreateTitle: "Новый конфиг",
    forumMyPosts: "Мои публикации",
    forumLibrary: "Библиотека",
    forumLatest: "Новые конфиги",
    forumApproved: "Опубликовано",
    forumPending: "На модерации",
    forumRejected: "Отклонено",
    forumPublished: "Опубликовано",
    forumEmpty: "Пока нет опубликованных конфигов.",
    forumCreateHint: "Создание постов доступно пользователям с активной подпиской.",
    forumNeedSub: "Нужна активная подписка",
    forumNeedPending: "Дождитесь решения администратора",
    forumConfigJsonHint: "Загрузите валидный JSON-файл до 10 МБ. Изображения тоже до 10 МБ.",
    forumSignIn: "Войдите, чтобы открыть конфиги",
    forumName: "Название",
    forumDescription: "Описание",
    forumImages: "Изображения 1-3",
    forumConfigFile: "Файл конфига",
    forumSubmit: "Отправить на модерацию",
    forumSubmitted: "Конфиг отправлен на модерацию",
    forumDownloads: "скачиваний",
    forumRating: "рейтинг",
    forumOpen: "Открыть",
    forumDownload: "Скачать конфиг",
    forumModeration: "Модерация конфигов",
    forumApprove: "Опубликовать",
    forumReject: "Отклонить",
    forumNoPending: "Нет конфигов на модерации.",
    forumStarsSaved: "Оценка сохранена",
    active: "активна",
    ready: "готов",
    freeze: "Заморозка",
    available: "доступна",
    payment: "Оплата",
    fast: "быстро",
    interface: "Интерфейс",
    mediaTitle: "Видно всё важное",
    mediaCopy: "Меню, визуальные настройки и игровой предпросмотр собраны в одном стиле.",
    statUsers: "пользователей",
    statSubs: "подписок",
    statProduct: "продукт",
    statAccess: "доступ к кабинету",
    statModules: "модуля",
    statUptime: "аптайм",
    statPlatform: "платформа",
    plans: "Тарифы",
    productsTitle: "Выберите продукт",
    productsCopy: "Покупка, продление и управление подпиской собраны в личном кабинете.",
    features: "Возможности",
    featuresTitle: "Всё нужное рядом",
    featuresCopy: "Кабинет помогает быстро проверить подписку, обновить устройство и купить новый доступ.",
    featureSubsTitle: "Подписки",
    featureSubsCopy: "Сроки, статус и доступы видны сразу после входа.",
    featureHwidCopy: "Сброс устройства доступен в карточке подписки.",
    featureFreezeCopy: "Можно поставить подписку на паузу прямо из кабинета.",
    featurePaymentCopy: "Тарифы открываются в пару кликов, без лишних переходов.",
    support: "Поддержка",
    supportTitle: "Нужна помощь?",
    supportCopy: "Откройте кабинет и проверьте статус подписки. Если что-то не совпадает, напишите в поддержку Antilose.",
    openCabinet: "Открыть кабинет",
    backHome: "← На главную",
    nickname: "Ник",
    balance: "баланс",
    payments: "Платежи",
    buySubscription: "Купить подписку",
    refresh: "Обновить",
    overview: "Обзор",
    subscriptions: "Подписки",
    history: "История",
    language: "Язык",
    referral: "Реферал",
    requests: "Заявки",
    login: "Вход",
    cabinet: "Личный кабинет",
    loginCopy: "Введите логин и пароль аккаунта Antilose.",
    showPassword: "Показать",
    hidePassword: "Скрыть",
    signIn: "Войти",
    createAccount: "Создать аккаунт",
    logout: "Выйти",
    logoutConfirmKicker: "Выход",
    logoutConfirmTitle: "Выйти из аккаунта?",
    logoutConfirmCopy: "Вы сможете войти снова по логину и паролю.",
    logoutConfirmAction: "Выйти",
    cancel: "Отмена",
    myCabinet: "Мой кабинет",
    account: "Личный кабинет",
    availableProduct: "доступен",
    soon: "скоро",
    days: "дней",
    loadingShop: "Магазин загружается...",
    purchase: "Покупка",
    purchaseTitle: "Покупка подписки",
    productShots: "Скриншоты интерфейса продукта",
    checkout: "Оплата подписки",
    total: "К оплате",
    buyNow: "Купить сейчас",
    processors: "Процессоры:",
    gpus: "Графические процессоры:",
    discrete: "Дискретные",
    os: "ОС:",
    launch: "Запуск:",
    launcher: "Из лаунчера",
    emulator: "\u042d\u043c\u0443\u043b\u044f\u0442\u043e\u0440",
    emulatorSupport: "\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e BlueStacks 4 32 bit",
    delivery: "Доставка:",
    digital: "В электронном виде",
    order: "Ваш заказ",
    choosePeriod: "Выберите срок",
    paymentMethod: "Способ оплаты",
    bankCard: "Карта",
    crypto: "Crypto",
    telegramPay: "Telegram",
    instantAccess: "Доступ сразу после оплаты",
    openPreview: "Откройте фото и видео на весь экран",
    compatibility: "Совместимость",
    included: "Что входит",
    includedItems: "Личный кабинет, подписка, сброс HWID и поддержка",
    stepPlan: "Тариф",
    stepPayment: "Оплата",
    stepReady: "Готово",
    resetHwid: "Сброс HWID",
    resetHint: "Разовая смена привязки устройства",
    inSubscriptions: "в подписках",
    profile: "Профиль",
    loading: "Загрузка...",
    userNotFound: "Пользователь не найден",
    checkUid: "Проверьте UID и попробуйте ещё раз.",
    hasSub: "У пользователя есть подписка Antilose.",
    noSub: "У пользователя нет подписки Antilose.",
    yes: "Есть",
    no: "Нет",
    notLinked: "Не привязан",
    none: "Нет",
    myAccount: "Мой аккаунт",
    noSubscriptions: "У вас пока нет подписок.",
    noInvoices: "Платежей пока нет.",
    noPayments: "Заявок пока нет.",
    paid: "Оплачено",
    processing: "В обработке",
    canceled: "Отменено",
    waitingPayment: "Ожидает оплаты",
    openPayment: "Открыть оплату",
    checkPayment: "Проверить",
    cancelPayment: "Отменить",
    paymentCreated: "Счет создан",
    paymentActivated: "Оплата подтверждена",
    paymentStillProcessing: "Оплата еще обрабатывается",
    paymentCanceledDone: "Оплата отменена",
    registeredWelcome: "Аккаунт создан",
    unlinked: "не привязан",
    frozen: "заморожена",
    expired: "истекла",
    validUntil: "до",
    expiredFrozenNote: "Можно разморозить, но сброс HWID недоступен: срок подписки истёк.",
    expiredNote: "Заморозка и сброс HWID недоступны: срок подписки истёк.",
    unfreeze: "Разморозить",
    freezeAction: "Заморозить",
    resetHwidAction: "Сбросить HWID",
    signInToBuy: "Войдите, чтобы оформить подписку",
    signInToShop: "Войдите, чтобы открыть магазин",
    welcome: "Добро пожаловать",
    loggedOut: "Вы вышли из аккаунта",
    frozenDone: "Подписка заморожена",
    unfrozenDone: "Подписка разморожена",
    hwidResetDone: "HWID сброшен",
    actionFailed: "Не удалось выполнить действие",
    viewer: "Просмотр",
    open: "Открыть",
    langNext: "EN",
  },
  en: {
    navPlans: "Plans",
    navShop: "Shop",
    navFeatures: "Features",
    navSupport: "Support",
    heroTitleLine1: "Clean access",
    heroTitleLine2: "to Antilose.",
    heroLead: "Manage your product access, subscriptions, and device binding in one polished account panel.",
    heroLogin: "Open account",
    heroPlans: "View plans",
    newsShort: "TG",
    newsChannel: "Project news",
    subscription: "Subscription",
    forum: "Configs",
    forumTitle: "Configs",
    forumLead: "Publish your settings, browse ratings, and download approved configs from Antilose users.",
    forumCreate: "Publish config",
    forumCreateTitle: "New config",
    forumMyPosts: "My posts",
    forumLibrary: "Library",
    forumLatest: "Latest configs",
    forumApproved: "Published",
    forumPending: "Pending review",
    forumRejected: "Rejected",
    forumPublished: "Published",
    forumEmpty: "No published configs yet.",
    forumCreateHint: "Posting is available to users with an active subscription.",
    forumNeedSub: "Active subscription required",
    forumNeedPending: "Wait for admin review",
    forumConfigJsonHint: "Upload a valid JSON file up to 10 MB. Images are up to 10 MB too.",
    forumSignIn: "Sign in to open configs",
    forumName: "Title",
    forumDescription: "Description",
    forumImages: "Images 1-3",
    forumConfigFile: "Config file",
    forumSubmit: "Send for review",
    forumSubmitted: "Config sent for moderation",
    forumDownloads: "downloads",
    forumRating: "rating",
    forumOpen: "Open",
    forumDownload: "Download config",
    forumModeration: "Config moderation",
    forumApprove: "Approve",
    forumReject: "Reject",
    forumNoPending: "No configs awaiting review.",
    forumStarsSaved: "Rating saved",
    active: "active",
    ready: "ready",
    freeze: "Freeze",
    available: "available",
    payment: "Payment",
    fast: "fast",
    interface: "Interface",
    mediaTitle: "Everything important is visible",
    mediaCopy: "Menu, visual settings, and gameplay preview are gathered into one clean experience.",
    statUsers: "users",
    statSubs: "subscriptions",
    statProduct: "product",
    statAccess: "account access",
    statModules: "modules",
    statUptime: "uptime",
    statPlatform: "platform",
    plans: "Plans",
    productsTitle: "Choose a product",
    productsCopy: "Purchase, renew, and manage your subscription from your personal account.",
    features: "Features",
    featuresTitle: "Everything close at hand",
    featuresCopy: "The account panel helps you check access, update your device, and buy a new subscription quickly.",
    featureSubsTitle: "Subscriptions",
    featureSubsCopy: "Expiration dates, status, and access are visible right after login.",
    featureHwidCopy: "Device reset is available in the subscription card.",
    featureFreezeCopy: "Pause your subscription directly from the account panel.",
    featurePaymentCopy: "Plans open in a few clicks without extra detours.",
    support: "Support",
    supportTitle: "Need help?",
    supportCopy: "Open your account and check the subscription status. If something looks off, contact Antilose support.",
    openCabinet: "Open account",
    backHome: "← Home",
    nickname: "Nickname",
    balance: "balance",
    payments: "Payments",
    buySubscription: "Buy subscription",
    refresh: "Refresh",
    overview: "Overview",
    subscriptions: "Subscriptions",
    history: "History",
    language: "Language",
    referral: "Referral",
    requests: "Requests",
    login: "Login",
    cabinet: "Account",
    loginCopy: "Enter your Antilose login and password.",
    showPassword: "Show",
    hidePassword: "Hide",
    signIn: "Sign in",
    createAccount: "Create account",
    logout: "Log out",
    logoutConfirmKicker: "Logout",
    logoutConfirmTitle: "Log out of your account?",
    logoutConfirmCopy: "You can sign in again with your login and password.",
    logoutConfirmAction: "Log out",
    cancel: "Cancel",
    myCabinet: "My account",
    account: "Account",
    availableProduct: "available",
    soon: "soon",
    days: "days",
    loadingShop: "Loading shop...",
    purchase: "Purchase",
    purchaseTitle: "Buy subscription",
    productShots: "Product interface screenshots",
    checkout: "Subscription payment",
    total: "Total",
    buyNow: "Buy now",
    processors: "Processors:",
    gpus: "Graphics:",
    discrete: "Discrete",
    os: "OS:",
    launch: "Launch:",
    launcher: "From launcher",
    emulator: "Emulator",
    emulatorSupport: "Only BlueStacks 4 32 bit is supported",
    delivery: "Delivery:",
    digital: "Digital delivery",
    order: "Your order",
    choosePeriod: "Choose period",
    paymentMethod: "Payment method",
    bankCard: "Card",
    crypto: "Crypto",
    telegramPay: "Telegram",
    instantAccess: "Access right after payment",
    openPreview: "Open photos and videos fullscreen",
    compatibility: "Compatibility",
    included: "Included",
    includedItems: "Account panel, subscription, HWID reset, and support",
    stepPlan: "Plan",
    stepPayment: "Payment",
    stepReady: "Ready",
    resetHwid: "Reset HWID",
    resetHint: "One-time device binding change",
    inSubscriptions: "in subscriptions",
    profile: "Profile",
    loading: "Loading...",
    userNotFound: "User not found",
    checkUid: "Check the UID and try again.",
    hasSub: "This user has an Antilose subscription.",
    noSub: "This user does not have an Antilose subscription.",
    yes: "Yes",
    no: "No",
    notLinked: "Not linked",
    none: "None",
    myAccount: "My account",
    noSubscriptions: "You do not have subscriptions yet.",
    noInvoices: "No payments yet.",
    noPayments: "No requests yet.",
    paid: "Paid",
    processing: "Processing",
    canceled: "Canceled",
    waitingPayment: "Waiting for payment",
    openPayment: "Open payment",
    checkPayment: "Check",
    cancelPayment: "Cancel",
    paymentCreated: "Invoice created",
    paymentActivated: "Payment confirmed",
    paymentStillProcessing: "Payment is still processing",
    paymentCanceledDone: "Payment canceled",
    registeredWelcome: "Account created",
    unlinked: "not linked",
    frozen: "frozen",
    expired: "expired",
    validUntil: "until",
    expiredFrozenNote: "You can unfreeze it, but HWID reset is unavailable because the subscription has expired.",
    expiredNote: "Freeze and HWID reset are unavailable because the subscription has expired.",
    unfreeze: "Unfreeze",
    freezeAction: "Freeze",
    resetHwidAction: "Reset HWID",
    signInToBuy: "Sign in to buy a subscription",
    signInToShop: "Sign in to open the shop",
    welcome: "Welcome",
    loggedOut: "You have logged out",
    frozenDone: "Subscription frozen",
    unfrozenDone: "Subscription unfrozen",
    hwidResetDone: "HWID reset",
    actionFailed: "Action failed",
    viewer: "Viewer",
    open: "Open",
    langNext: "RU",
  },
};

function t(key) {
  return I18N[currentLang]?.[key] || I18N.ru[key] || key;
}

function productDescription(product) {
  if (!product?.description) return "";
  if (typeof product.description === "string") return product.description;
  return product.description[currentLang] || product.description.ru || product.description.en || "";
}

function forumStatusLabel(status) {
  return {
    pending: t("forumPending"),
    approved: t("forumPublished"),
    rejected: t("forumRejected"),
  }[String(status)] || String(status || "");
}

function forumRatingStars(value) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return Array.from({ length: 5 }, (_, index) => `<span class="forum-star${index < filled ? " filled" : ""}">★</span>`).join("");
}

function forumImageMarkup(image, title) {
  const url = image?.url || "";
  const safeTitle = escapeHtml(title || "Config");
  return `<button class="forum-shot media-open" type="button" data-media-src="${escapeHtml(url)}" data-media-type="image" data-media-title="${safeTitle}">
    <img src="${escapeHtml(url)}" alt="${safeTitle}">
  </button>`;
}

function forumCreateBlockedLabel(state) {
  return {
    pending: t("forumNeedPending"),
    subscription: t("forumNeedSub"),
    guest: t("forumSignIn"),
  }[state] || t("forumNeedSub");
}

function forumCard(post, { admin = false, publicList = false } = {}) {
  const images = Array.isArray(post.images) ? post.images.slice(0, 3) : [];
  const rating = post.rating || {};
  const viewerRating = Number(post.viewerRating || 0);
  const configName = escapeHtml(post.config?.filename || "config");
  const canDownload = Boolean(post.config?.downloadUrl) && (post.status === "approved" || admin);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const star = index + 1;
    return `<button class="forum-star-btn${star <= viewerRating ? " active" : ""}" type="button" data-forum-rate="${escapeHtml(post.id)}" data-stars="${star}"${!post.canRate ? " disabled" : ""}>★</button>`;
  }).join("");
  return `<article class="forum-post-card reveal${post.status !== "approved" ? " forum-locked" : ""}" data-forum-post="${escapeHtml(post.id)}">
    <div class="forum-post-head">
      <div>
        <span class="status-pill">${forumStatusLabel(post.status)}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <div class="forum-meta">
          <span>UID ${escapeHtml(post.author?.uid)}</span>
          <span>${escapeHtml(post.author?.login)}</span>
          <span>${escapeHtml(post.downloads || 0)} ${t("forumDownloads")}</span>
        </div>
      </div>
      <div class="forum-rating-badge">
        <strong>${(rating.average || 0).toFixed(1)}</strong>
        <span>${escapeHtml(rating.count || 0)} ${t("forumRating")}</span>
      </div>
    </div>
    <p class="forum-description">${escapeHtml(post.description)}</p>
    <div class="forum-images${images.length > 1 ? " grid" : ""}">
      ${images.map((image) => forumImageMarkup(image, post.title)).join("")}
    </div>
    <div class="forum-config">
      <div>
        <span class="kicker">CFG</span>
        <strong>${configName}</strong>
        <small>${escapeHtml(fileSizeLabel(post.config?.size || 0))}</small>
      </div>
      <div class="forum-actions">
        <a class="btn ghost" href="/configs/${escapeHtml(post.id)}">${t("forumOpen")}</a>
        ${canDownload ? `<a class="btn primary" href="${escapeHtml(post.config?.downloadUrl || "#")}"${publicList && post.status !== "approved" ? " hidden" : ""}>${t("forumDownload")}</a>` : ""}
      </div>
    </div>
    <div class="forum-rating-row">
      <span>${forumRatingStars(rating.average || 0)}</span>
      <span class="forum-rating-text">${escapeHtml((rating.average || 0).toFixed(2))} / 5 · ${escapeHtml(rating.count || 0)} ${t("forumRating")}</span>
    </div>
    <div class="forum-rating-actions${post.canRate ? "" : " hidden"}">${stars}</div>
  </article>`;
}

function forumModerationCard(post) {
  const images = Array.isArray(post.images) ? post.images.slice(0, 3) : [];
  return `<article class="forum-post-card forum-review-card reveal">
    <div class="forum-post-head">
      <div>
        <span class="status-pill">${forumStatusLabel(post.status)}</span>
        <h3>${escapeHtml(post.title)}</h3>
        <div class="forum-meta">
          <span>UID ${escapeHtml(post.author?.uid)}</span>
          <span>${escapeHtml(post.author?.login)}</span>
        </div>
      </div>
      <div class="forum-rating-badge">
        <strong>${escapeHtml(post.downloads || 0)}</strong>
        <span>${t("forumDownloads")}</span>
      </div>
    </div>
    <p class="forum-description">${escapeHtml(post.description)}</p>
    <div class="forum-images${images.length > 1 ? " grid" : ""}">
      ${images.map((image) => forumImageMarkup(image, post.title)).join("")}
    </div>
    <div class="forum-config">
      <div>
        <span class="kicker">CFG</span>
        <strong>${escapeHtml(post.config?.filename || "config")}</strong>
        <small>${escapeHtml(fileSizeLabel(post.config?.size || 0))}</small>
      </div>
      ${post.config?.downloadUrl ? `<a class="btn ghost" href="${escapeHtml(post.config.downloadUrl)}">${t("forumDownload")}</a>` : ""}
    </div>
    <div class="forum-review-actions">
      <textarea data-forum-note="${escapeHtml(post.id)}" rows="2" maxlength="400" placeholder="${escapeHtml(t("forumCreateHint"))}"></textarea>
      <div class="forum-actions">
        <button class="btn primary" type="button" data-forum-moderate="approve" data-post-id="${escapeHtml(post.id)}">${t("forumApprove")}</button>
        <button class="btn ghost" type="button" data-forum-moderate="reject" data-post-id="${escapeHtml(post.id)}">${t("forumReject")}</button>
      </div>
    </div>
  </article>`;
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll(".media-open").forEach((node) => {
    node.setAttribute("data-open-label", t("open"));
  });
  if (els.languageToggle) {
    els.languageToggle.textContent = t("langNext");
    els.languageToggle.title = currentLang === "ru" ? "Switch to English" : "Переключить на русский";
  }
  setPasswordVisibility(els.passwordInput?.type === "text");
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "ru";
  localStorage.setItem("antiloseLanguage", currentLang);
  applyStaticLanguage();
  renderHeader();
  renderProducts();
  renderRoute();
  refreshSmoothScroll(true);
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function touchDevice() {
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function richMotionAllowed() {
  return !reducedMotion() && !window.matchMedia("(pointer: coarse)").matches && window.innerWidth >= 780;
}

function updateScrollEffects() {
  if (scrollEffectsFrame) return;
  scrollEffectsFrame = requestAnimationFrame(() => {
    scrollEffectsFrame = null;
    const page = document.documentElement;
    const maxScroll = Math.max(1, page.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const heroHeight = Math.max(1, window.innerHeight * 1.08);
    const heroProgress = Math.min(1, Math.max(0, window.scrollY / heroHeight));
    const sectionShift = Math.min(140, window.scrollY * 0.08);
    const showcaseShift = Math.min(42, window.scrollY * 0.028);
    const sectionGlowShift = Math.min(72, window.scrollY * 0.045);
    const showcaseY = showcaseShift * -1;
    const sectionGlowY = sectionGlowShift * -0.22;
    const railShift = Math.min(260, window.scrollY * 0.12);
    const railY = railShift * -1;
    const navDepth = sectionShift * -0.015;
    page.style.setProperty("--scroll-progress", ratio.toFixed(4));
    page.style.setProperty("--page-depth", `${sectionShift.toFixed(1)}px`);
    page.style.setProperty("--showcase-y", `${showcaseY.toFixed(1)}px`);
    page.style.setProperty("--section-glow-y", `${sectionGlowY.toFixed(1)}px`);
    page.style.setProperty("--nav-depth", `${navDepth.toFixed(1)}px`);
    page.style.setProperty("--rail-shift", `${railShift.toFixed(1)}px`);
    page.style.setProperty("--rail-y", `${railY.toFixed(1)}px`);
    page.style.setProperty("--hero-scroll", heroProgress.toFixed(4));
    page.style.setProperty("--hero-card-x", `${(18 * heroProgress).toFixed(1)}px`);
    page.style.setProperty("--hero-card-y", `${(-74 * heroProgress).toFixed(1)}px`);
    page.style.setProperty("--hero-card-y-soft", `${(-22 * heroProgress).toFixed(1)}px`);
    page.style.setProperty("--hero-card-fade", (1 - heroProgress * 0.28).toFixed(3));
    page.style.setProperty("--hero-card-fade-soft", (0.2 - heroProgress * 0.06).toFixed(3));
  });
}

function updatePointerEffects() {
  if (!richMotionAllowed() || pointerEffectsFrame) return;
  pointerEffectsFrame = requestAnimationFrame(() => {
    pointerEffectsFrame = null;
    const page = document.documentElement;
    const logoX = ((pointerX / window.innerWidth) - 0.5) * 18;
    const logoY = ((pointerY / window.innerHeight) - 0.5) * 14;
    const heroTiltX = ((pointerY / window.innerHeight) - 0.5) * -8;
    const heroTiltY = ((pointerX / window.innerWidth) - 0.5) * 10;
    const heroShiftX = ((pointerX / window.innerWidth) - 0.5) * 24;
    const heroShiftY = ((pointerY / window.innerHeight) - 0.5) * 18;
    const depthX = ((pointerX / window.innerWidth) - 0.5) * 44;
    const depthY = ((pointerY / window.innerHeight) - 0.5) * 34;
    const railDepth = depthX * 0.42;
    const logoDepthX = depthX * -0.16;
    const logoDepthY = depthY * -0.12;
    page.style.setProperty("--pointer-x", `${Math.round(pointerX)}px`);
    page.style.setProperty("--pointer-y", `${Math.round(pointerY)}px`);
    page.style.setProperty("--depth-x", `${depthX.toFixed(1)}px`);
    page.style.setProperty("--depth-y", `${depthY.toFixed(1)}px`);
    page.style.setProperty("--rail-depth", `${railDepth.toFixed(1)}px`);
    page.style.setProperty("--logo-depth-x", `${logoDepthX.toFixed(1)}px`);
    page.style.setProperty("--logo-depth-y", `${logoDepthY.toFixed(1)}px`);
    page.style.setProperty("--logo-x", `${logoX.toFixed(1)}px`);
    page.style.setProperty("--logo-y", `${logoY.toFixed(1)}px`);
    page.style.setProperty("--hero-tilt-x", `${heroTiltX.toFixed(2)}deg`);
    page.style.setProperty("--hero-tilt-y", `${heroTiltY.toFixed(2)}deg`);
    page.style.setProperty("--hero-shift-x", `${heroShiftX.toFixed(1)}px`);
    page.style.setProperty("--hero-shift-y", `${heroShiftY.toFixed(1)}px`);
  });
}

function handlePointerEffects(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  updatePointerEffects();
  updateParticles();
}

function resetTilt(node) {
  if (!node) return;
  node.style.removeProperty("--tilt-x");
  node.style.removeProperty("--tilt-y");
  node.style.removeProperty("--tilt-glow-x");
  node.style.removeProperty("--tilt-glow-y");
  node.classList.remove("tilt-active");
}

function updateTiltNode(node, event) {
  if (!richMotionAllowed() || !node) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  activeTiltNode = node;
  if (tiltFrame) return;
  tiltFrame = requestAnimationFrame(() => {
    tiltFrame = null;
    const rect = activeTiltNode.getBoundingClientRect();
    const localX = Math.min(1, Math.max(0, (pointerX - rect.left) / Math.max(1, rect.width)));
    const localY = Math.min(1, Math.max(0, (pointerY - rect.top) / Math.max(1, rect.height)));
    activeTiltNode.style.setProperty("--tilt-y", `${((localX - 0.5) * 8).toFixed(2)}deg`);
    activeTiltNode.style.setProperty("--tilt-x", `${((0.5 - localY) * 7).toFixed(2)}deg`);
    activeTiltNode.style.setProperty("--tilt-glow-x", `${(localX * 100).toFixed(1)}%`);
    activeTiltNode.style.setProperty("--tilt-glow-y", `${(localY * 100).toFixed(1)}%`);
    activeTiltNode.classList.add("tilt-active");
  });
}

function setupInteractiveMotion(root = document) {
  if (!richMotionAllowed()) return;
  root.querySelectorAll(TILT_SELECTOR).forEach((node) => {
    if (node.dataset.motionTiltBound) return;
    node.dataset.motionTiltBound = "1";
    node.addEventListener("pointermove", (event) => updateTiltNode(node, event), { passive: true });
    node.addEventListener("pointerleave", () => resetTilt(node), { passive: true });
  });
  root.querySelectorAll(MAGNETIC_SELECTOR).forEach((node) => {
    if (node.dataset.motionMagneticBound) return;
    node.dataset.motionMagneticBound = "1";
    node.addEventListener("pointermove", (event) => {
      if (!richMotionAllowed()) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      const rect = node.getBoundingClientRect();
      const localX = (pointerX - rect.left) / Math.max(1, rect.width) - 0.5;
      const localY = (pointerY - rect.top) / Math.max(1, rect.height) - 0.5;
      node.style.setProperty("--magnet-x", `${(localX * 8).toFixed(1)}px`);
      node.style.setProperty("--magnet-y", `${(localY * 6).toFixed(1)}px`);
    }, { passive: true });
    node.addEventListener("pointerleave", () => {
      node.style.removeProperty("--magnet-x");
      node.style.removeProperty("--magnet-y");
    }, { passive: true });
  });
}

function setupParticles() {
  if (!els.fxParticles) return;
  if (!richMotionAllowed()) {
    els.fxParticles.innerHTML = "";
    particles = [];
    return;
  }
  if (!particles.length) {
    els.fxParticles.innerHTML = PARTICLE_SEEDS.map((seed, index) => {
      const size = seed[2];
      const alpha = 0.22 + seed[3] * 0.36;
      const tone = index % 3 === 0 ? "cyan" : index % 3 === 1 ? "violet" : "pink";
      return `<span class="${tone}" style="--size:${size}px; --alpha:${alpha.toFixed(2)}"></span>`;
    }).join("");
    particles = Array.from(els.fxParticles.children).map((node, index) => ({
      node,
      x: PARTICLE_SEEDS[index][0],
      y: PARTICLE_SEEDS[index][1],
      size: PARTICLE_SEEDS[index][2],
      depth: PARTICLE_SEEDS[index][3],
    }));
  }
  updateParticles(true);
}

function updateParticles(force = false) {
  if ((!force && particleFrame) || !particles.length || !richMotionAllowed()) return;
  particleFrame = requestAnimationFrame(() => {
    particleFrame = null;
    const centerX = (pointerX / window.innerWidth) - 0.5;
    const centerY = (pointerY / window.innerHeight) - 0.5;
    particles.forEach((particle) => {
      const x = particle.x * window.innerWidth - particle.size / 2 + centerX * particle.depth * 110;
      const y = particle.y * window.innerHeight - particle.size / 2 + centerY * particle.depth * 90;
      particle.node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
  });
}

function setupVisualEffects() {
  updateScrollEffects();
  updatePointerEffects();
  setupParticles();
  setupInteractiveMotion();
  window.addEventListener("scroll", updateScrollEffects, { passive: true });
  window.addEventListener("pointermove", handlePointerEffects, { passive: true });
  window.addEventListener("mousemove", handlePointerEffects, { passive: true });
}

function hasScrollableOverflow(node) {
  if (!(node instanceof HTMLElement)) return false;
  const styles = window.getComputedStyle(node);
  const scrollY = /(auto|scroll|overlay)/.test(styles.overflowY) && node.scrollHeight > node.clientHeight;
  const scrollX = /(auto|scroll|overlay)/.test(styles.overflowX) && node.scrollWidth > node.clientWidth;
  return scrollY || scrollX;
}

function isDocumentScrollNode(node) {
  return (
    node === document.documentElement ||
    node === document.body ||
    node.classList.contains("page") ||
    node.id === "landingPage" ||
    node.id === "userPage"
  );
}

function shouldPreventLenis(node) {
  if (!(node instanceof HTMLElement)) return false;
  if (isDocumentScrollNode(node)) return false;

  const protectedScroller = node.closest(
    "[data-lenis-prevent], .modal, .media-modal, .login-card, .media-viewer, .tabs",
  );
  if (protectedScroller && !isDocumentScrollNode(protectedScroller)) {
    return true;
  }

  return hasScrollableOverflow(node);
}

function headerOffset() {
  return -((document.querySelector(".navbar")?.getBoundingClientRect().height || 72) + 14);
}

function setupSmoothScroll() {
  if (!window.Lenis || touchDevice() || window.innerWidth < 780) return;
  const calmMotion = reducedMotion();
  lenis = new Lenis({
    smoothWheel: true,
    syncTouch: false,
    duration: calmMotion ? 0.45 : 0.8,
    easing: (value) => 1 - Math.pow(1 - value, 3),
    wheelMultiplier: 1,
    orientation: "vertical",
    gestureOrientation: "vertical",
    prevent: shouldPreventLenis,
  });
  document.documentElement.dataset.smoothScroll = "lenis";
  lenis.on("scroll", () => {
    revealVisible();
    updateScrollEffects();
  });

  const raf = (time) => {
    lenis?.raf(time);
    lenisRafId = requestAnimationFrame(raf);
  };
  lenisRafId = requestAnimationFrame(raf);
  refreshSmoothScroll(true);
}

function destroySmoothScroll() {
  if (lenisRafId) cancelAnimationFrame(lenisRafId);
  if (lenisRefreshFrame) cancelAnimationFrame(lenisRefreshFrame);
  if (lenisRefreshTimer) window.clearTimeout(lenisRefreshTimer);
  lenisRafId = null;
  lenisRefreshFrame = null;
  lenisRefreshTimer = null;
  lenis?.destroy();
  lenis = null;
  delete document.documentElement.dataset.smoothScroll;
}

function syncSmoothScrollMode() {
  const shouldRun = Boolean(window.Lenis && !touchDevice() && window.innerWidth >= 780);
  if (shouldRun && !lenis) setupSmoothScroll();
  if (!shouldRun && lenis) destroySmoothScroll();
  if (lenis) refreshSmoothScroll(true);
}

function refreshSmoothScroll(syncPosition = false) {
  if (!lenis) return;
  if (lenisRefreshFrame) cancelAnimationFrame(lenisRefreshFrame);
  lenisRefreshFrame = requestAnimationFrame(() => {
    lenisRefreshFrame = null;
    lenis?.resize();
    if (syncPosition) {
      lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    revealVisible();
    requestAnimationFrame(() => lenis?.resize());
  });
  if (lenisRefreshTimer) window.clearTimeout(lenisRefreshTimer);
  lenisRefreshTimer = window.setTimeout(() => {
    lenisRefreshTimer = null;
    lenis?.resize();
  }, 420);
}

function handleAnchorClick(event) {
  const link = event.target.closest?.('a[href^="#"], a[href^="/#"]');
  if (!link) return;
  const url = new URL(link.getAttribute("href"), window.location.origin);
  if (!url.hash || url.origin !== window.location.origin) return;

  event.preventDefault();
  const targetPath = url.pathname || "/";
  const go = () => {
    const target = document.querySelector(url.hash);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: headerOffset() });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + headerOffset();
      window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
    }
  };

  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, "", `${targetPath}${url.hash}`);
    renderRoute();
    requestAnimationFrame(go);
    return;
  }

  window.history.pushState({}, "", `${targetPath}${url.hash}`);
  go();
}

function scrollToCurrentHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: headerOffset(), immediate: reducedMotion() });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + headerOffset();
  window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
}

async function api(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "same-origin",
  });
  const data = await response.json().catch(() => ({}));
  if (data.csrfToken) csrfToken = data.csrfToken;
  if (response.status === 401) csrfToken = null;
  if (!response.ok) throw new Error(mapApiError(data.detail || ""));
  return data;
}

async function uploadForm(path, fieldName, file) {
  const form = new FormData();
  form.append(fieldName, file);
  const headers = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  const response = await fetch(path, {
    method: "POST",
    headers,
    body: form,
    credentials: "same-origin",
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) csrfToken = null;
  if (!response.ok) throw new Error(mapApiError(data.detail || ""));
  return data;
}

async function apiForm(path, form) {
  const headers = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  const response = await fetch(path, {
    method: "POST",
    headers,
    body: form,
    credentials: "same-origin",
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) csrfToken = null;
  if (!response.ok) throw new Error(mapApiError(data.detail || ""));
  return data;
}

function mapApiError(detail) {
  return {
    CAPTCHA_REQUIRED: currentLang === "en" ? "Complete the captcha first." : "Сначала пройди капчу.",
    CAPTCHA_INVALID: currentLang === "en" ? "Captcha verification failed." : "Капча не прошла проверку.",
    CAPTCHA_UNAVAILABLE: currentLang === "en" ? "Captcha service is temporarily unavailable." : "Сервис капчи временно недоступен.",
  }[detail] || detail || t("actionFailed");
}

function money(value) {
  return new Intl.NumberFormat(currentLang === "en" ? "en-US" : "ru-RU", { maximumFractionDigits: 2 }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[ch]);
}

function statusLabel(status) {
  return {
    activated: t("paid"),
    in_process: t("processing"),
    canceled: t("canceled"),
    expired: t("expired"),
    mock_created: t("waitingPayment"),
  }[String(status)] || status;
}

function providerLabel(provider) {
  const value = String(provider || "").trim();
  if (!value) return "";
  if (value.toLowerCase() === "local_mock") return "Local";
  return value.replace(/_/g, " ");
}

function show(el) {
  el?.classList.remove("hidden");
}

function hide(el) {
  el?.classList.add("hidden");
}

function fileSizeLabel(bytes) {
  const value = Number(bytes || 0);
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${value} B`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function openLogin() {
  renderTurnstile();
  show(els.loginModal);
  els.loginModal.setAttribute("aria-hidden", "false");
  lenis?.stop();
  els.loginForm.querySelector("input")?.focus();
}

function closeLogin() {
  hide(els.loginModal);
  els.loginModal.setAttribute("aria-hidden", "true");
  els.loginError.textContent = "";
  setPasswordVisibility(false);
  lenis?.start();
}

function setPasswordVisibility(visible) {
  if (!els.passwordInput || !els.passwordToggle) return;
  els.passwordInput.type = visible ? "text" : "password";
  els.passwordToggle.textContent = visible ? t("hidePassword") : t("showPassword");
  els.passwordToggle.setAttribute("aria-pressed", String(visible));
}

function openLogoutConfirm() {
  show(els.logoutConfirmModal);
  els.logoutConfirmModal?.setAttribute("aria-hidden", "false");
  lenis?.stop();
  els.confirmLogoutBtn?.focus();
}

function closeLogoutConfirm() {
  if (!els.logoutConfirmModal || els.logoutConfirmModal.classList.contains("hidden")) return;
  hide(els.logoutConfirmModal);
  els.logoutConfirmModal?.setAttribute("aria-hidden", "true");
  lenis?.start();
}

async function performLogout() {
  await api("/api/logout", { method: "POST" });
  session = null;
  csrfToken = null;
  currentUserIsAdmin = false;
  if (els.adminPanel) els.adminPanel.innerHTML = "";
  hide(els.adminTabBtn);
  closeLogoutConfirm();
  renderHeader();
  showToast(t("loggedOut"));
  if (window.location.pathname.startsWith("/user/")) navigate("/");
}

function openMediaViewer(src, type, title) {
  if (!els.mediaModal || !els.mediaViewerBody) return;
  const safeSrc = escapeHtml(src);
  const safeTitle = title || t("viewer");
  els.mediaViewerBody.innerHTML = type === "video"
    ? `<video src="${safeSrc}" autoplay muted loop playsinline></video>`
    : `<img src="${safeSrc}" alt="${escapeHtml(safeTitle)}">`;
  els.mediaViewerCaption.textContent = safeTitle;
  show(els.mediaModal);
  els.mediaModal.setAttribute("aria-hidden", "false");
  lenis?.stop();
  els.mediaModal.requestFullscreen?.().catch(() => {});
}

function closeMediaViewer() {
  if (!els.mediaModal || els.mediaModal.classList.contains("hidden")) return;
  els.mediaViewerBody.innerHTML = "";
  hide(els.mediaModal);
  els.mediaModal.setAttribute("aria-hidden", "true");
  lenis?.start();
  if (document.fullscreenElement === els.mediaModal) {
    document.exitFullscreen?.().catch(() => {});
  }
}

function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

function navigateToPath(path) {
  navigate(path);
}

function openShop() {
  if (session?.user) {
    navigate(`/user/${session.user.uid}?shop=1`);
    return;
  }
  openLogin();
  showToast(t("signInToShop"));
}

function planEntries(product) {
  return Object.entries(product?.plans || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
}

function currentProduct() {
  return products.find((item) => Number(item.productId) === Number(selectedProductId)) || products.find((item) => item.active) || products[0];
}

function telegramStarsAmount(product, days) {
  return Number(product?.telegramStarsPlans?.[String(days)] || 0);
}

function purchaseAmountLabel(product, days, amount) {
  if (selectedPaymentSystemId === 2) {
    const stars = telegramStarsAmount(product, days);
    return `${stars || 1} Stars`;
  }
  return `$${money(amount)}`;
}

function paymentAmountLabel(payment) {
  const stars = Number(payment?.starsAmount || 0);
  if (stars > 0) return `${stars} Stars`;
  return `$${money(payment?.amount)}`;
}

function productCard(product) {
  const plans = planEntries(product);
  const buttons = plans.map(([days, amount]) => `<button class="btn ghost" type="button" data-buy="${product.productId}" data-days="${days}" data-amount="${amount}">${days} ${t("days")} · $${amount}</button>`).join("");
  return `<article class="product-card${product.active ? " featured" : ""}">
    <div>
      <span class="status-pill${product.active ? "" : " off"}">${product.active ? t("availableProduct") : t("soon")}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <div class="game">${escapeHtml(product.game)}</div>
      <p>${escapeHtml(productDescription(product) || "Antilose")}</p>
    </div>
    <div class="plans">${plans.map(([days, amount]) => `<span class="plan">${days} ${t("days")} · $${amount}</span>`).join("")}</div>
    <div class="product-actions">${buttons || `<button class="btn ghost" type="button" disabled>${t("soon")}</button>`}</div>
  </article>`;
}

function bindBuyButtons(root = document) {
  root.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!session?.user) {
        openLogin();
        showToast(t("signInToBuy"));
        return;
      }
      selectedProductId = Number(button.dataset.buy);
      selectedPlanDays = String(button.dataset.days);
      navigate(`/user/${session.user.uid}?shop=1`);
    });
  });
}

function renderProducts() {
  if (els.productGrid) {
    els.productGrid.innerHTML = products.map(productCard).join("");
    bindBuyButtons(els.productGrid);
    setupInteractiveMotion(els.productGrid);
  }
  renderPurchase();
  refreshSmoothScroll(true);
}

function productMedia(product) {
  return `<div class="purchase-media-main media-open" role="button" tabindex="0" data-open-label="${escapeHtml(t("open"))}" data-media-type="video" data-media-src="/assets/gameplay.mp4" data-media-title="Gameplay">
    <video src="/assets/gameplay.mp4" autoplay muted loop playsinline preload="metadata"></video>
    <span>Gameplay</span>
  </div>
  <div class="purchase-media-side media-open" role="button" tabindex="0" data-open-label="${escapeHtml(t("open"))}" data-media-type="image" data-media-src="/assets/menu.png" data-media-title="Menu">
    <img src="/assets/menu.png" alt="Menu preview">
    <span>Menu</span>
  </div>
  <div class="purchase-media-side media-open" role="button" tabindex="0" data-open-label="${escapeHtml(t("open"))}" data-media-type="image" data-media-src="/assets/esp-preview.png" data-media-title="${escapeHtml(product.game)}">
    <img src="/assets/esp-preview.png" alt="Visual preview">
    <span>${escapeHtml(product.game)}</span>
  </div>`;
}

function renderPurchaseLegacy() {
  if (!els.shopGrid) return;
  if (!products.length) {
    els.shopGrid.innerHTML = `<div class="empty-state">${t("loadingShop")}</div>`;
    return;
  }
  const product = currentProduct();
  const plans = planEntries(product);
  if (!selectedProductId) selectedProductId = product.productId;
  if (!plans.some(([days]) => String(days) === String(selectedPlanDays))) {
    selectedPlanDays = plans.find(([days]) => String(days) === "30")?.[0] || plans[0]?.[0] || "30";
  }
  const amount = product.plans?.[selectedPlanDays] ?? plans[0]?.[1] ?? 0;

  els.shopGrid.innerHTML = `<div class="purchase-page">
    <div class="purchase-title">
      <span class="kicker">${t("purchase")}</span>
      <h2>${t("purchaseTitle")}</h2>
    </div>
    <div class="purchase-layout">
      <section class="purchase-preview">
        <div class="purchase-toolbar">
          <span class="brand-dot"></span>
          <div class="toolbar-pills"><span></span><span></span><span></span><span></span><span></span></div>
          <small>Antilose interface</small>
        </div>
        <div class="purchase-ui-grid">${productMedia(product)}</div>
        <div class="preview-footer">
          <span>${t("productShots")}</span>
          <div class="preview-dots"><b></b><b></b><b></b><b></b></div>
          <button type="button">‹</button>
          <button type="button">›</button>
        </div>
      </section>
      <aside class="purchase-side">
        <section class="checkout-card">
          <div class="checkout-head">
            <span class="kicker">${t("checkout")}</span>
            <div><small>${t("total")}</small><strong>$${money(amount)}</strong></div>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <div class="product-switcher">
            ${products.map((item) => `<button class="${Number(item.productId) === Number(product.productId) ? "active" : ""}" type="button" data-product-pick="${item.productId}">${escapeHtml(item.name)}</button>`).join("")}
          </div>
          <div class="duration-row">
            ${plans.map(([days]) => `<button class="${String(days) === String(selectedPlanDays) ? "active" : ""}" type="button" data-plan-pick="${days}">${days} ${t("days")}</button>`).join("")}
          </div>
          <button class="btn primary checkout-btn" type="button" data-purchase-now="${product.productId}" data-days="${selectedPlanDays}" data-amount="${amount}">${t("buyNow")}</button>
        </section>
        <section class="spec-card">
          <p><b>${t("processors")}</b><span>Intel, AMD</span></p>
          <p><b>${t("gpus")}</b><span>${t("discrete")}</span></p>
          <p><b>${t("os")}</b><span>Windows 10/11 x64</span></p>
          <p><b>${t("emulator")}</b><span>${t("emulatorSupport")}</span></p>
          <p><b>${t("delivery")}</b><span>${t("digital")}</span></p>
          <p><b>${t("included")}</b><span>${t("includedItems")}</span></p>
        </section>
        <button class="reset-offer" type="button" data-open-subscriptions>
          <span class="reset-icon">▣</span>
          <span><b>${t("resetHwid")}</b><small>${t("resetHint")}</small></span>
          <strong>${t("inSubscriptions")}</strong>
        </button>
      </aside>
    </div>
  </div>`;

  els.shopGrid.querySelectorAll("[data-product-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProductId = Number(button.dataset.productPick);
      selectedPlanDays = null;
      renderPurchase();
    });
  });
  els.shopGrid.querySelectorAll("[data-plan-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlanDays = String(button.dataset.planPick);
      renderPurchase();
    });
  });
  els.shopGrid.querySelector("[data-purchase-now]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    createPayment(button.dataset.purchaseNow, button.dataset.days, button.dataset.amount, button);
  });
  els.shopGrid.querySelector("[data-open-subscriptions]")?.addEventListener("click", () => activateTab("subscriptions"));
}

function renderPurchase() {
  if (!els.shopGrid) return;
  if (!products.length) {
    els.shopGrid.innerHTML = `<div class="empty-state">${t("loadingShop")}</div>`;
    return;
  }
  if (![0, 1, 2].includes(Number(selectedPaymentSystemId))) selectedPaymentSystemId = 0;

  const product = currentProduct();
  const plans = planEntries(product);
  const description = productDescription(product);
  if (!selectedProductId) selectedProductId = product.productId;
  if (!plans.some(([days]) => String(days) === String(selectedPlanDays))) {
    selectedPlanDays = plans.find(([days]) => String(days) === "30")?.[0] || plans[0]?.[0] || "30";
  }

  const amount = product.plans?.[selectedPlanDays] ?? plans[0]?.[1] ?? 0;
  const amountText = purchaseAmountLabel(product, selectedPlanDays, amount);
  const purchaseDisabled = appSettings.purchaseEnabled === false;
  const selectedPlanIndex = Math.max(0, plans.findIndex(([days]) => String(days) === String(selectedPlanDays)));
  const selectedPaymentIndex = Math.max(0, [0, 1, 2].indexOf(Number(selectedPaymentSystemId)));
  const productSwitcher = products.length > 1 ? `<div class="product-switcher">
    ${products.map((item) => `<button class="${Number(item.productId) === Number(product.productId) ? "active" : ""}" type="button" data-product-pick="${item.productId}">${escapeHtml(item.name)}</button>`).join("")}
  </div>` : "";

  els.shopGrid.innerHTML = `<div class="purchase-page">
    <div class="purchase-title">
      <div>
        <span class="kicker">${t("purchase")}</span>
        <h2>${t("purchaseTitle")}</h2>
      </div>
      <div class="purchase-title-badge">
        <span>${t("total")}</span>
        <strong data-plan-total>${amountText}</strong>
      </div>
    </div>
    <div class="purchase-layout">
      <section class="purchase-preview">
        <div class="purchase-toolbar">
          <span class="brand-dot"></span>
          <div class="toolbar-pills"><span></span><span></span><span></span></div>
          <small>${escapeHtml(product.name)}</small>
        </div>
        <div class="purchase-ui-grid">${productMedia(product)}</div>
        <div class="preview-footer">
          <span>${t("productShots")}</span>
          <b>${t("openPreview")}</b>
          <b>${t("instantAccess")}</b>
        </div>
      </section>

      <aside class="purchase-side">
        <section class="checkout-card">
          <div class="checkout-head">
            <span class="kicker">${t("order")}</span>
            <div><small>${t("total")}</small><strong data-plan-total>${amountText}</strong></div>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          ${description ? `<p class="checkout-copy">${escapeHtml(description)}</p>` : ""}
          <div class="checkout-steps" aria-label="${escapeHtml(t("checkout"))}">
            <span class="active"><b>01</b>${t("stepPlan")}</span>
            <span class="active"><b>02</b>${t("stepPayment")}</span>
            <span><b>03</b>${t("stepReady")}</span>
          </div>
          ${productSwitcher}
          <span class="field-label">${t("choosePeriod")}</span>
          <div class="duration-row smooth-choice" style="--active-index:${selectedPlanIndex}">
            <span class="choice-slider" aria-hidden="true"></span>
            ${plans.map(([days, price]) => `<button class="${String(days) === String(selectedPlanDays) ? "active" : ""}" type="button" data-plan-pick="${days}" data-amount="${price}"><span>${days} ${t("days")}</span><b>$${money(price)}</b></button>`).join("")}
          </div>
          <span class="field-label">${t("paymentMethod")}</span>
          <div class="payment-methods smooth-choice" style="--active-index:${selectedPaymentIndex}">
            <span class="choice-slider" aria-hidden="true"></span>
            <button class="${selectedPaymentSystemId === 0 ? "active" : ""}" type="button" data-payment-method="0"><span>CryptoBot</span></button>
            <button class="${selectedPaymentSystemId === 1 ? "active" : ""}" type="button" data-payment-method="1"><span>Pally</span></button>
            <button class="${selectedPaymentSystemId === 2 ? "active" : ""}" type="button" data-payment-method="2"><span>TG Stars</span></button>
          </div>
          <button class="btn primary checkout-btn" type="button" data-purchase-now="${product.productId}" data-days="${selectedPlanDays}" data-amount="${amount}"${purchaseDisabled ? " disabled" : ""}>${purchaseDisabled ? "Покупки закрыты" : t("buyNow")}</button>
        </section>

        <section class="spec-card">
          <div class="spec-title"><span class="kicker">${t("compatibility")}</span></div>
          <div class="spec-grid">
            <p><b>CPU</b><span>Intel, AMD</span></p>
            <p><b>GPU</b><span>${t("discrete")}</span></p>
            <p><b>OS</b><span>Windows 10/11 x64</span></p>
            <p><b>${t("emulator")}</b><span>${t("emulatorSupport")}</span></p>
            <p><b>${t("delivery")}</b><span>${t("digital")}</span></p>
            <p><b>${t("included")}</b><span>${t("includedItems")}</span></p>
          </div>
        </section>

        <button class="reset-offer" type="button" data-open-subscriptions>
          <span class="reset-icon">◇</span>
          <span><b>${t("resetHwid")}</b><small>${t("resetHint")}</small></span>
          <strong>${t("inSubscriptions")}</strong>
        </button>
      </aside>
    </div>
  </div>`;

  els.shopGrid.querySelectorAll("[data-product-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProductId = Number(button.dataset.productPick);
      selectedPlanDays = null;
      renderPurchase();
    });
  });
  els.shopGrid.querySelectorAll("[data-plan-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlanDays = String(button.dataset.planPick);
      setSmoothChoice(button);
      updatePurchaseAmount(button.dataset.amount, selectedPlanDays);
    });
  });
  els.shopGrid.querySelectorAll("[data-payment-method]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPaymentSystemId = Number(button.dataset.paymentMethod || 0);
      setSmoothChoice(button);
      const checkoutButton = els.shopGrid.querySelector("[data-purchase-now]");
      updatePurchaseAmount(checkoutButton?.dataset.amount || amount, selectedPlanDays);
    });
  });
  els.shopGrid.querySelector("[data-purchase-now]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    createPayment(button.dataset.purchaseNow, button.dataset.days, button.dataset.amount, button);
  });
  els.shopGrid.querySelector("[data-open-subscriptions]")?.addEventListener("click", () => activateTab("subscriptions"));
  setupInteractiveMotion(els.shopGrid);
  requestAnimationFrame(() => {
    els.shopGrid.querySelectorAll(".smooth-choice").forEach((group) => {
      positionSmoothChoice(group, group.querySelector("button.active"));
    });
  });
}

function setSmoothChoice(button) {
  const group = button?.parentElement;
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll("button"));
  const activeIndex = Math.max(0, buttons.indexOf(button));
  group.style.setProperty("--active-index", String(activeIndex));
  group.classList.remove("is-switching");
  void group.offsetWidth;
  group.classList.add("is-switching");
  animateSmoothChoice(group, button, buttons);
}

function positionSmoothChoice(group, button) {
  if (!group || !button) return;
  const slider = group.querySelector(".choice-slider");
  group.style.setProperty("--choice-x", `${button.offsetLeft}px`);
  group.style.setProperty("--choice-y", `${button.offsetTop}px`);
  group.style.setProperty("--choice-width", `${button.offsetWidth}px`);
  group.style.setProperty("--choice-height", `${button.offsetHeight}px`);
  if (slider) {
    slider.style.width = `${button.offsetWidth}px`;
    slider.style.height = `${button.offsetHeight}px`;
    slider.style.transform = `translate3d(${button.offsetLeft}px, ${button.offsetTop}px, 0)`;
  }
}

function sliderState(slider, button) {
  const styles = window.getComputedStyle(slider);
  const matrix = styles.transform;
  const values = matrix && matrix !== "none" ? matrix.match(/matrix.*\((.+)\)/)?.[1]?.split(",").map(Number) : null;
  return {
    x: values ? values[4] : button.offsetLeft,
    y: values ? values[5] : button.offsetTop,
    width: parseFloat(styles.width) || button.offsetWidth,
    height: parseFloat(styles.height) || button.offsetHeight,
  };
}

function choiceEase(value) {
  return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
}

function markChoiceActive(buttons, button) {
  buttons.forEach((item) => item.classList.toggle("active", item === button));
  button.classList.remove("choice-pop");
  void button.offsetWidth;
  button.classList.add("choice-pop");
}

function animateSmoothChoice(group, button, buttons) {
  const slider = group.querySelector(".choice-slider");
  if (!slider) {
    markChoiceActive(buttons, button);
    positionSmoothChoice(group, button);
    return;
  }

  const previousFrame = choiceAnimations.get(group);
  if (previousFrame) cancelAnimationFrame(previousFrame);
  const previousTimer = choiceTimers.get(group);
  if (previousTimer) window.clearTimeout(previousTimer);

  const start = sliderState(slider, button);
  const target = {
    x: button.offsetLeft,
    y: button.offsetTop,
    width: button.offsetWidth,
    height: button.offsetHeight,
  };
  const direction = target.x >= start.x ? 1 : -1;
  let activated = false;
  const duration = 620;
  const startTime = performance.now();

  slider.style.transition = "none";
  group.style.setProperty("--choice-width", `${target.width}px`);
  group.style.setProperty("--choice-height", `${target.height}px`);

  const step = (time) => {
    const progress = Math.min(1, (time - startTime) / duration);
    const eased = choiceEase(progress);
    const stretch = Math.sin(progress * Math.PI) * Math.min(34, Math.abs(target.x - start.x) * 0.18);
    const x = start.x + (target.x - start.x) * eased - (direction < 0 ? stretch : 0);
    const y = start.y + (target.y - start.y) * eased;
    const width = start.width + (target.width - start.width) * eased + stretch;
    const height = start.height + (target.height - start.height) * eased;

    slider.style.width = `${width.toFixed(2)}px`;
    slider.style.height = `${height.toFixed(2)}px`;
    slider.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

    if (!activated && progress > 0.22) {
      activated = true;
      markChoiceActive(buttons, button);
    }

    if (progress < 1) {
      choiceAnimations.set(group, requestAnimationFrame(step));
      return;
    }

    positionSmoothChoice(group, button);
    if (!activated) markChoiceActive(buttons, button);
    choiceAnimations.delete(group);
    const timer = window.setTimeout(() => group.classList.remove("is-switching"), 180);
    choiceTimers.set(group, timer);
  };

  choiceAnimations.set(group, requestAnimationFrame(step));
}

function updatePurchaseAmount(amount, days) {
  const formatted = purchaseAmountLabel(currentProduct(), days, amount);
  els.shopGrid.querySelectorAll("[data-plan-total]").forEach((node) => {
    node.textContent = formatted;
    node.classList.remove("amount-pulse");
    void node.offsetWidth;
    node.classList.add("amount-pulse");
  });
  const checkoutButton = els.shopGrid.querySelector("[data-purchase-now]");
  if (checkoutButton) {
    checkoutButton.dataset.days = days;
    checkoutButton.dataset.amount = amount;
  }
}

function renderHeader() {
  if (session?.user) {
    els.accountBtn.textContent = t("myCabinet");
    els.accountBtn.onclick = () => navigate(`/user/${session.user.uid}`);
    show(els.logoutBtn);
    els.logoutBtn.textContent = t("logout");
  } else {
    els.accountBtn.textContent = t("signIn");
    els.accountBtn.onclick = openLogin;
    hide(els.logoutBtn);
  }
}

function renderLanding() {
  show(els.landingPage);
  hide(els.userPage);
  hide(els.forumPage);
  document.title = "Antilose";
  revealVisible();
  refreshSmoothScroll(true);
}

async function renderUserPage(uid) {
  hide(els.landingPage);
  hide(els.forumPage);
  show(els.userPage);
  hide(els.publicProfile);
  hide(els.ownerCabinet);
  els.profileTitle.textContent = t("loading");
  els.profileSubtitle.textContent = "";

  let profile;
  try {
    profile = await api(`/api/users/${uid}`);
  } catch {
    els.profileKicker.textContent = t("profile");
    els.profileTitle.textContent = t("userNotFound");
    els.profileSubtitle.textContent = t("checkUid");
    return;
  }

  if (profile.isSelf) renderOwnerProfile(profile);
  else renderPublicProfile(profile.user);
  revealVisible();
  refreshSmoothScroll(true);
}

function renderPublicProfile(user) {
  currentUserIsAdmin = false;
  document.title = `${user.login} · Antilose`;
  els.profileKicker.textContent = `UID ${user.uid}`;
  els.profileTitle.textContent = user.login;
  els.profileSubtitle.textContent = user.hasSubscription ? t("hasSub") : t("noSub");
  els.profileAvatar.textContent = user.login.slice(0, 1).toUpperCase();
  setProfileAura(user.hasSubscription ? "active" : "expired");
  els.publicUid.textContent = user.uid;
  els.publicLogin.textContent = user.login;
  els.publicSub.textContent = user.hasSubscription ? t("yes") : t("no");
  hide(els.profileShopBtn);
  hide(els.adminTabBtn);
  if (els.adminPanel) els.adminPanel.innerHTML = "";
  show(els.publicProfile);
  refreshSmoothScroll(true);
}

function renderOwnerProfile(data) {
  const user = data.user;
  const subscriptions = Array.isArray(data.subscriptions) ? data.subscriptions : [];
  const invoices = Array.isArray(data.invoices) ? data.invoices : [];
  const payments = Array.isArray(data.payments) ? data.payments : [];
  const isAdmin = data.admin === true;
  currentUserIsAdmin = isAdmin;
  appSettings = { purchaseEnabled: data.settings?.purchaseEnabled !== false };
  userHasActiveSubscription = subscriptions.some((sub) => sub.active && !sub.frozen);
  const forumCreateState = data.forum?.createState || (userHasActiveSubscription ? "allowed" : "subscription");
  const aura = subscriptions.some((sub) => sub.active && !sub.frozen)
    ? "active"
    : subscriptions.some((sub) => sub.frozen)
      ? "frozen"
      : subscriptions.length
        ? "expired"
        : "neutral";

  session = { user };
  renderHeader();
  document.title = `${user.login} · Antilose`;
  els.profileKicker.textContent = t("myAccount");
  els.profileTitle.textContent = user.login;
  els.profileSubtitle.textContent = `UID ${user.uid}${user.telegramId ? ` · Telegram ${user.telegramId}` : ""}`;
  els.profileAvatar.textContent = user.login.slice(0, 1).toUpperCase();
  setProfileAura(aura);
  els.profileBalance.textContent = money(user.balance);
  els.profilePaid.textContent = user.activatedPayments;
  els.ownerUid.textContent = user.uid;
  els.ownerTelegram.textContent = user.telegramId || t("notLinked");
  els.ownerLanguage.textContent = currentLang.toUpperCase();
  els.ownerReferral.textContent = user.referral || t("none");
  show(els.profileShopBtn);
  show(els.ownerCabinet);
  if (isAdmin) {
    show(els.adminTabBtn);
  } else {
    hide(els.adminTabBtn);
    if (els.adminPanel) els.adminPanel.innerHTML = "";
  }

  const canDownloadLoader = subscriptions.some((sub) => sub.active && !sub.frozen);
  const loaderDownload = canDownloadLoader
    ? `<article class="subscription-card"><div><span class="status-pill">Loader</span><h3>Antilose loader</h3><div class="sub-meta"><span class="plan">Available for active subscription</span></div></div><div class="sub-actions"><a class="btn primary" href="/api/download/loader">Download</a></div></article>`
    : "";
  els.subscriptionList.innerHTML = `${loaderDownload}${
    subscriptions.length
      ? subscriptions.map(renderSubscription).join("")
      : `<div class="empty-state">${t("noSubscriptions")}</div>`
  }`;
  els.invoiceList.innerHTML = invoices.length
    ? invoices.map((invoice) => `<div class="mini-item"><b>${escapeHtml(statusLabel(invoice.status))}</b><span>${paymentAmountLabel(invoice)}</span></div>`).join("")
    : `<div class="mini-item">${t("noInvoices")}</div>`;
  els.paymentList.innerHTML = payments.length
    ? payments.map(renderPaymentItem).join("")
    : `<div class="mini-item">${t("noPayments")}</div>`;
  renderForumCabinet(forumCreateState);

  bindSubscriptionActions();
  bindPaymentActions();
  bindForumActions(els.forumCabinet || document);
  renderProducts();
  renderAdminPanel(isAdmin);
  activateTab(new URLSearchParams(window.location.search).has("shop") ? "shop" : "overview");
  refreshSmoothScroll(true);
}

async function renderAdminPanel(enabled) {
  if (!els.adminPanel) return;
  if (!enabled || !currentUserIsAdmin) {
    els.adminPanel.innerHTML = "";
    return;
  }
  els.adminPanel.innerHTML = `<div class="empty-state">Загрузка админки...</div>`;
  try {
    const summary = await api("/api/admin/summary");
    els.adminPanel.innerHTML = renderAdminShell(summary);
    bindAdminPanel(summary);
  } catch (error) {
    els.adminPanel.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function renderAdminShell(summary) {
  if (!currentUserIsAdmin) return "";
  const purchaseText = summary.purchaseEnabled ? "Покупки включены" : "Покупки закрыты";
  const files = summary.files || {};
  return `<div class="admin-grid">
    <section class="admin-card admin-wide">
      <div class="admin-head">
        <div><span class="kicker">Admin</span><h3>Панель управления</h3></div>
        <button class="btn ghost mini-action" type="button" data-admin-refresh>Обновить</button>
      </div>
      <div class="admin-metrics">
        <div><strong>${summary.usersCount || 0}</strong><span>пользователей</span></div>
        <div><strong>${summary.subscriptionsCount || 0}</strong><span>подписок</span></div>
        <div><strong>${summary.activeSubscriptionsCount || 0}</strong><span>активных</span></div>
        <div><strong>${summary.pendingInvoicesCount || 0}</strong><span>ожидают оплату</span></div>
        <div><strong>${summary.pendingForumCount || 0}</strong><span>конфиги</span></div>
      </div>
    </section>

    <section class="admin-card admin-wide">
      <div class="admin-head">
        <div><span class="kicker">Configs</span><h3>${t("forumModeration")}</h3></div>
        <button class="btn ghost mini-action" type="button" data-admin-forum-refresh>${t("refresh")}</button>
      </div>
      <div class="forum-admin-list" id="adminForumList"><div class="empty-state">${t("loading")}</div></div>
    </section>

    <section class="admin-card">
      <span class="kicker">User</span>
      <h3>Пользователь по UID</h3>
      <div class="admin-inline">
        <input id="adminUidInput" type="number" min="1" placeholder="UID">
        <button class="btn primary" type="button" data-admin-search>Найти</button>
      </div>
      <div class="admin-result" id="adminUserResult"></div>
    </section>

    <section class="admin-card">
      <span class="kicker">Files</span>
      <h3>Build uploads</h3>
      <div class="admin-actions">
        <label class="btn ghost full">Upload loader<input type="file" accept=".exe" data-admin-file="loader" hidden></label>
        <label class="btn ghost full">Upload product.dll<input type="file" accept=".dll" data-admin-file="product" hidden></label>
        <label class="btn ghost full">Upload dump.cs<input type="file" accept=".cs" data-admin-file="dump-cs" hidden></label>
        <label class="btn ghost full">Upload script.json<input type="file" accept=".json" data-admin-file="script-json" hidden></label>
        <label class="btn ghost full">Upload model assets<input type="file" accept=".zip" data-admin-file="model-assets" hidden></label>
      </div>
      <div class="admin-result">
        <div class="mini-item"><b>loader</b><span>${renderFileInfo(files.loader)}</span></div>
        <div class="mini-item"><b>product.dll</b><span>${renderFileInfo(files.product)}</span></div>
        <div class="mini-item"><b>dump.cs</b><span>${renderFileInfo(files.dumpCs)}</span></div>
        <div class="mini-item"><b>script.json</b><span>${renderFileInfo(files.scriptJson)}</span></div>
        <div class="mini-item"><b>model assets</b><span>${renderFileInfo(files.modelAssets)}</span></div>
      </div>
    </section>

    <section class="admin-card">
      <span class="kicker">Bulk</span>
      <h3>Массовые действия</h3>
      <div class="admin-actions">
        <button class="btn ghost" type="button" data-admin-bulk="reset-hwid">Сбросить HWID всем</button>
        <button class="btn ghost" type="button" data-admin-bulk="freeze">Заморозить всем</button>
        <button class="btn ghost" type="button" data-admin-bulk="unfreeze">Разморозить всем</button>
      </div>
      <div class="admin-inline">
        <input id="adminDaysInput" type="number" min="1" value="1">
        <button class="btn ghost" type="button" data-admin-add-days>Добавить дни всем</button>
      </div>
      <button class="btn ${summary.purchaseEnabled ? "ghost" : "primary"} full" type="button" data-admin-purchases="${summary.purchaseEnabled ? "0" : "1"}">${purchaseText}</button>
    </section>
  </div>`;
}

async function renderForumPage(postId = "") {
  hide(els.landingPage);
  hide(els.userPage);
  show(els.forumPage);
  if (!session) {
    await bootstrapSession();
  }
  document.title = `${t("forum")} · Antilose`;
  if (!els.forumContent) return;
  els.forumContent.innerHTML = `<div class="empty-state">${t("loading")}</div>`;
  try {
    if (postId) {
      const data = await api(`/api/forum/posts/${postId}`);
      renderForumDetail(data.post);
    } else {
      await renderForumList(forumFilter);
    }
  } catch (error) {
    els.forumContent.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
  revealVisible();
  setupInteractiveMotion(els.forumPage);
  refreshSmoothScroll(true);
}

async function renderForumList(status = "approved") {
  if (status === "mine" && !session?.user) {
    openLogin();
    showToast(t("forumSignIn"));
    status = "approved";
  }
  forumFilter = status;
  document.querySelectorAll("[data-forum-filter]").forEach((button) => button.classList.toggle("active", button.dataset.forumFilter === status));
  if (!els.forumContent) return;
  els.forumContent.innerHTML = `<div class="empty-state">${t("loading")}</div>`;
  const data = await api(`/api/forum/posts?status=${encodeURIComponent(status)}`);
  const posts = (data.posts || []).map((post) => ({ ...post, canRate: post.canRate && status === "approved" }));
  els.forumContent.innerHTML = `
    ${renderForumCreateCard(data.createState || (data.canCreate ? "allowed" : "subscription"))}
    <div class="forum-grid">
      ${posts.length ? posts.map((post) => forumCard(post, { publicList: true })).join("") : `<div class="empty-state">${status === "mine" ? t("forumCreateHint") : t("forumEmpty")}</div>`}
    </div>`;
  bindForumActions(els.forumContent);
  revealVisible();
  setupInteractiveMotion(els.forumContent);
  refreshSmoothScroll(true);
}

function renderForumCreateCard(createState) {
  const state = createState === true ? "allowed" : String(createState || "subscription");
  const canCreate = state === "allowed";
  const disabled = canCreate ? "" : " disabled";
  const submitLabel = canCreate ? t("forumSubmit") : forumCreateBlockedLabel(state);
  return `<section class="forum-create-card reveal">
    <div>
      <span class="kicker">${t("forumCreate")}</span>
      <h2>${t("forumCreateTitle")}</h2>
      <p>${t("forumCreateHint")}</p>
      <p class="forum-file-hint">${t("forumConfigJsonHint")}</p>
    </div>
    <form class="forum-form" method="post" action="/api/forum/posts" enctype="multipart/form-data" data-forum-create-form data-lenis-prevent>
      <label>${t("forumName")}<input name="title" minlength="3" maxlength="80" required${disabled} placeholder="Legit Visuals"></label>
      <label>${t("forumDescription")}<textarea name="description" minlength="20" maxlength="3000" rows="5" required${disabled} placeholder="Опишите стиль, режимы и рекомендации по использованию"></textarea></label>
      <label>${t("forumImages")}<input name="images" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple required${disabled}></label>
      <label>${t("forumConfigFile")}<input name="config" type="file" accept="application/json,.json" required${disabled}></label>
      <button class="btn primary full" type="submit"${disabled}>${submitLabel}</button>
    </form>
  </section>`;
}

function renderForumDetail(post) {
  const detail = { ...post, canRate: post.canRate && post.status === "approved" };
  els.forumContent.innerHTML = `<div class="forum-detail-card">${forumCard(detail, { admin: currentUserIsAdmin })}</div>`;
  bindForumActions(els.forumContent);
}

function renderForumCabinet(createState) {
  if (!els.forumCabinet) return;
  els.forumCabinet.innerHTML = `<div class="forum-cabinet-grid">
    ${renderForumCreateCard(createState)}
    <section class="forum-create-card forum-library-card reveal">
      <span class="kicker">${t("forumLibrary")}</span>
      <h2>${t("forumTitle")}</h2>
      <p>${t("forumLead")}</p>
      <div class="forum-actions">
        <button class="btn primary" type="button" data-forum-open="/configs">${t("forumOpen")}</button>
        <button class="btn ghost" type="button" data-forum-open="/configs?filter=mine">${t("forumMyPosts")}</button>
      </div>
    </section>
  </div>`;
}

async function submitForumPost(form) {
  const formData = new FormData(form);
  const images = form.querySelector('input[name="images"]')?.files || [];
  const config = form.querySelector('input[name="config"]')?.files?.[0];
  if (images.length < 1 || images.length > 3) {
    showToast(t("forumImages"));
    return;
  }
  if (!config || !config.name.toLowerCase().endsWith(".json")) {
    showToast(t("forumConfigJsonHint"));
    return;
  }
  form.querySelector("button[type='submit']")?.setAttribute("disabled", "disabled");
  try {
    await apiForm("/api/forum/posts", formData);
    form.reset();
    showToast(t("forumSubmitted"));
    await renderForumList("mine");
  } catch (error) {
    showToast(error.message);
  } finally {
    form.querySelector("button[type='submit']")?.removeAttribute("disabled");
  }
}

async function rateForumPost(postId, stars) {
  try {
    const data = await api(`/api/forum/posts/${postId}/rating`, {
      method: "POST",
      body: JSON.stringify({ stars: Number(stars) }),
    });
    showToast(t("forumStarsSaved"));
    const card = document.querySelector(`[data-forum-post="${CSS.escape(postId)}"]`);
    if (card && data.post) {
      card.outerHTML = forumCard({ ...data.post, canRate: data.post.canRate });
      bindForumActions(els.forumContent || document);
      setupInteractiveMotion(els.forumContent || document);
    }
  } catch (error) {
    showToast(error.message);
  }
}

function bindForumActions(root = document) {
  root.querySelectorAll("[data-forum-create-form]").forEach((form) => {
    if (form.dataset.boundForumForm) return;
    form.dataset.boundForumForm = "1";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForumPost(event.currentTarget);
    });
  });
  root.querySelectorAll("[data-forum-rate]").forEach((button) => {
    if (button.dataset.boundForumRate) return;
    button.dataset.boundForumRate = "1";
    button.addEventListener("click", () => rateForumPost(button.dataset.forumRate, button.dataset.stars));
  });
  root.querySelectorAll("[data-forum-open]").forEach((button) => {
    if (button.dataset.boundForumOpen) return;
    button.dataset.boundForumOpen = "1";
    button.addEventListener("click", () => navigate(button.dataset.forumOpen));
  });
}

function renderFileInfo(info) {
  if (!info?.exists) return "not uploaded";
  const sizeMb = Number(info.size || 0) / 1024 / 1024;
  const hash = String(info.sha256 || "");
  return `${sizeMb.toFixed(2)} MB | ${escapeHtml(hash.slice(0, 12))}`;
}

function bindAdminPanel() {
  els.adminPanel.querySelectorAll("[data-admin-file]").forEach((input) => {
    input.addEventListener("change", () => adminUploadFile(input.dataset.adminFile, input.files?.[0]));
  });
  els.adminPanel.querySelector("[data-admin-refresh]")?.addEventListener("click", () => renderAdminPanel(true));
  els.adminPanel.querySelector("[data-admin-forum-refresh]")?.addEventListener("click", loadAdminForumPosts);
  els.adminPanel.querySelector("[data-admin-search]")?.addEventListener("click", () => {
    const uid = Number(els.adminPanel.querySelector("#adminUidInput")?.value || 0);
    if (uid) loadAdminUser(uid);
  });
  els.adminPanel.querySelectorAll("[data-admin-bulk]").forEach((button) => {
    button.addEventListener("click", () => adminBulk(button.dataset.adminBulk));
  });
  els.adminPanel.querySelector("[data-admin-add-days]")?.addEventListener("click", () => {
    const days = Number(els.adminPanel.querySelector("#adminDaysInput")?.value || 0);
    if (days > 0) adminPost("/api/admin/bulk/add-days", { days }, "Время добавлено всем подпискам");
  });
  els.adminPanel.querySelector("[data-admin-purchases]")?.addEventListener("click", (event) => {
    adminPost("/api/admin/purchases", { enabled: event.currentTarget.dataset.adminPurchases === "1" }, "Настройка покупок обновлена");
  });
  loadAdminForumPosts();
}

async function loadAdminForumPosts() {
  const list = els.adminPanel?.querySelector("#adminForumList");
  if (!list) return;
  list.innerHTML = `<div class="empty-state">${t("loading")}</div>`;
  try {
    const data = await api("/api/forum/posts?status=pending");
    const posts = Array.isArray(data.posts) ? data.posts : [];
    list.innerHTML = posts.length ? posts.map(forumModerationCard).join("") : `<div class="empty-state">${t("forumNoPending")}</div>`;
    bindAdminForumActions(list);
    setupInteractiveMotion(list);
  } catch (error) {
    list.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function bindAdminForumActions(root) {
  root.querySelectorAll("[data-forum-moderate]").forEach((button) => {
    button.addEventListener("click", () => moderateForumPost(button.dataset.postId, button.dataset.forumModerate));
  });
}

async function moderateForumPost(postId, action) {
  const note = els.adminPanel?.querySelector(`[data-forum-note="${CSS.escape(postId)}"]`)?.value || "";
  try {
    await api(`/api/admin/forum/posts/${postId}`, {
      method: "POST",
      body: JSON.stringify({ action, note }),
    });
    showToast(action === "approve" ? t("forumPublished") : t("forumRejected"));
    await renderAdminPanel(true);
  } catch (error) {
    showToast(error.message);
  }
}

async function adminUploadFile(kind, file) {
  if (!file) return;
  const paths = {
    loader: "/api/admin/files/loader",
    product: "/api/admin/files/product",
    "dump-cs": "/api/admin/files/dump-cs",
    "script-json": "/api/admin/files/script-json",
    "model-assets": "/api/admin/files/model-assets",
  };
  const path = paths[kind];
  if (!path) return;
  try {
    await uploadForm(path, "upload", file);
    showToast("File uploaded");
    await renderAdminPanel(true);
  } catch (error) {
    showToast(error.message);
  }
}

async function adminPost(path, body, message) {
  try {
    const data = await api(path, { method: "POST", body: JSON.stringify(body || {}) });
    if (typeof data.purchaseEnabled === "boolean") {
      appSettings = { purchaseEnabled: data.purchaseEnabled };
    }
    showToast(message || "Готово");
    await renderAdminPanel(true);
  } catch (error) {
    showToast(error.message);
  }
}

async function adminBulk(action) {
  const labels = {
    "reset-hwid": "HWID сброшен всем подпискам",
    freeze: "Все подписки заморожены",
    unfreeze: "Все подписки разморожены",
  };
  await adminPost(`/api/admin/bulk/${action}`, {}, labels[action]);
}

async function loadAdminUser(uid) {
  const result = els.adminPanel.querySelector("#adminUserResult");
  if (result) result.innerHTML = `<div class="empty-state">Поиск...</div>`;
  try {
    const data = await api(`/api/admin/users/${uid}`);
    renderAdminUser(data);
  } catch (error) {
    if (result) result.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function renderAdminUser(data) {
  const result = els.adminPanel.querySelector("#adminUserResult");
  if (!result) return;
  const user = data.user;
  const subscriptions = Array.isArray(data.subscriptions) ? data.subscriptions : [];
  result.innerHTML = `<div class="admin-user-card">
    <div class="admin-user-title">
      <div><span>UID ${user.uid}</span><strong>${escapeHtml(user.login)}</strong></div>
      <b>${subscriptions.length} подписок</b>
    </div>
    <div class="admin-actions">
      <button class="btn ghost" type="button" data-admin-user-action="reset-hwid">Сбросить HWID</button>
      <button class="btn ghost" type="button" data-admin-user-action="freeze">Заморозить</button>
      <button class="btn ghost" type="button" data-admin-user-action="unfreeze">Разморозить</button>
      <button class="btn ghost" type="button" data-admin-user-action="revoke-subscriptions">Снять подписки</button>
    </div>
    <div class="admin-inline">
      <input id="adminGrantDays" type="number" min="1" value="30">
      <button class="btn primary" type="button" data-admin-grant>Выдать подписку</button>
    </div>
    <div class="admin-inline">
      <input id="adminNewPassword" type="password" autocomplete="new-password" minlength="12" maxlength="72" pattern="[A-Za-z0-9]+" placeholder="Новый пароль">
      <button class="btn ghost" type="button" data-admin-password>Изменить пароль</button>
    </div>
    <div class="admin-sub-list">
      ${subscriptions.length ? subscriptions.map(renderAdminSubscription).join("") : `<div class="empty-state">Подписок нет</div>`}
    </div>
  </div>`;
  result.querySelectorAll("[data-admin-user-action]").forEach((button) => {
    button.addEventListener("click", () => adminUserAction(user.uid, button.dataset.adminUserAction));
  });
  result.querySelector("[data-admin-grant]")?.addEventListener("click", () => {
    const days = Number(result.querySelector("#adminGrantDays")?.value || 0);
    if (days > 0) adminUserAction(user.uid, "grant-subscription", { productId: 1, days });
  });
  result.querySelector("[data-admin-password]")?.addEventListener("click", () => {
    const password = String(result.querySelector("#adminNewPassword")?.value || "");
    const validationError = authValidationMessage("register", "AdminUser", password);
    if (!validationError) adminUserAction(user.uid, "password", { password });
    else showToast(validationError);
  });
}

function renderAdminSubscription(sub) {
  const status = sub.frozen ? "заморожена" : sub.active ? "активна" : "истекла";
  return `<div class="admin-sub">
    <b>${escapeHtml(sub.productName)}</b>
    <span>${status} · до ${escapeHtml(sub.expiresAt)} · HWID ${escapeHtml(sub.hwid || "пусто")}</span>
  </div>`;
}

async function adminUserAction(uid, action, extra = {}) {
  const paths = {
    "reset-hwid": "/api/admin/user/reset-hwid",
    freeze: "/api/admin/user/freeze",
    unfreeze: "/api/admin/user/unfreeze",
    "revoke-subscriptions": "/api/admin/user/revoke-subscriptions",
    "grant-subscription": "/api/admin/user/grant-subscription",
    password: "/api/admin/user/password",
  };
  try {
    const data = await api(paths[action], { method: "POST", body: JSON.stringify({ uid, ...extra }) });
    showToast("Готово");
    renderAdminUser(data);
  } catch (error) {
    showToast(error.message);
  }
}

function setProfileAura(state) {
  if (!els.profileCover) return;
  els.profileCover.classList.remove("aura-active", "aura-frozen", "aura-expired", "aura-neutral");
  els.profileCover.classList.add(`aura-${state || "neutral"}`);
}

function renderPaymentItem(payment) {
  const invoiceId = payment.invoiceId || payment.id || "";
  const isProcessing = payment.status === "in_process";
  const provider = payment.provider ? `${escapeHtml(payment.provider)} · ` : "";
  const openButton = payment.checkoutUrl && isProcessing
    ? `<a class="btn ghost mini-action" href="${escapeHtml(payment.checkoutUrl)}" target="_blank" rel="noopener">${t("openPayment")}</a>`
    : "";
  const checkButton = isProcessing && invoiceId
    ? `<button class="btn ghost mini-action" type="button" data-check-payment="${escapeHtml(invoiceId)}">${t("checkPayment")}</button>`
    : "";
  const cancelButton = isProcessing && invoiceId
    ? `<button class="btn ghost mini-action" type="button" data-cancel-payment="${escapeHtml(invoiceId)}">${t("cancelPayment")}</button>`
    : "";
  return `<div class="mini-item payment-item">
    <div>
      <b>${escapeHtml(statusLabel(payment.status))}</b>
      <span>${provider}${payment.days ? `${payment.days} ${t("days")} · ` : ""}${paymentAmountLabel(payment)}</span>
    </div>
    <div class="payment-actions">${openButton}${checkButton}${cancelButton}</div>
  </div>`;
}

function bindPaymentActions() {
  document.querySelectorAll("[data-check-payment]").forEach((button) => {
    button.addEventListener("click", () => checkPayment(button.dataset.checkPayment));
  });
  document.querySelectorAll("[data-cancel-payment]").forEach((button) => {
    button.addEventListener("click", () => cancelPayment(button.dataset.cancelPayment));
  });
}

function renderSubscription(sub) {
  const rawHwid = sub.hwid === null || sub.hwid === undefined ? "" : String(sub.hwid);
  const hwid = rawHwid ? `${rawHwid.slice(0, 8)}••••${rawHwid.slice(-6)}` : t("unlinked");
  const expired = !sub.active;
  const status = sub.frozen ? t("frozen") : expired ? t("expired") : t("active");
  const lockText = expired
    ? `<p class="sub-note">${sub.frozen ? t("expiredFrozenNote") : t("expiredNote")}</p>`
    : "";
  const freezeButton = sub.frozen
    ? `<button class="btn ghost" type="button" data-unfreeze="${escapeHtml(sub.key)}">${t("unfreeze")}</button>`
    : `<button class="btn ghost" type="button" data-freeze="${escapeHtml(sub.key)}"${expired ? " disabled" : ""}>${t("freezeAction")}</button>`;
  return `<article class="subscription-card${expired ? " expired" : ""}">
    <div>
      <span class="status-pill${sub.active && !sub.frozen ? "" : " off"}">${status}</span>
      <h3>${escapeHtml(sub.productName)}</h3>
      <div class="sub-meta">
        <span class="plan">${t("validUntil")} ${escapeHtml(sub.expiresAt)}</span>
        <span class="plan">HWID ${escapeHtml(hwid)}</span>
        <span class="plan">${escapeHtml(sub.jwtPreview)}</span>
      </div>
      ${lockText}
    </div>
    <div class="sub-actions">
      ${freezeButton}
      <button class="btn primary" type="button" data-reset="${escapeHtml(sub.key)}"${expired ? " disabled" : ""}>${t("resetHwidAction")}</button>
    </div>
  </article>`;
}

function bindSubscriptionActions() {
  document.querySelectorAll("[data-freeze]").forEach((button) => {
    button.addEventListener("click", () => mutateSubscription("/api/subscription/freeze", button.dataset.freeze, t("frozenDone")));
  });
  document.querySelectorAll("[data-unfreeze]").forEach((button) => {
    button.addEventListener("click", () => mutateSubscription("/api/subscription/unfreeze", button.dataset.unfreeze, t("unfrozenDone")));
  });
  document.querySelectorAll("[data-reset]").forEach((button) => {
    button.addEventListener("click", () => mutateSubscription("/api/subscription/reset-hwid", button.dataset.reset, t("hwidResetDone")));
  });
}

async function mutateSubscription(path, key, message) {
  try {
    await api(path, { method: "POST", body: JSON.stringify({ key }) });
    showToast(message);
    await refreshUserPage();
  } catch (error) {
    showToast(error.message);
  }
}

async function createPayment(productId, days, amount, trigger) {
  if (trigger?.disabled) return;
  if (appSettings.purchaseEnabled === false) {
    showToast("Покупки сейчас закрыты");
    return;
  }
  if (trigger) trigger.disabled = true;
  try {
    const data = await api("/api/payment/create", {
      method: "POST",
      body: JSON.stringify({
        productId: Number(productId),
        days: Number(days),
        amount: Number(amount),
        paymentSystemId: selectedPaymentSystemId,
      }),
    });
    showToast(data.message || t("paymentCreated"));
    if (data.payment?.checkoutUrl) {
      if (String(data.payment.provider || "").toLowerCase() === "pally") {
        window.location.assign(data.payment.checkoutUrl);
        return;
      }
      const opened = window.open(data.payment.checkoutUrl, "_blank", "noopener");
      if (!opened) window.location.assign(data.payment.checkoutUrl);
    }
    await refreshUserPage();
    activateTab("history");
  } catch (error) {
    showToast(error.message);
  } finally {
    if (trigger) trigger.disabled = false;
  }
}

async function checkPayment(invoiceId) {
  try {
    const data = await api("/api/payment/check", {
      method: "POST",
      body: JSON.stringify({ invoiceId }),
    });
    showToast(data.payment?.status === "activated" ? t("paymentActivated") : t("paymentStillProcessing"));
    await refreshUserPage();
    activateTab("history");
  } catch (error) {
    showToast(error.message);
  }
}

async function cancelPayment(invoiceId) {
  try {
    const data = await api("/api/payment/cancel", {
      method: "POST",
      body: JSON.stringify({ invoiceId }),
    });
    showToast(data.payment?.status === "activated" ? t("paymentActivated") : t("paymentCanceledDone"));
    await refreshUserPage();
    activateTab("history");
  } catch (error) {
    showToast(error.message);
  }
}

async function refreshUserPage() {
  const match = window.location.pathname.match(/^\/user\/(\d+)/);
  if (match) await renderUserPage(match[1]);
}

function activateTab(name) {
  if (name === "admin" && !currentUserIsAdmin) name = "overview";
  if (!document.getElementById(`tab-${name}`)) name = "overview";
  document.querySelectorAll(".tab[data-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${name}`));
  if (name === "shop") renderPurchase();
  refreshSmoothScroll(true);
}

function renderRoute() {
  const match = window.location.pathname.match(/^\/user\/(\d+)/);
  const forumMatch = window.location.pathname.match(/^\/(?:forum|configs)(?:\/([A-Za-z0-9_-]+))?\/?$/);
  if (match) renderUserPage(match[1]);
  else if (forumMatch) {
    forumFilter = new URLSearchParams(window.location.search).get("filter") === "mine" ? "mine" : "approved";
    renderForumPage(forumMatch[1] || "");
  }
  else renderLanding();
  refreshSmoothScroll();
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function revealVisible() {
  if (revealFrame) return;
  revealFrame = requestAnimationFrame(() => {
    revealFrame = null;
    document.querySelectorAll(".reveal").forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.94) item.classList.add("visible");
    });
  });
}

async function bootstrapSession() {
  try {
    session = await api("/api/me");
  } catch {
    session = null;
  }
  renderHeader();
}

async function bootstrapPublicConfig() {
  try {
    publicConfig = await api("/api/public-config");
  } catch {
    publicConfig = { turnstileEnabled: false, turnstileSiteKey: "" };
  }
  renderTurnstile();
}

async function bootstrapProducts() {
  const data = await api("/api/products");
  products = data.products;
  renderProducts();
}

function turnstileResponseToken() {
  const form = els.loginForm;
  if (!form) return "";
  return String(new FormData(form).get("cf-turnstile-response") || "");
}

function resetTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.reset(turnstileWidgetId);
  }
}

function renderTurnstile() {
  if (!els.turnstileSlot) return;
  const enabled = Boolean(publicConfig.turnstileEnabled && publicConfig.turnstileSiteKey);
  els.turnstileSlot.classList.toggle("hidden", !enabled);
  if (!enabled) {
    els.turnstileSlot.innerHTML = "";
    turnstileWidgetId = null;
    return;
  }
  if (!window.turnstile) {
    window.setTimeout(renderTurnstile, 250);
    return;
  }
  if (turnstileWidgetId !== null) return;
  turnstileWidgetId = window.turnstile.render(els.turnstileSlot, {
    sitekey: publicConfig.turnstileSiteKey,
    theme: "dark",
    size: "normal",
  });
}

function authValidationMessage(mode, login, password) {
  if (login.length > LOGIN_MAX_LENGTH) {
    return currentLang === "en" ? "Login is too long." : "Логин слишком длинный.";
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return currentLang === "en" ? "Password is too long." : "Пароль слишком длинный.";
  }
  if (mode !== "register") return "";
  if (login.length < LOGIN_MIN_LENGTH) {
    return currentLang === "en" ? "Login must be at least 3 characters." : "Логин должен быть от 3 символов.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return currentLang === "en" ? "Password must be at least 12 characters." : "Пароль должен быть от 12 символов.";
  }
  if (!ALNUM_RE.test(login) || !ALNUM_RE.test(password)) {
    return currentLang === "en"
      ? "Use only A-Z, a-z, and 0-9 for registration."
      : "Для регистрации используйте только A-Z, a-z и 0-9.";
  }
  return "";
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.loginError.textContent = "";
  const form = new FormData(event.currentTarget);
  const login = String(form.get("login") || "");
  const password = String(form.get("password") || "");
  const validationError = authValidationMessage("login", login, password);
  if (validationError) {
    els.loginError.textContent = validationError;
    return;
  }
  const turnstileToken = turnstileResponseToken();
  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ login, password, turnstileToken }),
    });
    session = { user: data.user };
    closeLogin();
    renderHeader();
    navigate(`/user/${data.user.uid}`);
    showToast(t("welcome"));
  } catch (error) {
    els.loginError.textContent = error.message;
    resetTurnstile();
  }
});

els.registerBtn?.addEventListener("click", async () => {
  els.loginError.textContent = "";
  if (!els.loginForm.reportValidity()) return;
  const form = new FormData(els.loginForm);
  const login = String(form.get("login") || "");
  const password = String(form.get("password") || "");
  const validationError = authValidationMessage("register", login, password);
  if (validationError) {
    els.loginError.textContent = validationError;
    return;
  }
  const turnstileToken = turnstileResponseToken();
  try {
    const data = await api("/api/register", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
        language: currentLang,
        turnstileToken,
      }),
    });
    session = { user: data.user };
    closeLogin();
    renderHeader();
    navigate(`/user/${data.user.uid}`);
    showToast(t("registeredWelcome"));
  } catch (error) {
    els.loginError.textContent = error.message;
    resetTurnstile();
  }
});

els.logoutBtn.addEventListener("click", openLogoutConfirm);
els.logoutConfirmBackdrop?.addEventListener("click", closeLogoutConfirm);
els.cancelLogoutBtn?.addEventListener("click", closeLogoutConfirm);
els.confirmLogoutBtn?.addEventListener("click", () => {
  performLogout().catch((error) => showToast(error.message));
});
els.passwordToggle?.addEventListener("click", () => {
  setPasswordVisibility(els.passwordInput?.type !== "text");
  els.passwordInput?.focus();
});

els.heroAccountBtn.addEventListener("click", () => (session?.user ? navigate(`/user/${session.user.uid}`) : openLogin()));
els.supportAccountBtn.addEventListener("click", () => (session?.user ? navigate(`/user/${session.user.uid}`) : openLogin()));
els.forumBackHomeBtn?.addEventListener("click", () => navigate("/"));
els.forumCreateHeroBtn?.addEventListener("click", () => {
  if (!session?.user) {
    openLogin();
    showToast(t("forumSignIn"));
    return;
  }
  if (!/^\/(?:forum|configs)\/?$/.test(window.location.pathname)) navigate("/configs");
  requestAnimationFrame(() => document.querySelector(".forum-create-card")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" }));
});
els.forumMyPostsBtn?.addEventListener("click", () => {
  if (!session?.user) {
    openLogin();
    showToast(t("forumSignIn"));
    return;
  }
  navigate("/configs?filter=mine");
});
els.modalBackdrop.addEventListener("click", closeLogin);
els.closeLogin.addEventListener("click", closeLogin);
els.closeMedia?.addEventListener("click", closeMediaViewer);
els.mediaBackdrop?.addEventListener("click", closeMediaViewer);
els.backHomeBtn.addEventListener("click", () => navigate("/"));
els.refreshBtn.addEventListener("click", refreshUserPage);
els.buyQuickBtn.addEventListener("click", () => activateTab("shop"));
els.profileShopBtn?.addEventListener("click", () => activateTab("shop"));
els.shopNavBtn?.addEventListener("click", openShop);
els.languageToggle?.addEventListener("click", () => setLanguage(currentLang === "ru" ? "en" : "ru"));
els.productsPrev?.addEventListener("click", () => els.productGrid.scrollBy({ left: -360, behavior: "smooth" }));
els.productsNext?.addEventListener("click", () => els.productGrid.scrollBy({ left: 360, behavior: "smooth" }));

document.querySelectorAll(".tab[data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

document.querySelectorAll("[data-forum-filter]").forEach((button) => {
  button.addEventListener("click", () => renderForumList(button.dataset.forumFilter).catch((error) => showToast(error.message)));
});

document.addEventListener("click", handleAnchorClick);

document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-media-src]");
  if (!opener || opener.closest("#mediaModal")) return;
  openMediaViewer(opener.dataset.mediaSrc, opener.dataset.mediaType, opener.dataset.mediaTitle);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLogoutConfirm();
    closeMediaViewer();
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") return;
  const opener = event.target.closest?.("[data-media-src]");
  if (!opener) return;
  event.preventDefault();
  openMediaViewer(opener.dataset.mediaSrc, opener.dataset.mediaType, opener.dataset.mediaTitle);
});

window.addEventListener("popstate", renderRoute);
window.addEventListener("resize", () => {
  syncSmoothScrollMode();
  updateScrollEffects();
  updatePointerEffects();
  setupParticles();
  setupInteractiveMotion();
  updateParticles(true);
  document.querySelectorAll(".smooth-choice").forEach((group) => {
    positionSmoothChoice(group, group.querySelector("button.active"));
  });
});
window.addEventListener("load", () => {
  syncSmoothScrollMode();
  refreshSmoothScroll(true);
  window.setTimeout(() => refreshSmoothScroll(true), 700);
});
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
  syncSmoothScrollMode();
  setupParticles();
});

applyStaticLanguage();
setupVisualEffects();
Promise.all([bootstrapProducts(), bootstrapSession(), bootstrapPublicConfig()]).finally(() => {
  setupReveal();
  renderRoute();
  syncSmoothScrollMode();
  revealVisible();
  refreshSmoothScroll(true);
  requestAnimationFrame(() => {
    refreshSmoothScroll(true);
    scrollToCurrentHash();
  });
  window.setTimeout(() => refreshSmoothScroll(true), 900);
});
