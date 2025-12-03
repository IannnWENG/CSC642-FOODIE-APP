// 繁體中文翻譯
const zhTW = {
  // App
  app: {
    title: '美食追蹤器',
    subtitle: '探索你的下一頓美食',
    footer: '由 AI 和 Google Maps 提供支援'
  },

  // Common
  common: {
    loading: '載入中...',
    search: '搜尋',
    close: '關閉',
    done: '完成',
    clear: '清除',
    cancel: '取消',
    confirm: '確認',
    save: '儲存',
    delete: '刪除',
    view: '查看',
    back: '返回',
    next: '下一步',
    skip: '跳過',
    all: '全部',
    found: '個結果',
    yes: '是',
    no: '否',
    error: '錯誤',
    retry: '重試',
    logout: '登出',
    login: '登入',
    signUp: '註冊'
  },

  // Navigation
  nav: {
    ai: 'AI',
    saved: '收藏',
    history: '歷史',
    update: '更新',
    locate: '定位',
    exit: '離開',
    help: '說明',
    profile: '個人',
    tour: '導覽'
  },

  // Location Controls
  location: {
    found: '已取得位置',
    findNearby: '探索附近',
    enableLocation: '啟用定位以探索周邊餐廳',
    gettingLocation: '正在取得位置...',
    updateMyLocation: '📍 更新我的位置',
    getMyLocation: '🎯 取得我的位置',
    pleaseGetLocation: '請先取得您的位置'
  },

  // Search
  search: {
    nearby: '附近',
    searchMode: '搜尋',
    placeholder: '搜尋餐廳、咖啡廳...',
    recent: '最近搜尋',
    suggestions: '建議',
    findPlaces: '尋找餐廳',
    searching: '搜尋中...',
    type: '類型',
    distance: '距離',
    price: '價格'
  },

  // Place Types
  placeTypes: {
    restaurant: '餐廳',
    cafe: '咖啡廳',
    bakery: '麵包店',
    takeaway: '外帶'
  },

  // Map
  map: {
    exploreMap: '探索地圖',
    live: '即時',
    yourLocation: '您的位置',
    high: '高分 (70+)',
    medium: '中等 (50-69)',
    low: '較低 (<50)'
  },

  // Recommendations
  recommendations: {
    forYou: '為您推薦',
    quickView: '快速預覽',
    findingPlaces: '正在尋找餐廳...',
    call: '📞 撥打電話',
    website: '🌐 官方網站'
  },

  // Login Modal
  login: {
    welcomeBack: '歡迎回來',
    signInContinue: '登入以繼續您的美食之旅',
    email: '電子郵件',
    password: '密碼',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    demoAccount: '測試帳號',
    signingIn: '登入中...',
    signIn: '登入',
    newHere: '還沒有帳號？',
    createAccount: '建立帳號',
    loginFailed: '登入失敗',
    loginError: '登入時發生錯誤'
  },

  // Register Modal
  register: {
    createAccountTitle: '建立帳號',
    startDiscovering: '開始探索美味的餐廳',
    name: '姓名',
    namePlaceholder: '您的姓名',
    confirmPassword: '確認密碼',
    confirmPasswordPlaceholder: '再次輸入密碼',
    minCharacters: '至少 6 個字元',
    creatingAccount: '建立帳號中...',
    createAccountBtn: '建立帳號',
    alreadyHaveAccount: '已經有帳號了？',
    signInLink: '登入',
    passwordsNotMatch: '兩次輸入的密碼不一致',
    registrationFailed: '註冊失敗',
    registrationError: '註冊時發生錯誤'
  },

  // Favorites
  favorites: {
    myFavorites: '我的收藏',
    favoritePlaces: '個收藏的地點',
    restaurants: '餐廳',
    cafes: '咖啡廳',
    others: '其他',
    noFavorites: '尚無收藏的地點',
    startExploring: '開始探索並收藏您喜歡的餐廳！',
    clearAll: '清除全部',
    confirmClear: '確定要清除所有收藏嗎？',
    removeFromFavorites: '從收藏中移除'
  },

  // History
  history: {
    title: '搜尋歷史',
    searches: '次搜尋',
    noHistory: '尚無搜尋歷史',
    searchesAppear: '您的搜尋記錄將顯示在這裡',
    clearHistory: '清除所有歷史記錄？'
  },

  // Help Modal
  help: {
    userGuide: '使用指南',
    quickStart: '快速開始',
    features: '功能特色',
    usageTips: '使用技巧',
    recommendationScore: '推薦評分',
    mapLegend: '地圖圖例',
    importantNotes: '注意事項',
    getStarted: '開始使用',

    // Steps
    step1Title: '取得位置',
    step1Desc: '點擊「取得位置」按鈕，允許瀏覽器存取您的位置資訊。這是搜尋附近餐廳的必要步驟。',
    step2Title: '設定搜尋條件',
    step2Desc: '選擇搜尋範圍（500 公尺至 5 公里）、地點類型（餐廳、咖啡廳等）和價格區間。',
    step3Title: '查看 AI 推薦',
    step3Desc: '系統會根據評分、距離、價格等因素智慧排序，在地圖和列表中顯示推薦結果。',
    step4Title: '收藏地點',
    step4Desc: '點擊地點查看詳細資訊，您可以將喜歡的餐廳加入收藏，方便日後查看。',
    step5Title: '導航至目的地',
    step5Desc: '在詳細頁面點擊「導航」按鈕，即可開啟 Google Maps 導航至該地點。',

    // Features
    feature1Title: 'AI 智慧推薦',
    feature1Desc: '根據評分、距離、價格、評論數量等多項因素計算推薦分數',
    feature2Title: '情境感知',
    feature2Desc: '根據時間和天氣自動調整推薦（例如：早餐時段推薦咖啡廳）',
    feature3Title: '個人化學習',
    feature3Desc: '系統會學習您的偏好，提供更精準的推薦',
    feature4Title: '多種搜尋類型',
    feature4Desc: '支援餐廳、咖啡廳、麵包店、外帶等多種美食類型',
    feature5Title: '詳細資訊',
    feature5Desc: '提供完整資訊，包括營業時間、聯絡方式、評論、照片等',
    feature6Title: '收藏管理',
    feature6Desc: '儲存喜愛的地點，建立個人美食清單',

    // Tips
    tip1: '建議在搜尋前先取得準確的位置資訊',
    tip2: '可以嘗試不同的搜尋範圍來發現更多選擇',
    tip3: '查看詳細資訊時，會自動載入最新的營業時間和評論',
    tip4: '收藏的地點儲存在瀏覽器中，下次開啟仍可查看',
    tip5: '推薦分數越高，表示越值得嘗試',
    tip6: '您可以與朋友分享喜歡的餐廳',

    // Score explanation
    scoreExplanation: 'AI 系統根據以下因素計算分數：',
    rating: '評分 (40%)',
    ratingDesc: 'Google 評分和評論',
    distance: '距離 (30%)',
    distanceDesc: '與您的距離',
    priceLabel: '價格 (20%)',
    priceDesc: '$ 到 $$$',
    reviews: '評論數 (10%)',
    reviewsDesc: '評論總數',

    // Notes
    note1: '需要瀏覽器定位權限',
    note2: '建議使用 HTTPS 以確保安全',
    note3: '餐廳資訊來自 Google Places API',
    note4: '營業時間可能不是最新的',
    note5: '資料儲存在瀏覽器中'
  },

  // Onboarding Tour
  tour: {
    // Welcome
    welcomeTitle: "歡迎使用美食追蹤器！🍽️",
    welcomeDesc: "您的 AI 美食探索夥伴。讓我們快速導覽，幫助您開始發現美味的餐廳！",
    
    // Steps
    step1Title: "第一步：取得您的位置 📍",
    step1Desc: "首先，點擊此按鈕啟用定位服務。這將幫助我們找到您附近的餐廳。需要定位時按鈕會閃爍！",
    
    step2Title: "第二步：選擇搜尋模式 🔍",
    step2Desc: "切換「附近」進行快速探索，或使用「搜尋」按名稱尋找特定的餐廳、料理或菜餚。",
    
    step3Title: "第三步：設定您的偏好 ⚙️",
    step3Desc: "使用篩選器自訂搜尋！選擇餐廳類型（餐廳、咖啡廳、麵包店）、距離（500 公尺到 5 公里）和價格區間（$-$$$）。",
    
    step4Title: "第四步：開始搜尋 🚀",
    step4Desc: "設定好偏好後，點擊此按鈕尋找餐廳。我們的 AI 將分析並為您排名最佳選擇！",
    
    mapTitle: "互動地圖 🗺️",
    mapDesc: "搜尋結果會以彩色標記顯示在地圖上。綠色（70+）= 優秀，橙色（50-69）= 良好，灰色（<50）= 普通。點擊任何標記查看詳情！",
    
    recommendationsTitle: "AI 推薦 ⭐",
    recommendationsDesc: "瀏覽由 AI 排名的精選餐廳列表。每張卡片顯示分數、評分、距離和價格。點擊查看完整詳情！",
    
    aiAssistantTitle: "AI 助手 🤖",
    aiAssistantDesc: "需要個人化推薦？與我們的 AI 助手聊天！詢問料理類型、獲取菜餚建議或比較餐廳。",
    
    favoritesTitle: "儲存收藏 ❤️",
    favoritesDesc: "找到喜歡的餐廳？將它加入收藏！隨時從此按鈕查看您儲存的餐廳。",
    
    historyTitle: "搜尋歷史 📜",
    historyDesc: "查看您過去的搜尋記錄，快速重訪發現過的地點。您的歷史記錄會在本地儲存以便存取。",
    
    menuFeatureTitle: "探索餐廳菜單 📋",
    menuFeatureDesc: "查看餐廳詳情時，點擊菜單圖示可以看到可用的菜餚。我們的 AI 甚至可以根據菜單推薦菜餚！",
    
    completeTitle: "準備就緒！🎉",
    completeDesc: "這就是您需要知道的一切！開始探索，發現您的下一間最愛餐廳。祝用餐愉快！",
    
    // Mobile specific
    mobileWelcomeTitle: "歡迎使用美食追蹤器！🍽️",
    mobileWelcomeDesc: "您的 AI 美食探索夥伴，針對手機優化！讓我們快速導覽這個應用程式。",
    
    touchGesturesTitle: "觸控手勢 👆",
    touchGesturesDesc: "這個應用程式專為觸控設計！點擊卡片查看詳情，滑動列表捲動，在地圖上使用捏合手勢縮放。",
    
    bottomNavTitle: "底部導航列 📱",
    bottomNavDesc: "您的主要控制項位於螢幕底部，方便拇指操作。所有主要功能只需一次點擊！",
    
    mobileLocationTitle: "定位按鈕 📍",
    mobileLocationDesc: "中間的大按鈕！點擊它取得您的位置。需要定位時會顯示橙色脈動，找到位置後變成藍色。",
    
    searchOptionsTitle: "搜尋選項 🔍",
    searchOptionsDesc: "切換「附近」進行快速探索，或「搜尋」輸入您想吃的。在下方設定您偏好的距離和價格區間！",
    
    filterSearchTitle: "篩選搜尋 ⚙️",
    filterSearchDesc: "選擇距離（500 公尺 - 5 公里）和價格區間（$-$$$）。點擊任何選項選取。您的選擇會影響 AI 推薦！",
    
    findPlacesTitle: "尋找餐廳按鈕 🚀",
    findPlacesDesc: "設定好偏好後，點擊此按鈕。我們的 AI 將為您找到並排名最佳餐廳！",
    
    swipeResultsTitle: "滑動瀏覽結果 📋",
    swipeResultsDesc: "捲動瀏覽 AI 排名的餐廳。每張卡片顯示分數、評分、距離和價格。點擊任何卡片查看完整詳情、評論和菜單！",
    
    mobileMapTitle: "互動地圖 🗺️",
    mobileMapDesc: "捏合縮放，拖曳平移！彩色標記顯示餐廳分數：綠色 = 優秀（70+），橙色 = 良好（50-69），灰色 = 普通。",
    
    mobileAiTitle: "AI 聊天助手 🤖",
    mobileAiDesc: "點擊 AI 按鈕聊天！詢問推薦、比較餐廳或獲取菜餚建議。您的個人美食顧問！",
    
    mobileFavoritesTitle: "收藏的地點 ❤️",
    mobileFavoritesDesc: "點擊查看您儲存的餐廳。在任何餐廳詳情頁面點擊愛心圖示加入收藏！",
    
    mobileHistoryTitle: "搜尋歷史 📜",
    mobileHistoryDesc: "快速存取您過去的搜尋。非常適合重訪之前發現的地點！",
    
    proTipsTitle: "手機進階技巧 💡",
    proTipsDesc: "• 下拉更新結果\n• 長按標記快速操作\n• 搖晃重設搜尋\n• 向左滑動卡片關閉",
    
    readyTitle: "準備探索！🎉",
    readyDesc: "您已準備就緒！首先點擊定位按鈕，然後搜尋您的下一頓美食。祝用餐愉快！",
    
    // Navigation
    step: '第',
    of: '步，共',
    getStarted: '開始使用',
    start: '開始',
    swipeToNavigate: '滑動導航',
    skipTour: '已經知道如何使用？跳過導覽',
    mobileOptimized: '手機優化導覽',
    startTour: '開始導覽'
  },

  // Language Selector
  language: {
    selectLanguage: '選擇語言',
    choosePreferred: '選擇您偏好的語言',
    english: 'English',
    chinese: '繁體中文',
    continue: '繼續'
  },

  // AI Chat
  aiChat: {
    title: 'AI 助手',
    placeholder: '問我任何關於美食的問題...',
    send: '傳送',
    thinking: '思考中...'
  },

  // Profile
  profile: {
    title: '個人檔案',
    level: '等級',
    levelNewbie: '新手',
    levelFoodie: '美食家',
    levelExplorer: '探索者',
    levelExpert: '專家',
    levelMaster: '大師',
    
    // Tabs
    tabOverview: '總覽',
    tabActivity: '活動',
    tabAchievements: '成就',
    
    // Stats
    searches: '搜尋次數',
    placesViewed: '瀏覽餐廳',
    favorites: '收藏數',
    aiChats: 'AI 對話',
    menusViewed: '菜單瀏覽',
    navigations: '導航次數',
    
    // Account Info
    accountInfo: '帳戶資訊',
    email: '電子郵件',
    memberSince: '加入時間',
    accountAge: '帳戶天數',
    days: '天',
    
    // Activity
    loginStreak: '連續登入',
    best: '最佳紀錄',
    recentActivity: '最近活動',
    noActivity: '尚無活動記錄',
    justNow: '剛剛',
    minutesAgo: '分鐘前',
    hoursAgo: '小時前',
    daysAgo: '天前',
    
    // Categories
    topCategories: '最愛類別',
    
    // Achievements
    achievementsUnlocked: '已解鎖成就',
    achievementFirstSearch: '初次搜尋',
    achievementFirstSearchDesc: '完成第一次搜尋',
    achievementExplorer: '探索家',
    achievementExplorerDesc: '完成 10 次搜尋',
    achievementCollector: '收藏家',
    achievementCollectorDesc: '收藏 5 間餐廳',
    achievementAIFriend: 'AI 好友',
    achievementAIFriendDesc: '與 AI 對話 10 次',
    achievementNavigator: '導航員',
    achievementNavigatorDesc: '導航前往 5 個地點',
    achievementStreakMaster: '連續達人',
    achievementStreakMasterDesc: '連續登入 7 天'
  },

  // Place Details
  placeDetails: {
    rating: '評分',
    reviews: '評論',
    openNow: '營業中',
    closed: '已打烊',
    hours: '營業時間',
    address: '地址',
    phone: '電話',
    website: '官方網站',
    navigate: '開始導航',
    addToFavorites: '加入收藏',
    removeFromFavorites: '移除收藏',
    viewMenu: '查看菜單',
    noReviews: '尚無評論',
    priceUnknown: '價格未知',
    categories: '分類',
    ratingDistribution: '評分分佈',
    showLess: '收起',
    showAllReviews: '查看所有評論',
    translate: '翻譯',
    original: '原文',
    helpful: '有幫助',
    notHelpful: '沒幫助',
    newest: '最新',
    oldest: '最舊',
    highest: '最高分',
    lowest: '最低分',
    allRatings: '所有評分',
    stars: '星'
  },

  // Error Messages
  errors: {
    locationError: '無法取得位置。請啟用定位服務。',
    searchError: '搜尋失敗。請重試。',
    networkError: '網路錯誤。請檢查您的連線。',
    genericError: '發生錯誤。請重試。',
    
    // Firebase Auth Errors
    emailInUse: '此電子郵件已被註冊',
    invalidEmail: '請輸入有效的電子郵件地址',
    weakPassword: '密碼至少需要 6 個字元',
    userDisabled: '此帳戶已被停用',
    userNotFound: '電子郵件或密碼錯誤',
    wrongPassword: '電子郵件或密碼錯誤',
    tooManyRequests: '嘗試次數過多，請稍後再試',
    allFieldsRequired: '所有欄位都是必填的'
  }
};

export default zhTW;

