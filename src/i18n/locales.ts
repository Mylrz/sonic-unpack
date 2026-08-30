import { SupportedLanguage } from '../types/settings';

export interface TranslationDict {
  // Common & Header
  appName: string;
  appSubtitle: string;
  version: string;
  offlineBadge: string;
  offlineDesc: string;
  
  // Sidebar
  navTitle: string;
  tabConvert: string;
  tabHistory: string;
  tabSettings: string;

  // Convert View
  dropTitle: string;
  dropSubtitle: string;
  selectFolder: string;
  listTitle: string;
  fileCount: string;
  addFiles: string;
  statusReady: string;
  statusDecoding: string;
  statusConverting: string;
  statusCompleted: string;
  statusFailed: string;
  actionListen: string;
  actionOpenFolder: string;
  actionRemove: string;
  unknownArtist: string;
  unknownAlbum: string;

  // Format selector
  formatAuto: string;
  formatMp3: string;
  formatFlac: string;
  formatOgg: string;
  formatWav: string;

  // Bottom Bar
  batchFormatLabel: string;
  clearList: string;
  convertingStatus: string;
  completedSummary: string;
  allCompletedSummary: string;
  failedCountSuffix: string;
  btnStartConvert: string;
  btnConverting: string;
  btnFinished: string;
  btnDownloadZip: string;

  // History View
  historyTitle: string;
  historySummary: string;
  searchPlaceholder: string;
  emptyHistoryTitle: string;
  emptyHistoryDesc: string;
  emptySearchTitle: string;
  emptySearchDesc: string;
  locateFile: string;
  deleteRecord: string;
  exportHistory: string;
  clearHistory: string;

  // Settings View
  settingsTitle: string;
  settingsSubtitle: string;
  appearanceSection: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  accentColorSection: string;
  languageSection: string;
  languageDesc: string;
  
  conversionSection: string;
  defaultFormatLabel: string;
  defaultFormatDesc: string;
  defaultOutputFolderLabel: string;
  changeFolderBtn: string;
  defaultDownloadDirText: string;

  tagsSection: string;
  keepMetadataLabel: string;
  keepMetadataDesc: string;
  keepCoverLabel: string;
  keepCoverDesc: string;
  exportLrcLabel: string;
  exportLrcDesc: string;
  autoOpenFolderLabel: string;
  autoOpenFolderDesc: string;

  // Naming & Organization
  namingSection: string;
  namingTemplateLabel: string;
  namingTemplateDesc: string;
  autoOrganizeFoldersLabel: string;
  autoOrganizeFoldersDesc: string;

  // Conflict handling
  conflictSection: string;
  conflictStrategyLabel: string;
  conflictRename: string;
  conflictOverwrite: string;
  conflictSkip: string;

  watcherSection: string;
  enableWatcherLabel: string;
  enableWatcherDesc: string;
  watchPathLabel: string;
  watchPathUnset: string;
  selectWatchDirBtn: string;

