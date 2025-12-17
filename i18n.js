// i18n Translation System
const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.note': 'Note',
    'nav.documents': 'Documents',
    'nav.saved': 'Saved',
    'nav.logo': 'Travel Vibe',
    
    // Hero
    'hero.title': 'My Travel Adventure',
    'hero.subtitle': 'Select dates to begin',
    
    // Date Navigation
    'date.months': ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    
    // Day Card
    'day.badge': 'Day',
    'day.prev': 'Previous',
    'day.next': 'Next',
    
    // Footer
    'footer.export': 'Export Schedule',
    'footer.import': 'Import Schedule',
    'footer.reset': 'Reset Default',
    'footer.reconfig': 'Reconfigure',
    'footer.copyright': '© 2024 Travel Vibe',
    
    // Edit Modal
    'modal.edit.title': 'Edit Schedule',
    'modal.add.title': 'Add Schedule',
    'modal.startTime': 'Start Time',
    'modal.endTime': 'End Time (Optional)',
    'modal.title': 'Title',
    'modal.area': 'Area/District (for top tag)',
    'modal.areaPlaceholder': 'e.g., Hongdae, Myeongdong (leave empty if not needed)',
    'modal.icon': 'Icon Class',
    'modal.iconPlaceholder': 'e.g., fa-solid fa-utensils',
    'modal.iconColor': 'Icon Color',
    'modal.tag': 'Tag',
    'modal.tagPlaceholder': 'e.g., Food, Shopping',
    'modal.mapQuery': 'Google Maps Search Keywords',
    'modal.mapPlaceholder': 'Leave empty to use title',
    'modal.description': 'Description',
    'modal.cost': 'Cost',
    'modal.currency': 'Currency',
    'modal.links': 'Reference Links (Optional)',
    'modal.addLink': 'Add Link',
    'modal.linkTitle': 'Title (e.g., Reference Link)',
    'modal.linkUrl': 'URL',
    'modal.delete': 'Delete',
    'modal.cancel': 'Cancel',
    'modal.save': 'Save Changes',
    'modal.navigation': 'Navigation',
    
    // Setup Wizard
    'setup.title': 'Trip Setup Wizard',
    'setup.step1.title': 'Step 1: Basic Information',
    'setup.step1.tripTitle': 'Trip Title *',
    'setup.step1.tripTitlePlaceholder': 'e.g., Winter in Seoul',
    'setup.step1.location': 'Location/Theme',
    'setup.step1.locationPlaceholder': 'e.g., Seoul, Tokyo, Paris',
    'setup.step1.startDate': 'Start Date *',
    'setup.step1.endDate': 'End Date *',
    'setup.step1.next': 'Next',
    
    'setup.step2.title': 'Step 2: Background Media',
    'setup.step2.bgType': 'Choose Background Type',
    'setup.step2.video': 'Video',
    'setup.step2.image': 'Image',
    'setup.step2.color': 'Solid Color',
    'setup.step2.upload': 'Upload Background Media',
    'setup.step2.uploadHelp': 'Support video (MP4, WebM) or image (JPG, PNG, WebP)',
    'setup.step2.chooseColor': 'Choose Background Color',
    'setup.step2.prev': 'Previous',
    'setup.step2.next': 'Next',
    
    'setup.step3.title': 'Step 3: Import Schedule',
    'setup.step3.upload': 'Upload Schedule File (Optional)',
    'setup.step3.uploadHelp': 'You can import a previously exported schedule file, or create manually later',
    'setup.step3.createEmpty': 'If no file uploaded, create empty schedule',
    'setup.step3.prev': 'Previous',
    'setup.step3.complete': 'Complete Setup',
    
    // Validation Messages
    'validation.tripTitle': 'Please enter trip title',
    'validation.startDate': 'Please select start date',
    'validation.endDate': 'Please select end date',
    'validation.dateRange': 'End date cannot be earlier than start date',
    'validation.noMedia': 'You selected {type} background but did not upload a file.\n\nContinue? (Will use solid color background)',
    'validation.videoType': 'video',
    'validation.imageType': 'image',
    
    // Empty State
    'empty.title': 'No Schedule Yet',
    'empty.subtitle': 'Please complete the setup wizard or import a schedule file',
    
    // Confirm Messages
    'confirm.reset': 'Are you sure you want to reset? This will clear all settings and schedules.',
    'confirm.delete': 'Are you sure you want to delete this schedule item?',
    'confirm.reconfig': 'Are you sure you want to reconfigure the trip? This will clear current settings and schedule.',
    
    // Alert Messages
    'alert.importError': 'Failed to import schedule file',
    'alert.saveError': 'Failed to save schedule',
    'alert.scheduleFormatError': 'Schedule file format error',
  },
  
  zh: {
    // Navbar
    'nav.home': '首頁',
    'nav.note': '筆記',
    'nav.documents': '文件',
    'nav.saved': '已儲存',
    'nav.logo': '旅程精靈',
    
    // Hero
    'hero.title': '我的旅行冒險',
    'hero.subtitle': '選擇日期開始',
    
    // Date Navigation
    'date.months': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    
    // Day Card
    'day.badge': 'Day',
    'day.prev': '上一天',
    'day.next': '下一天',
    
    // Footer
    'footer.export': '匯出行程',
    'footer.import': '匯入行程',
    'footer.reset': '重置預設',
    'footer.reconfig': '重新設定',
    'footer.copyright': '© 2024 旅程精靈',
    
    // Edit Modal
    'modal.edit.title': '編輯行程',
    'modal.add.title': '新增行程',
    'modal.startTime': '開始時間',
    'modal.endTime': '結束時間 (選填)',
    'modal.title': '標題',
    'modal.area': '地區/商圈 (用於頂部標籤)',
    'modal.areaPlaceholder': '例如: 弘大, 明洞 (留空則不顯示)',
    'modal.icon': '圖示類別',
    'modal.iconPlaceholder': '例如: fa-solid fa-utensils',
    'modal.iconColor': '圖示顏色',
    'modal.tag': '標籤',
    'modal.tagPlaceholder': '例如: 美食, 購物',
    'modal.mapQuery': 'Google Map 搜尋關鍵字',
    'modal.mapPlaceholder': '留空則使用標題搜尋',
    'modal.description': '描述',
    'modal.cost': '費用',
    'modal.currency': '貨幣',
    'modal.links': '參考連結 (選填)',
    'modal.addLink': '新增連結',
    'modal.linkTitle': '標題 (例如: 參考連結)',
    'modal.linkUrl': '網址',
    'modal.delete': '刪除',
    'modal.cancel': '取消',
    'modal.save': '儲存變更',
    'modal.navigation': '導航',
    
    // Setup Wizard
    'setup.title': '旅程設定精靈',
    'setup.step1.title': '步驟 1: 基本資訊',
    'setup.step1.tripTitle': '旅程標題 *',
    'setup.step1.tripTitlePlaceholder': '例如: Winter in Seoul',
    'setup.step1.location': '地點/主題',
    'setup.step1.locationPlaceholder': '例如: Seoul, Tokyo, Paris',
    'setup.step1.startDate': '開始日期 *',
    'setup.step1.endDate': '結束日期 *',
    'setup.step1.next': '下一步',
    
    'setup.step2.title': '步驟 2: 背景媒體',
    'setup.step2.bgType': '選擇背景類型',
    'setup.step2.video': '影片',
    'setup.step2.image': '圖片',
    'setup.step2.color': '純色背景',
    'setup.step2.upload': '上傳背景媒體',
    'setup.step2.uploadHelp': '支援影片 (MP4, WebM) 或圖片 (JPG, PNG, WebP)',
    'setup.step2.chooseColor': '選擇背景顏色',
    'setup.step2.prev': '上一步',
    'setup.step2.next': '下一步',
    
    'setup.step3.title': '步驟 3: 匯入行程',
    'setup.step3.upload': '上傳行程檔案 (選填)',
    'setup.step3.uploadHelp': '可選擇匯入之前匯出的行程檔案，或稍後手動建立',
    'setup.step3.createEmpty': '如未上傳檔案，建立空白行程表',
    'setup.step3.prev': '上一步',
    'setup.step3.complete': '完成設定',
    
    // Validation Messages
    'validation.tripTitle': '請輸入旅程標題',
    'validation.startDate': '請選擇開始日期',
    'validation.endDate': '請選擇結束日期',
    'validation.dateRange': '結束日期不能早於開始日期',
    'validation.noMedia': '您選擇了{type}背景但未上傳檔案。\n\n是否繼續？（將使用純色背景）',
    'validation.videoType': '影片',
    'validation.imageType': '圖片',
    
    // Empty State
    'empty.title': '尚未建立行程',
    'empty.subtitle': '請完成設定精靈或匯入行程檔案',
    
    // Confirm Messages
    'confirm.reset': '確定要重置嗎？這將清除所有設定和行程。',
    'confirm.delete': '確定要刪除這個行程項目嗎？',
    'confirm.reconfig': '確定要重新設定旅程嗎？這將清除目前的設定和行程。',
    
    // Alert Messages
    'alert.importError': '匯入行程檔案失敗',
    'alert.saveError': '儲存行程失敗',
    'alert.scheduleFormatError': '行程檔案格式錯誤',
  }
};

// Current language
let currentLang = localStorage.getItem('language') || 'zh';

// Get translation
function t(key, replacements = {}) {
  let text = translations[currentLang][key] || translations['en'][key] || key;
  
  // Replace placeholders like {type}
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return text;
}

// Apply translations to the page
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      }
    } else {
      // Preserve child elements like icons
      const icon = element.querySelector('i');
      if (icon) {
        element.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = translation;
          }
        });
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'en';
}

// Switch language
function switchLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    
    // Update language button
    updateLanguageButton();
  }
}

// Update language button text
function updateLanguageButton() {
  const langBtn = document.getElementById('languageToggle');
  if (langBtn) {
    langBtn.innerHTML = currentLang === 'zh' 
      ? '<i class="fa-solid fa-language"></i> EN' 
      : '<i class="fa-solid fa-language"></i> 中文';
  }
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLanguageButton();
});
