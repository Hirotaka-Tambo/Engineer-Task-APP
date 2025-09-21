# 🚀 Task Management App (Notion-like Sidebar)

本アプリは、個人・グループ・チーム単位でのタスク管理を行うWebアプリです。  
UIは **Notion** を参考にし、タスクの登録・管理・カレンダー表示・モーダルでの詳細編集をサポートします。  
バックエンドは **Supabase** を利用し、ログイン認証とDB管理を行います。

---

## 📂 機能一覧

### サイドバー
- Project Name
- Solo Task
- Group Task
- Team Task
- 管理者ページへの遷移

### Todoリスト（管理者ページを除く共通）
- カードコンポーネントとしてタスクを表示
- 入力フォーム  
  - input（タスク名）
  - 優先順位
  - 締切
  - 言語
- グリッド表示
- タスクカードクリックでモーダル表示
- タブ切り替え（カード一覧 / カレンダー表示）

### モーダル要素
- タスク名 (title)
- 担当者
- 締切日 / 優先度
- 詳細メモ欄（編集可能）
- 関連URL（例: GitHub Issue）

### 締切デザイン（優先度色分け）
- **赤:** 締切3日以内
- **青:** 締切7日以内
- **黄:** 締切8日以上

### ログイン/ログアウト機能
- プロジェクトコード
- ユーザーID
- パスワード
- 未登録プロジェクト → 右下に新規登録リンク

---

## 🗄️ Supabase (DB)

### ユーザーテーブル
| カラム名          | 型            | 説明 |
|------------------|--------------|------|
| id               | Primary Key  | ユーザーID |
| project_code     | text         | プロジェクトコード |
| user_id          | text         | ユーザー識別子 |
| hashed_password  | text         | ハッシュ化済みパスワード |
| salt             | text         | ソルト |
| role             | text         | 権限 (admin, member等) |

### ToDoリストテーブル
| カラム名        | 型           | 説明 |
|----------------|-------------|------|
| id             | Primary Key | タスクID |
| title          | text        | タスク名 |
| priority       | int         | 優先順位 |
| language_logo  | text        | 言語ロゴ（React/Java等） |
| deadline       | date        | 締切日 |

### 認証
- Supabase Auth
- 「Googleで続ける」などの外部認証を想定

---

## 📁 ディレクトリ構成 (React)/後述




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
