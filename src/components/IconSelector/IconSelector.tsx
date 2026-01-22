import React, { useState, useEffect } from 'react';
import { getIconUrl } from '../../services/storageService';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

// 利用可能なアイコンのリスト（アルファベット順、全43個）
const availableIcons = [
  { name: 'angular', label: 'Angular', filename: 'angular.svg' },
  { name: 'aws', label: 'AWS', filename: 'aws.svg' },
  { name: 'bootstrap', label: 'Bootstrap', filename: 'bootstrap.svg' },
  { name: 'cpp', label: 'C++', filename: 'cpp.svg' },
  { name: 'csharp', label: 'C#', filename: 'csharp.svg' },
  { name: 'css3', label: 'CSS3', filename: 'css3.svg' },
  { name: 'dart', label: 'Dart', filename: 'dart.svg' },
  { name: 'django', label: 'Django', filename: 'django.svg' },
  { name: 'docker', label: 'Docker', filename: 'docker.svg' },
  { name: 'express', label: 'Express', filename: 'express.svg' },
  { name: 'figma', label: 'Figma', filename: 'figma.svg' },
  { name: 'flutter', label: 'Flutter', filename: 'flutter.svg' },
  { name: 'git', label: 'Git', filename: 'git.svg' },
  { name: 'github', label: 'GitHub', filename: 'github.svg' },
  { name: 'go', label: 'Go', filename: 'go.svg' },
  { name: 'html5', label: 'HTML5', filename: 'html5.svg' },
  { name: 'java', label: 'Java', filename: 'java.svg' },
  { name: 'javascript', label: 'JavaScript', filename: 'javascript.svg' },
  { name: 'jest', label: 'Jest', filename: 'jest.svg' },
  { name: 'kotlin', label: 'Kotlin', filename: 'kotlin.svg' },
  { name: 'mongodb', label: 'MongoDB', filename: 'mongodb.svg' },
  { name: 'mysql', label: 'MySQL', filename: 'mysql.svg' },
  { name: 'nextjs', label: 'Next.js', filename: 'nextjs.svg' },
  { name: 'nodejs', label: 'Node.js', filename: 'nodejs.svg' },
  { name: 'npm', label: 'npm', filename: 'npm.svg' },
  { name: 'nuxtjs', label: 'Nuxt.js', filename: 'nuxtjs.svg' },
  { name: 'php', label: 'PHP', filename: 'php.svg' },
  { name: 'postgresql', label: 'PostgreSQL', filename: 'postgresql.svg' },
  { name: 'python', label: 'Python', filename: 'python.svg' },
  { name: 'react', label: 'React', filename: 'react.svg' },
  { name: 'redux', label: 'Redux', filename: 'redux.svg' },
  { name: 'ruby', label: 'Ruby', filename: 'ruby.svg' },
  { name: 'rust', label: 'Rust', filename: 'rust.svg' },
  { name: 'sass', label: 'Sass', filename: 'sass.svg' },
  { name: 'spring', label: 'Spring', filename: 'spring.svg' },
  { name: 'swift', label: 'Swift', filename: 'swift.svg' },
  { name: 'tailwindcss', label: 'Tailwind CSS', filename: 'tailwindcss.svg' },
  { name: 'typescript', label: 'TypeScript', filename: 'typescript.svg' },
  { name: 'vite', label: 'Vite', filename: 'vite.svg' },
  { name: 'vue', label: 'Vue.js', filename: 'vue.svg' },
  { name: 'vscode', label: 'VS Code', filename: 'vscode.svg' },
  { name: 'webpack', label: 'Webpack', filename: 'webpack.svg' },
  { name: 'yarn', label: 'Yarn', filename: 'yarn.svg' },
];

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect }) => {
  // アイコンURLのマップ（iconName -> URL）
  const [iconUrls, setIconUrls] = useState<Map<string, string>>(new Map());

  // コンポーネントマウント時にすべてのアイコンのURLを取得
  useEffect(() => {
    const loadIconUrls = async () => {
      const urlMap = new Map<string, string>();
      
      // すべてのアイコンのURLを並列で取得
      const urlPromises = availableIcons.map(async (icon) => {
        const url = await getIconUrl(icon.name, icon.filename);
        return { name: icon.name, url };
      });
      
      const results = await Promise.all(urlPromises);
      results.forEach(({ name, url }) => {
        urlMap.set(name, url);
      });
      
      setIconUrls(urlMap);
    };

    loadIconUrls();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
          {availableIcons.map((icon) => {
            // アイコンURLを取得（まだ取得中の場合もフォールバックURLを使用）
            const iconUrl = iconUrls.get(icon.name) || `${import.meta.env.BASE_URL}icons/${icon.filename}`;
            
            return (
              <button
                key={icon.name}
                onClick={() => onIconSelect(icon.name)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors duration-200 ${
                  selectedIcon === icon.name
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
                style={{ minWidth: '80px' }}
              >
                <img 
                  src={iconUrl}
                  alt={icon.label}
                  className="w-8 h-8 mb-2"
                  onError={(e) => {
                    // 画像が読み込めない場合のフォールバック
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs text-gray-600 text-center leading-tight font-semibold">
                  {icon.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default IconSelector;