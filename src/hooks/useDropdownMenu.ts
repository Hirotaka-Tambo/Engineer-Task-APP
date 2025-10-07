import { useState, useEffect } from 'react';

/**
 * ドロップダウンメニューの開閉状態を管理するhook
 * クリック外を検知して自動的にメニューを閉じる
 * @returns openDropdownId, toggleDropdown, closeDropdown
 */
export const useDropdownMenu = () => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  /**
   * ドロップダウンの開閉を切り替え
   */
  const toggleDropdown = (id: string) => {
    setOpenDropdownId(prev => prev === id ? null : id);
  };

  /**
   * ドロップダウンを閉じる
   */
  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  // ドロップダウン外をクリックした時に閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) {
        closeDropdown();
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return { openDropdownId, toggleDropdown, closeDropdown };
};

