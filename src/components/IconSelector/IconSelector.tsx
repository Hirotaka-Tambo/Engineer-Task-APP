import React from 'react';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

// 利用可能なアイコンのリスト（ローカルSVGファイル使用）
const availableIcons = [
  { name: 'html5', label: 'HTML5', filename: 'html5.svg' },
  { name: 'css3', label: 'CSS3', filename: 'css3.svg' },
  { name: 'javascript', label: 'JavaScript', filename: 'javascript.svg' },
  { name: 'typescript', label: 'TypeScript', filename: 'typescript.svg' },
  { name: 'react', label: 'React', filename: 'react.svg' },
  { name: 'vue', label: 'Vue.js', filename: 'vue.svg' },
  { name: 'angular', label: 'Angular', filename: 'angular.svg' },
  { name: 'nodejs', label: 'Node.js', filename: 'nodejs.svg' },
  { name: 'nextjs', label: 'Next.js', filename: 'nextjs.svg' },
  { name: 'nuxtjs', label: 'Nuxt.js', filename: 'nuxtjs.svg' },
  { name: 'python', label: 'Python', filename: 'python.svg' },
  { name: 'django', label: 'Django', filename: 'django.svg' },
  { name: 'java', label: 'Java', filename: 'java.svg' },
  { name: 'spring', label: 'Spring', filename: 'spring.svg' },
  //{ name: 'csharp', label: 'C#', filename: 'csharp.svg' },
  //{ name: 'cpp', label: 'C++', filename: 'cpp.svg' },
  { name: 'php', label: 'PHP', filename: 'php.svg' },
  { name: 'ruby', label: 'Ruby', filename: 'ruby.svg' },
  { name: 'go', label: 'Go', filename: 'go.svg' },
  { name: 'rust', label: 'Rust', filename: 'rust.svg' },
  { name: 'swift', label: 'Swift', filename: 'swift.svg' },
  { name: 'kotlin', label: 'Kotlin', filename: 'kotlin.svg' },
  { name: 'dart', label: 'Dart', filename: 'dart.svg' },
  { name: 'flutter', label: 'Flutter', filename: 'flutter.svg' },
  //{ name: 'svelte', label: 'Svelte', filename: 'svelte.svg' },
  //{ name: 'express', label: 'Express', filename: 'express.svg' },
  //{ name: 'flask', label: 'Flask', filename: 'flask.svg' },
  //{ name: 'laravel', label: 'Laravel', filename: 'laravel.svg' },
  //{ name: 'rails', label: 'Rails', filename: 'rails.svg' },
  //{ name: 'mongodb', label: 'MongoDB', filename: 'mongodb.svg' },
  { name: 'mysql', label: 'MySQL', filename: 'mysql.svg' },
  { name: 'postgresql', label: 'PostgreSQL', filename: 'postgresql.svg' },
  //{ name: 'redis', label: 'Redis', filename: 'redis.svg' },
  //{ name: 'kubernetes', label: 'Kubernetes', filename: 'kubernetes.svg' },
  
  //{ name: 'aws', label: 'AWS', filename: 'aws.svg' },
  //{ name: 'azure', label: 'Azure', filename: 'azure.svg' },
  //{ name: 'docker', label: 'Docker', filename: 'docker.svg' },
  //{ name: 'render', label: 'render', }
  // aws,azure,docker,renderのsvg 入れてね

  //{ name: 'gcp', label: 'GCP', filename: 'gcp.svg' },
  //{ name: 'git', label: 'Git', filename: 'git.svg' },
  { name: 'github', label: 'GitHub', filename: 'github.svg' },
  //{ name: 'gitlab', label: 'GitLab', filename: 'gitlab.svg' },
  { name: 'figma', label: 'Figma', filename: 'figma.svg' },
  //{ name: 'vscode', label: 'VS Code', filename: 'vscode.svg' },
  //{ name: 'webpack', label: 'Webpack', filename: 'webpack.svg' },
  //{ name: 'vite', label: 'Vite', filename: 'vite.svg' },
  //{ name: 'tailwindcss', label: 'Tailwind CSS', filename: 'tailwindcss.svg' },
  //{ name: 'bootstrap', label: 'Bootstrap', filename: 'bootstrap.svg' },
  //{ name: 'sass', label: 'Sass', filename: 'sass.svg' },
  //{ name: 'less', label: 'Less', filename: 'less.svg' },
  //{ name: 'jquery', label: 'jQuery', filename: 'jquery.svg' },
  //{ name: 'redux', label: 'Redux', filename: 'redux.svg' },
  //{ name: 'graphql', label: 'GraphQL', filename: 'graphql.svg' },
  //{ name: 'apollo', label: 'Apollo', filename: 'apollo.svg' },
  //{ name: 'jest', label: 'Jest', filename: 'jest.svg' },
  //{ name: 'cypress', label: 'Cypress', filename: 'cypress.svg' },
  //{ name: 'storybook', label: 'Storybook', filename: 'storybook.svg' },
  //{ name: 'eslint', label: 'ESLint', filename: 'eslint.svg' },
  //{ name: 'prettier', label: 'Prettier', filename: 'prettier.svg' },
  //{ name: 'npm', label: 'npm', filename: 'npm.svg' },
  //{ name: 'yarn', label: 'Yarn', filename: 'yarn.svg' },
  //{ name: 'pnpm', label: 'pnpm', filename: 'pnpm.svg' },
];

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect }) => {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-3 pb-2" style={{ width: 'max-content' }}>
          {availableIcons.map((icon) => (
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
                src={`/icons/${icon.filename}`}
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
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default IconSelector;