  aboutSection: string;
  aboutDesc: string;
  supportedFormatsTitle: string;
  engineStatusTitle: string;
  engineStatusReady: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  'zh-CN': {
    appName: 'SonicUnpack 音乐转换站',
    appSubtitle: '音乐格式解密与转换',
    version: 'v1.0',
    offlineBadge: '离线纯本地模式',
    offlineDesc: '所有解密与转换均在本地毫秒级完成，不上传任何音频文件。',

    navTitle: '导航',
    tabConvert: '转换',
    tabHistory: '历史记录',
    tabSettings: '设置',

    dropTitle: '拖入音乐文件',
    dropSubtitle: '或点击选择文件，支持批量多选与文件夹',
    selectFolder: '选择整目录导入',
    listTitle: '待转换列表',
    fileCount: '个文件',
    addFiles: '添加文件',
    statusReady: '待转换',
    statusDecoding: '解密中',
    statusConverting: '转码中',
    statusCompleted: '完成',
    statusFailed: '失败',
    actionListen: '试听播放',
    actionOpenFolder: '打开所在文件夹',
    actionRemove: '移除',
    unknownArtist: '未知歌手',
    unknownAlbum: '未知专辑',

    formatAuto: '原样还原 (推荐)',
    formatMp3: 'MP3 (高兼容)',
    formatFlac: 'FLAC (无损)',
    formatOgg: 'OGG',
    formatWav: 'WAV (无损PCM)',

    batchFormatLabel: '批量格式:',
    clearList: '清空列表',
    convertingStatus: '正在转换',
    completedSummary: '已完成 {completed} / {total} 首',
    allCompletedSummary: '全部转换完成 ({completed} 首)',
    failedCountSuffix: '首失败',
    btnStartConvert: '开始转换',
    btnConverting: '转换中...',
    btnFinished: '转换完毕',
    btnDownloadZip: '打包下载 (.ZIP)',

    historyTitle: '转换历史记录',
    historySummary: '共记录 {count} 条已转换歌曲',
    searchPlaceholder: '搜索歌曲或歌手...',
    emptyHistoryTitle: '暂无历史记录',
    emptyHistoryDesc: '成功转换的音乐文件将自动在此处归档',
    emptySearchTitle: '未找到匹配的转换记录',
    emptySearchDesc: '尝试更换关键词搜索',
    locateFile: '定位文件',
    deleteRecord: '删除记录',
    exportHistory: '导出记录',
    clearHistory: '清空记录',

    settingsTitle: '偏好设置',
    settingsSubtitle: '定制语言、外观视觉风格、命名规则、默认转换策略及目录监听',
    appearanceSection: '外观模式',
    themeLight: '浅色模式',
    themeDark: '深色模式',
    themeSystem: '跟随系统',
    accentColorSection: '主题强调色 (低饱和灰白桌面风格)',
    languageSection: '系统语言 (Language)',
    languageDesc: '选择软件界面显示语言，支持即时切换',

    conversionSection: '转换策略与输出',
    defaultFormatLabel: '默认输出格式',
    defaultFormatDesc: '推荐选择“原样还原”，无损 FLAC 则输出 FLAC，MP3 则输出 MP3，零音质折损',
    defaultOutputFolderLabel: '默认保存位置',
    changeFolderBtn: '更改目录',
    defaultDownloadDirText: '默认下载目录',

    tagsSection: '音频标签与自动化',
    keepMetadataLabel: '保留原始音频信息',
    keepMetadataDesc: '自动将歌曲名、歌手、专辑名称注入 ID3 / Vorbis 标签',
    keepCoverLabel: '内嵌专辑封面',
    keepCoverDesc: '提取原加密文件中封装的高清封面并内嵌至音频文件',
    exportLrcLabel: '独立导出 .lrc 歌词文件',
    exportLrcDesc: '若原文件包含歌词，在输出音频同目录下生成独立 LRC 歌词',
    autoOpenFolderLabel: '转换完成后自动打开输出文件夹',
    autoOpenFolderDesc: '所有歌曲转换完毕后自动唤起系统资源管理器或 Finder',

    namingSection: '文件命名与分级归档',
    namingTemplateLabel: '文件命名规则',
    namingTemplateDesc: '自定义输出文件名的模板组合格式',
    autoOrganizeFoldersLabel: '按“歌手/专辑”自动分级创建文件夹',
    autoOrganizeFoldersDesc: '输出为 歌手/专辑/歌曲名.flac 结构，方便直接拷入车载U盘或Hi-Fi播放器',

    conflictSection: '重名文件冲突策略',
    conflictStrategyLabel: '当目标文件已存在时',
    conflictRename: '自动重命名 (添加序号)',
    conflictOverwrite: '直接覆盖旧文件',
    conflictSkip: '跳过不转换',

    watcherSection: '目录监听自动化 (网易云/QQ音乐下载目录监控)',
    enableWatcherLabel: '启用下载目录后台监控',
    enableWatcherDesc: '开启后，只要有新的加密音乐文件下载到监控目录，即可自动检测并转换',
    watchPathLabel: '监控目录',
    watchPathUnset: '未指定目录',
    selectWatchDirBtn: '选择监控目录',

    aboutSection: '关于与引擎信息',
    aboutDesc: 'SonicUnpack 是一款基于 Tauri 与 WebAssembly 技术构建的高性能本地音频解锁与转换工具。',
    supportedFormatsTitle: '支持的加密格式',
    engineStatusTitle: '解密内核状态',
    engineStatusReady: '原生内核就绪 (Active & Ready)',
  },

