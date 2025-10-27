/**
 * SVGアイコンを安全にレンダリングするためのユーティリティ
 */

import DOMPurify from 'dompurify';

/**
 * SVG文字列をサニタイズして安全なSVG文字列を返す
 * @param svgString - SVG文字列
 * @returns サニタイズされたSVG文字列またはnull
 */
export const sanitizeSvgIcon = (svgString: string): string | null => {
  if (!svgString || typeof svgString !== 'string') {
    return null;
  }

  try {
    // DOMPurifyを使用した安全なサニタイゼーション
    const sanitized = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true },
      ADD_TAGS: ['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'],
      ADD_ATTR: ['xmlns', 'viewBox', 'd', 'stroke', 'fill', 'stroke-width', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry'],
      KEEP_CONTENT: true,
    });

    // SVG要素のみを許可
    if (!sanitized.includes('<svg')) {
      return null;
    }

    // サニタイズされたSVG文字列を返す
    return sanitized;
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('SVGサニタイズエラー:', error);
    }
    return null;
  }
};