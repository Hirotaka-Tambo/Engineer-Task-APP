/**
 * セキュリティ強化版入力検証ユーティリティ
 */

/**
 * HTMLタグや危険な文字列をサニタイズ
 * @param input - サニタイズする入力文字列
 * @returns サニタイズされた文字列
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // HTMLタグを除去
    .replace(/<[^>]*>/g, '')
    // JavaScriptイベントハンドラーを除去
    .replace(/on\w+\s*=/gi, '')
    // javascript:プロトコルを除去
    .replace(/javascript:/gi, '')
    // data:プロトコルを除去
    .replace(/data:text\/html/gi, '')
    // 危険な特殊文字をエスケープ
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match] || match;
    });
};

/**
 * SQLインジェクション攻撃を防ぐための検証
 * @param input - 検証する入力文字列
 * @returns 危険なパターンが含まれている場合true
 */
export const containsSQLInjectionPattern = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+[\w]+\s*=\s*[\w]+)/i,
    /('|')(\s*;\s*)?(--|#|\/\*)/i,
    /(\;\s*DROP\s+TABLE)/i,
    /(\;\s*DELETE\s+FROM)/i,
    /(\;\s*UPDATE\s+[\w]+\s+SET)/i,
    /(UNION\s+SELECT)/i,
    /(\/\*.*\*\/)/i,
    /('|')(\s*OR\s*|\s*AND\s*)/i
  ];

  return sqlInjectionPatterns.some(pattern => pattern.test(input));
};

/**
 * XSS攻撃パターンを検出
 * @param input - 検証する入力文字列
 * @returns 危険なパターンが含まれている場合true
 */
export const containsXSSPattern = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\(/gi,
    /<style[^>]*>.*?<\/style>/gi
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * 文字列長の検証
 * @param input - 検証する文字列
 * @param minLength - 最小文字数
 * @param maxLength - 最大文字数
 * @returns 検証結果
 */
export const validateStringLength = (
  input: string,
  minLength: number,
  maxLength: number
): { isValid: boolean; message?: string } => {
  if (!input) {
    return { isValid: false, message: '入力が必要です' };
  }

  if (input.length < minLength) {
    return { isValid: false, message: `最小${minLength}文字以上必要です` };
  }

  if (input.length > maxLength) {
    return { isValid: false, message: `最大${maxLength}文字以内にしてください` };
  }

  return { isValid: true };
};

/**
 * メールアドレスの検証
 * @param email - 検証するメールアドレス
 * @returns 検証結果
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'メールアドレスが必要です' };
  }

  // 基本的なメールアドレス形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '有効なメールアドレスを入力してください' };
  }

  // 危険なパターンのチェック
  if (containsXSSPattern(email) || containsSQLInjectionPattern(email)) {
    return { isValid: false, message: 'メールアドレスに不正な文字が含まれています' };
  }

  return { isValid: true };
};

/**
 * パスワードの強度検証
 * @param password - 検証するパスワード
 * @param minLength - 最小文字数（デフォルト: 8）
 * @returns 検証結果
 */
export const validatePasswordStrength = (
  password: string,
  minLength: number = 8
): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'パスワードが必要です' };
  }

  if (password.length < minLength) {
    return { isValid: false, message: `パスワードは${minLength}文字以上必要です` };
  }

  // 強力なパスワードの推奨（オプション）
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: true, 
      message: 'より強力なパスワードにするには、大文字・小文字・数字を含めてください' 
    };
  }

  return { isValid: true };
};

/**
 * URLの検証
 * @param url - 検証するURL
 * @returns 検証結果
 */
export const validateURL = (url: string): { isValid: boolean; message?: string } => {
  if (!url) {
    return { isValid: true }; // オプション項目の場合
  }

  try {
    new URL(url);
    
    // 危険なプロトコルのチェック
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
    if (dangerousProtocols.some(protocol => url.toLowerCase().startsWith(protocol))) {
      return { isValid: false, message: '不正なURLです' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, message: '有効なURLを入力してください' };
  }
};

/**
 * テキスト入力の包括的検証
 * @param input - 検証するテキスト
 * @param options - 検証オプション
 * @returns 検証結果
 */
export const validateTextInput = (
  input: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    allowHtml?: boolean;
  } = {}
): { isValid: boolean; message?: string; sanitized?: string } => {
  const {
    minLength = 0,
    maxLength = 10000,
    required = false,
    allowHtml = false
  } = options;

  // 必須チェック
  if (required && !input) {
    return { isValid: false, message: '入力が必要です' };
  }

  // オプション項目で空の場合はOK
  if (!required && !input) {
    return { isValid: true };
  }

  // SQLインジェクションチェック
  if (containsSQLInjectionPattern(input)) {
    return { isValid: false, message: '不正な文字列が検出されました' };
  }

  // XSSチェック
  if (!allowHtml && containsXSSPattern(input)) {
    return { isValid: false, message: 'HTMLタグは使用できません' };
  }

  // 長さチェック
  const lengthCheck = validateStringLength(input, minLength, maxLength);
  if (!lengthCheck.isValid) {
    return lengthCheck;
  }

  // サニタイズ（HTMLを許可しない場合）
  const sanitized = allowHtml ? input : sanitizeInput(input);

  return { isValid: true, sanitized };
};

/**
 * プロジェクト名の検証
 * @param projectName - 検証するプロジェクト名
 * @returns 検証結果
 */
export const validateProjectName = (projectName: string): { isValid: boolean; message?: string } => {
  return validateTextInput(projectName, {
    minLength: 1,
    maxLength: 50,
    required: true,
    allowHtml: false
  });
};

/**
 * タスクタイトルの検証
 * @param title - 検証するタスクタイトル
 * @returns 検証結果
 */
export const validateTaskTitle = (title: string): { isValid: boolean; message?: string } => {
  return validateTextInput(title, {
    minLength: 1,
    maxLength: 200,
    required: true,
    allowHtml: false
  });
};

/**
 * メモ欄の検証
 * @param memo - 検証するメモ
 * @returns 検証結果
 */
export const validateMemo = (memo: string): { isValid: boolean; message?: string } => {
  return validateTextInput(memo, {
    minLength: 0,
    maxLength: 5000,
    required: false,
    allowHtml: false
  });
};