  'zh-TW': {
    appName: 'SonicUnpack 音樂轉換站',
    appSubtitle: '音樂格式解密與轉換',
    version: 'v1.0',
    offlineBadge: '離線純本機模式',
    offlineDesc: '所有解密與轉換均在本機毫秒級完成，不需上傳任何音訊檔案。',

    navTitle: '導覽',
    tabConvert: '轉換',
    tabHistory: '歷史記錄',
    tabSettings: '設定',

    dropTitle: '拖入音樂檔案',
    dropSubtitle: '或點擊選擇檔案，支援批次多選與資料夾',
    selectFolder: '選擇整目錄匯入',
    listTitle: '待轉換清單',
    fileCount: '個檔案',
    addFiles: '加入檔案',
    statusReady: '待轉換',
    statusDecoding: '解密中',
    statusConverting: '轉碼中',
    statusCompleted: '完成',
    statusFailed: '失敗',
    actionListen: '試聽播放',
    actionOpenFolder: '開啟所在資料夾',
    actionRemove: '移除',
    unknownArtist: '未知歌手',
    unknownAlbum: '未知專輯',

    formatAuto: '原樣還原 (推薦)',
    formatMp3: 'MP3 (高相容)',
    formatFlac: 'FLAC (無損)',
    formatOgg: 'OGG',
    formatWav: 'WAV (無損PCM)',

    batchFormatLabel: '批次格式:',
    clearList: '清空清單',
    convertingStatus: '正在轉換',
    completedSummary: '已完成 {completed} / {total} 首',
    allCompletedSummary: '全部轉換完成 ({completed} 首)',
    failedCountSuffix: '首失敗',
    btnStartConvert: '開始轉換',
    btnConverting: '轉換中...',
    btnFinished: '轉換完畢',
    btnDownloadZip: '打包下載 (.ZIP)',

    historyTitle: '轉換歷史記錄',
    historySummary: '共記錄 {count} 筆已轉換歌曲',
    searchPlaceholder: '搜尋歌曲或歌手...',
    emptyHistoryTitle: '暫無歷史記錄',
    emptyHistoryDesc: '成功轉換的音樂檔案將自動在此處封存',
    emptySearchTitle: '未找到符合的轉換記錄',
    emptySearchDesc: '嘗試更換關鍵字搜尋',
    locateFile: '定位檔案',
    deleteRecord: '刪除記錄',
    exportHistory: '匯出記錄',
    clearHistory: '清空記錄',

    settingsTitle: '偏好設定',
    settingsSubtitle: '自訂語言、外觀視覺風格、命名規則、預設轉換策略及目錄監聽',
    appearanceSection: '外觀模式',
    themeLight: '淺色模式',
    themeDark: '深色模式',
    themeSystem: '跟隨系統',
    accentColorSection: '主題強調色 (低飽和灰白桌面風格)',
    languageSection: '系統語言 (Language)',
    languageDesc: '選擇軟體介面顯示語言，支援即時切換',

    conversionSection: '轉換策略與輸出',
    defaultFormatLabel: '預設輸出格式',
    defaultFormatDesc: '推薦選擇「原樣還原」，無損 FLAC 則輸出 FLAC，MP3 則輸出 MP3，零音質折損',
    defaultOutputFolderLabel: '預設儲存位置',
    changeFolderBtn: '更改目錄',
    defaultDownloadDirText: '預設下載目錄',

    tagsSection: '音訊標籤與自動化',
    keepMetadataLabel: '保留原始音訊資訊',
    keepMetadataDesc: '自動將歌曲名、歌手、專輯名稱寫入 ID3 / Vorbis 標籤',
    keepCoverLabel: '內嵌專輯封面',
    keepCoverDesc: '擷取原加密檔案中封裝的高解析封面並內嵌至音訊檔案',
    exportLrcLabel: '獨立匯出 .lrc 歌詞檔',
    exportLrcDesc: '若原檔案包含歌詞，在輸出音訊同目錄下產生獨立 LRC 歌詞',
    autoOpenFolderLabel: '轉換完成後自動開啟輸出資料夾',
    autoOpenFolderDesc: '所有歌曲轉換完畢後自動喚起系統檔案總管或 Finder',

    namingSection: '檔案命名與分級歸檔',
    namingTemplateLabel: '檔案命名規則',
    namingTemplateDesc: '自訂輸出檔案名稱的格式範本',
    autoOrganizeFoldersLabel: '按「歌手/專輯」自動分級建立資料夾',
    autoOrganizeFoldersDesc: '輸出為 歌手/專輯/歌曲名.flac 結構，方便直接存入車載USB或播放器',

    conflictSection: '重名檔案衝突策略',
    conflictStrategyLabel: '當目標檔案已存在時',
    conflictRename: '自動重新命名 (附加序號)',
    conflictOverwrite: '直接覆蓋舊檔案',
    conflictSkip: '略過不轉換',

    watcherSection: '目錄監聽自動化 (網易雲/QQ音樂下載目錄監控)',
    enableWatcherLabel: '啟用下載目錄背景監控',
    enableWatcherDesc: '開啟後，只要有新的加密音樂檔案下載到監控目錄，即可自動偵測並轉換',
    watchPathLabel: '監控目錄',
    watchPathUnset: '未指定目錄',
    selectWatchDirBtn: '選擇監控目錄',

    aboutSection: '關於與引擎資訊',
    aboutDesc: 'SonicUnpack 是一款基於 Tauri 與 WebAssembly 技術打造的高性能本機音訊解鎖與轉換工具。',
    supportedFormatsTitle: '支援的加密格式',
    engineStatusTitle: '解密核心狀態',
    engineStatusReady: '原生核心就緒 (Active & Ready)',
  },

