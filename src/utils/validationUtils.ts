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
 * パスワードの強度レベル
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

/**
 * パスワードの強度を判定
 * @param password - 検証するパスワード
 * @returns パスワードの強度レベル
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'weak';

  let score = 0;
  
  // 長さによるスコア
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // 大文字を含む
  if (/[A-Z]/.test(password)) score += 1;
  
  // 小文字を含む
  if (/[a-z]/.test(password)) score += 1;
  
  // 数字を含む
  if (/\d/.test(password)) score += 1;
  
  // 特殊文字を含む
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // 複数の特殊文字を含む
  if ((password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
};

/**
 * パスワードの強度検証（強化版）
 * @param password - 検証するパスワード
 * @param minLength - 最小文字数（デフォルト: 8）
 * @param requireStrong - 強力なパスワードを必須にするか（デフォルト: true）
 * @returns 検証結果
 */
export const validatePasswordStrength = (
  password: string,
  minLength: number = 8,
  requireStrong: boolean = true
): { 
  isValid: boolean; 
  message?: string; 
  strength?: PasswordStrength;
  requirements?: {
    length: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
} => {
  if (!password) {
    return { isValid: false, message: 'パスワードが必要です' };
  }

  // 長さチェック
  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `パスワードは${minLength}文字以上必要です`,
      strength: 'weak'
    };
  }

  // 各要件をチェック
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const requirements = {
    length: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChars
  };

  // 強度を判定
  const strength = getPasswordStrength(password);

  // 強力なパスワードを必須にする場合
  if (requireStrong) {
    const missingRequirements: string[] = [];
    
    if (!hasUpperCase) missingRequirements.push('大文字');
    if (!hasLowerCase) missingRequirements.push('小文字');
    if (!hasNumbers) missingRequirements.push('数字');
    if (!hasSpecialChars) missingRequirements.push('特殊文字');

    if (missingRequirements.length > 0) {
      return {
        isValid: false,
        message: `パスワードには以下の文字を含める必要があります: ${missingRequirements.join('、')}`,
        strength,
        requirements
      };
    }

    // 強度が弱い場合は追加の警告
    if (strength === 'weak' || strength === 'medium') {
      return {
        isValid: false,
        message: 'パスワードの強度が不十分です。より長いパスワードや、より多くの種類の文字を使用してください。',
        strength,
        requirements
      };
    }
  }

  // 推奨事項がある場合のメッセージ
  let message: string | undefined;
  if (strength === 'medium') {
    message = 'パスワードの強度を向上させるには、特殊文字を追加したり、長さを増やすことをお勧めします。';
  } else if (strength === 'strong' || strength === 'very-strong') {
    message = undefined; // 強力なパスワードにはメッセージ不要
  }

  return {
    isValid: true,
    message,
    strength,
    requirements
  };
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

