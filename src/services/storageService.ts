/**
 * Supabase Storageを使用したアイコン画像管理サービス
 * フォールバック機能により、Storage未設定時もローカルパスで動作
 */

import { supabase } from './supabaseClient';

// キャッシュ用のMap（メモリ内キャッシュ）
const iconUrlCache = new Map<string, string>();

// Storageバケット名
const STORAGE_BUCKET = 'icons';

/**
 * アイコンのURLを取得（Supabase Storage優先、失敗時はローカルパスにフォールバック）
 * @param iconName - アイコン名（例: 'html5', 'react'）
 * @param filename - ファイル名（例: 'html5.svg'）- オプショナル、指定がない場合はiconName + '.svg'を使用
 * @returns アイコンのURL（Storage URL または ローカルパス）
 */
export const getIconUrl = async (
  iconName: string,
  filename?: string
): Promise<string> => {
  // キャッシュキー
  const cacheKey = iconName;
  
  // キャッシュチェック
  if (iconUrlCache.has(cacheKey)) {
    return iconUrlCache.get(cacheKey)!;
  }

  // ファイル名が指定されていない場合は、iconName + '.svg'を使用
  const iconFilename = filename || `${iconName}.svg`;
  
  // ローカルパス（フォールバック用）
  const localPath = `${import.meta.env.BASE_URL}icons/${iconFilename}`;

  try {
    // Supabase Storageから公開URLを取得（getPublicUrlは同期的に動作）
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(iconFilename);

    // Storage URLを取得できた場合
    if (data?.publicUrl) {
      const storageUrl = data.publicUrl;
      iconUrlCache.set(cacheKey, storageUrl);
      return storageUrl;
    }

    // URLが取得できない場合はローカルパスにフォールバック
    iconUrlCache.set(cacheKey, localPath);
    return localPath;
  } catch (err) {
    // 予期しないエラーの場合もローカルパスにフォールバック
    iconUrlCache.set(cacheKey, localPath);
    return localPath;
  }
};

/**
 * キャッシュをクリア（主にテスト用）
 */
export const clearIconUrlCache = (): void => {
  iconUrlCache.clear();
};

/**
 * 特定のアイコンのキャッシュを削除
 * @param iconName - キャッシュを削除するアイコン名
 */
export const removeIconUrlCache = (iconName: string): void => {
  iconUrlCache.delete(iconName);
};