  'en-US': {
    appName: 'SonicUnpack Music Studio',
    appSubtitle: 'Audio Decryption & Format Converter',
    version: 'v1.0',
    offlineBadge: '100% Offline Local Mode',
    offlineDesc: 'All decryption and conversion runs locally in milliseconds. Zero files uploaded.',

    navTitle: 'Navigation',
    tabConvert: 'Converter',
    tabHistory: 'History',
    tabSettings: 'Settings',

    dropTitle: 'Drop audio files here',
    dropSubtitle: 'or click to browse. Batch files and folder import supported.',
    selectFolder: 'Import Entire Folder',
    listTitle: 'Queue List',
    fileCount: 'files',
    addFiles: 'Add Files',
    statusReady: 'Ready',
    statusDecoding: 'Decoding',
    statusConverting: 'Converting',
    statusCompleted: 'Done',
    statusFailed: 'Failed',
    actionListen: 'Preview Audio',
    actionOpenFolder: 'Reveal in Folder',
    actionRemove: 'Remove',
    unknownArtist: 'Unknown Artist',
    unknownAlbum: 'Unknown Album',

    formatAuto: 'Restore Original (Recommended)',
    formatMp3: 'MP3 (Universal)',
    formatFlac: 'FLAC (Lossless)',
    formatOgg: 'OGG',
    formatWav: 'WAV (PCM)',

    batchFormatLabel: 'Batch Format:',
    clearList: 'Clear All',
    convertingStatus: 'Converting',
    completedSummary: 'Completed {completed} / {total} tracks',
    allCompletedSummary: 'All {completed} tracks converted successfully',
    failedCountSuffix: 'failed',
    btnStartConvert: 'Start Conversion',
    btnConverting: 'Converting...',
    btnFinished: 'Completed',
    btnDownloadZip: 'Download All (.ZIP)',

    historyTitle: 'Conversion History',
    historySummary: '{count} tracks recorded in history',
    searchPlaceholder: 'Search song title or artist...',
    emptyHistoryTitle: 'No conversion history',
    emptyHistoryDesc: 'Successfully converted music files will appear here.',
    emptySearchTitle: 'No matching records found',
    emptySearchDesc: 'Try searching with a different keyword.',
    locateFile: 'Locate File',
    deleteRecord: 'Delete',
    exportHistory: 'Export JSON',
    clearHistory: 'Clear History',

    settingsTitle: 'Preferences',
    settingsSubtitle: 'Customize language, themes, naming rules, conversion defaults, and directory monitoring.',
    appearanceSection: 'Appearance',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    themeSystem: 'System Sync',
    accentColorSection: 'Accent Theme (Minimalist Palette)',
    languageSection: 'Language',
    languageDesc: 'Select user interface language. Takes effect immediately.',

    conversionSection: 'Conversion & Output',
    defaultFormatLabel: 'Default Output Format',
    defaultFormatDesc: '“Restore Original” preserves lossless FLAC or 320k MP3 without re-encoding quality loss.',
    defaultOutputFolderLabel: 'Default Output Folder',
    changeFolderBtn: 'Change Folder',
    defaultDownloadDirText: 'Default Downloads Directory',

    tagsSection: 'Metadata & Automation',
    keepMetadataLabel: 'Preserve Audio Tags',
    keepMetadataDesc: 'Injects song title, artist, album names into ID3 / Vorbis tags.',
    keepCoverLabel: 'Embed Album Artwork',
    keepCoverDesc: 'Extracts and embeds HD album covers directly into the audio file.',
    exportLrcLabel: 'Export Separate .lrc Lyrics',
    exportLrcDesc: 'Generates companion LRC file if lyrics exist in the source.',
    autoOpenFolderLabel: 'Auto Reveal Output Folder on Complete',
    autoOpenFolderDesc: 'Automatically opens Finder or File Explorer when all tasks finish.',

    namingSection: 'File Naming & Organization',
    namingTemplateLabel: 'File Naming Rule',
    namingTemplateDesc: 'Custom template structure for output audio filenames',
    autoOrganizeFoldersLabel: 'Organize into "Artist/Album" Folders',
    autoOrganizeFoldersDesc: 'Automatically outputs into Artist/Album/Song.flac directory structure for car audio or DAPs',

    conflictSection: 'File Conflict Resolution',
    conflictStrategyLabel: 'When destination file already exists',
    conflictRename: 'Auto Rename (Add numeric suffix)',
    conflictOverwrite: 'Overwrite Existing',
    conflictSkip: 'Skip File',

    watcherSection: 'Directory Watcher Automation',
    enableWatcherLabel: 'Enable Background Download Watcher',
    enableWatcherDesc: 'Automatically detects and decrypts new audio files placed in the watch directory.',
    watchPathLabel: 'Monitored Directory',
    watchPathUnset: 'No directory selected',
    selectWatchDirBtn: 'Choose Folder',

    aboutSection: 'About & Engine Status',
    aboutDesc: 'SonicUnpack is a high-performance offline audio decrypter and tagger built with Tauri and modern Web technologies.',
    supportedFormatsTitle: 'Supported Encrypted Formats',
    engineStatusTitle: 'Decryption Engine',
    engineStatusReady: 'Native Engine Ready (Active & Ready)',
  },

  'ja-JP': {
    appName: 'SonicUnpack 音楽変換',
    appSubtitle: '音楽フォーマット復号＆変換',
    version: 'v1.0',
    offlineBadge: '完全オフライン・ローカル動作',
    offlineDesc: 'すべての復号と変換はローカルでミリ秒単位で完了します。アップロードは一切行われません。',

    navTitle: 'ナビゲーション',
    tabConvert: '変換',
    tabHistory: '履歴',
    tabSettings: '設定',

    dropTitle: '音楽ファイルをドラッグ＆ドロップ',
    dropSubtitle: 'またはクリックしてファイルを選択（複数選択・フォルダ対応）',
    selectFolder: 'フォルダを一括選択',
    listTitle: '変換待ちリスト',
    fileCount: '個のファイル',
    addFiles: 'ファイル追加',
    statusReady: '待機中',
    statusDecoding: '復号中',
    statusConverting: '変換中',
    statusCompleted: '完了',
    statusFailed: '失敗',
    actionListen: '試聴する',
    actionOpenFolder: 'フォルダを開く',
    actionRemove: '削除',
    unknownArtist: '不明なアーティスト',
    unknownAlbum: '不明なアルバム',

    formatAuto: '原音復元 (推奨)',
    formatMp3: 'MP3 (高互換)',
    formatFlac: 'FLAC (可逆圧縮)',
    formatOgg: 'OGG',
    formatWav: 'WAV (非圧縮PCM)',

    batchFormatLabel: '一括フォーマット:',
    clearList: 'リストを空にする',
    convertingStatus: '変換実行中',
    completedSummary: '{completed} / {total} 曲 完了',
    allCompletedSummary: '全 {completed} 曲 変換完了',
    failedCountSuffix: '曲 失敗',
    btnStartConvert: '変換開始',
    btnConverting: '変換中...',
    btnFinished: '完了',
    btnDownloadZip: '一括ZIPダウンロード',

    historyTitle: '変換履歴',
    historySummary: '合計 {count} 曲の変換履歴',
    searchPlaceholder: '曲名やアーティストを検索...',
    emptyHistoryTitle: '履歴はありません',
    emptyHistoryDesc: '変換に成功した音楽ファイルがここに記録されます。',
    emptySearchTitle: '一致する履歴が見つかりません',
    emptySearchDesc: 'キーワードを変えて検索してください。',
    locateFile: 'ファイルを表示',
    deleteRecord: '履歴を削除',
    exportHistory: 'JSON出力',
    clearHistory: '履歴をクリア',

    settingsTitle: '環境設定',
    settingsSubtitle: '言語、外観テーマ、命名規則、変換ルール、フォルダ監視のカスタマイズ',
    appearanceSection: '外観モード',
    themeLight: 'ライトモード',
    themeDark: 'ダークモード',
    themeSystem: 'システム同期',
    accentColorSection: 'アクセントカラー（落ち着いたデスクトップ調）',
    languageSection: '言語設定 (Language)',
    languageDesc: '表示言語を選択します。即時に適用されます。',

    conversionSection: '変換ルール＆保存先',
    defaultFormatLabel: 'デフォルト出力形式',
    defaultFormatDesc: '「原音復元」が推奨です。無劣化のままFLACまたはMP3を抽出します。',
    defaultOutputFolderLabel: 'デフォルト保存フォルダ',
    changeFolderBtn: 'フォルダ変更',
    defaultDownloadDirText: 'ダウンロードフォルダ',

    tagsSection: 'メタデータ＆自動化',
    keepMetadataLabel: '曲情報を保持する',
    keepMetadataDesc: 'タイトル・アーティスト・アルバム情報をID3 / Vorbisタグに書き込みます。',
    keepCoverLabel: 'アルバムアートワークを埋め込む',
    keepCoverDesc: '暗号化ファイル内の高画質ジャケット画像を自動抽出し埋め込みます。',
    exportLrcLabel: '.lrc 歌詞ファイルを個別出力',
    exportLrcDesc: '歌詞データが存在する場合、同名LRCファイルを自動生成します。',
    autoOpenFolderLabel: '変換完了時に出力先を開く',
    autoOpenFolderDesc: 'すべてのタスクが終了した際にFinder / Explorerを自動表示します。',

    namingSection: 'ファイル名とフォルダ整理',
    namingTemplateLabel: '命名ルール',
    namingTemplateDesc: '出力ファイル名のフォーマットテンプレート',
    autoOrganizeFoldersLabel: '「アーティスト/アルバム」フォルダで自動分類',
    autoOrganizeFoldersDesc: 'アーティスト/アルバム/曲名.flac の階層構造で出力し、車載やDAPへの移行をスムーズにします',

    conflictSection: '重複ファイルの処理',
    conflictStrategyLabel: '同名ファイルが存在する場合',
    conflictRename: '連番を付けて別名保存',
    conflictOverwrite: '既存ファイルを上書き',
    conflictSkip: 'スキップ（変換しない）',

    watcherSection: 'フォルダ自動監視 (ダウンロードフォルダ監視)',
    enableWatcherLabel: 'バックグラウンド監視を有効にする',
    enableWatcherDesc: '指定フォルダに新しい暗号化音楽が追加された際に自動で変換します。',
    watchPathLabel: '監視フォルダ',
    watchPathUnset: '未設定',
    selectWatchDirBtn: 'フォルダ選択',

    aboutSection: 'アプリ情報＆エンジン',
    aboutDesc: 'SonicUnpackはTauriとWeb技術をベースにした高速かつセキュアなローカル音楽変換ツールです。',
    supportedFormatsTitle: '対応している暗号化形式',
    engineStatusTitle: '復号エンジン状態',
    engineStatusReady: 'ネイティブエンジン準備完了 (Active & Ready)',
  },

  'ko-KR': {
    appName: 'SonicUnpack 음악 변환기',
    appSubtitle: '음악 포맷 복호화 및 변환',
    version: 'v1.0',
    offlineBadge: '100% 오프라인 로컬 모드',
    offlineDesc: '모든 복호화와 변환은 로컬에서 수 밀리초 만에 처리되며 외부로 업로드되지 않습니다.',

    navTitle: '내비게이션',
    tabConvert: '변환',
    tabHistory: '기록',
    tabSettings: '설정',

    dropTitle: '음악 파일을 드래그하여 놓으세요',
    dropSubtitle: '또는 클릭하여 파일 선택 (다중 파일 및 폴더 지원)',
    selectFolder: '폴더 단위로 가져오기',
    listTitle: '변환 대기 목록',
    fileCount: '개 파일',
    addFiles: '파일 추가',
    statusReady: '대기 중',
    statusDecoding: '복호화 중',
    statusConverting: '변환 중',
    statusCompleted: '완료',
    statusFailed: '실패',
    actionListen: '미리듣기',
    actionOpenFolder: '폴더 열기',
    actionRemove: '제거',
    unknownArtist: '알 수 없는 아티스트',
    unknownAlbum: '알 수 없는 앨범',

    formatAuto: '원본 그대로 복원 (권장)',
    formatMp3: 'MP3 (높은 호환성)',
    formatFlac: 'FLAC (무손실)',
    formatOgg: 'OGG',
    formatWav: 'WAV (무손실 PCM)',

    batchFormatLabel: '일괄 포맷:',
    clearList: '목록 비우기',
    convertingStatus: '변환 중',
    completedSummary: '{completed} / {total} 곡 완료',
    allCompletedSummary: '전체 {completed} 곡 변환 완료',
    failedCountSuffix: '곡 실패',
    btnStartConvert: '변환 시작',
    btnConverting: '변환 중...',
    btnFinished: '완료됨',
    btnDownloadZip: '일괄 ZIP 다운로드',

    historyTitle: '변환 기록',
    historySummary: '총 {count} 건의 변환 기록',
    searchPlaceholder: '곡명 또는 아티스트 검색...',
    emptyHistoryTitle: '기록이 없습니다',
    emptyHistoryDesc: '성공적으로 변환된 음악 파일이 여기에 기록됩니다.',
    emptySearchTitle: '일치하는 기록을 찾을 수 없습니다',
    emptySearchDesc: '다른 검색어로 검색해 보세요.',
    locateFile: '파일 위치',
    deleteRecord: '삭제',
    exportHistory: 'JSON 내보내기',
    clearHistory: '기록 비우기',

    settingsTitle: '환경 설정',
    settingsSubtitle: '언어, 테마 스타일, 명명 규칙, 기본 변환 정책 및 폴더 모니터링 설정',
    appearanceSection: '테마 모드',
    themeLight: '라이트 모드',
    themeDark: '다크 모드',
    themeSystem: '시스템 동기화',
    accentColorSection: '강조 색상 (미니멀 데스크톱 팔레트)',
    languageSection: '시스템 언어 (Language)',
    languageDesc: '인터페이스 표시 언어를 선택합니다. 즉시 적용됩니다.',

    conversionSection: '변환 정책 및 출력',
    defaultFormatLabel: '기본 출력 포맷',
    defaultFormatDesc: '“원본 그대로 복원”을 권장합니다. 무손실 FLAC 또는 MP3를 음질 손실 없이 추출합니다.',
    defaultOutputFolderLabel: '기본 저장 위치',
    changeFolderBtn: '폴더 변경',
    defaultDownloadDirText: '기본 다운로드 폴더',

    tagsSection: '오디오 태그 및 자동화',
    keepMetadataLabel: '원본 오디오 정보 유지',
    keepMetadataDesc: '곡명, 아티스트, 앨범 정보를 ID3 / Vorbis 태그에 자동 주입합니다.',
    keepCoverLabel: '앨범 아트워크 포함',
    keepCoverDesc: '암호화 파일에 내장된 고화질 커버 이미지를 추출하여 오디오에 포함합니다.',
    exportLrcLabel: '별도 .lrc 가사 파일 내보내기',
    exportLrcDesc: '가사 정보가 있는 경우 같은 폴더에 독립된 LRC 가사 파일을 생성합니다.',
    autoOpenFolderLabel: '변환 완료 시 출력 폴더 자동 열기',
    autoOpenFolderDesc: '모든 곡 변환이 완료되면 시스템 탐색기 또는 Finder를 자동으로 엽니다.',

    namingSection: '파일 명명 및 폴더 정리',
    namingTemplateLabel: '파일 명명 규칙',
    namingTemplateDesc: '출력 오디오 파일 이름에 적용할 템플릿',
    autoOrganizeFoldersLabel: '“아티스트/앨범” 폴더 자동 생성',
    autoOrganizeFoldersDesc: '아티스트/앨범/곡명.flac 구조로 출력하여 차량용 USB나 DAP 복사를 편리하게 합니다',

    conflictSection: '중복 파일 충돌 해결',
    conflictStrategyLabel: '대상 파일이 이미 존재하는 경우',
    conflictRename: '자동 이름 바꾸기 (번호 추가)',
    conflictOverwrite: '기존 파일 덮어쓰기',
    conflictSkip: '변환 건너뛰기',

    watcherSection: '폴더 모니터링 자동화',
    enableWatcherLabel: '다운로드 폴더 백그라운드 모니터링',
    enableWatcherDesc: '새로운 암호화 파일이 감지되면 자동으로 감지하여 변환합니다.',
    watchPathLabel: '모니터링 경로',
    watchPathUnset: '지정되지 않음',
    selectWatchDirBtn: '폴더 선택',

    aboutSection: '앱 정보 및 엔진',
    aboutDesc: 'SonicUnpack은 Tauri와 최신 웹 기술 기반의 초고속 로컬 오디오 복호화 도구입니다.',
    supportedFormatsTitle: '지원 암호화 포맷',
    engineStatusTitle: '복호화 엔진 상태',
    engineStatusReady: '네이티브 엔진 준비됨 (Active & Ready)',
  }
};
