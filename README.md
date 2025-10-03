# Task Management App (Notion-like Sidebar)

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

### user テーブル
| カラム名      | 型                | Nullable | 説明 |
|--------------|-------------------|----------|------
| id           | uuid (Primary Key)| No       | ユーザーID 
| user_name    | text              | No       | ユーザー名 
| email        | text              | No       | メールアドレス 
| project_id   | uuid              | Yes      | 所属プロジェクトID 
| role         | text              | Yes      | 権限 (admin, member等) 
| is_active    | boolean           | Yes      | アクティブ状態 
| created_at   | timestamptz       | Yes      | 作成日時 
| updated_at   | timestamptz       | Yes      | 更新日時 

### project テーブル
| カラム名      | 型                | Nullable | 説明 |
|--------------|-------------------|----------|------
| id           | uuid (Primary Key)| No       | プロジェクトID 
| name         | text              | No       | プロジェクト名 
| code         | text              | No       | プロジェクトコード 
| created_at   | timestamptz       | Yes      | 作成日時 
| updated_at   | timestamptz       | Yes      | 更新日時 

### project_members テーブル
| カラム名      | 型                | Nullable | 説明 |
|--------------|-------------------|----------|------
| id           | uuid (Primary Key)| No       | メンバーシップID 
| project_id   | uuid              | No       | プロジェクトID 
| user_id      | uuid              | No       | ユーザーID 
| role         | text              | Yes      | プロジェクト内での役割 
| is_active    | boolean           | Yes      | アクティブ状態 
| created_at   | timestamptz       | Yes      | 作成日時 
| updated_at   | timestamptz       | Yes      | 更新日時 

### task テーブル
| カラム名        | 型                | Nullable | 説明 |
|----------------|-------------------|----------|------
| id             | uuid (Primary Key)| No       | タスクID 
| title          | text              | No       | タスク名 
| task_status    | text              | Yes      | タスクステータス 
| priority       | int4              | Yes      | 優先順位 
| task_category  | text[]            | Yes      | タスクカテゴリ（配列） 
| icon           | text              | Yes      | アイコン 
| created_by     | uuid              | No       | 作成者ID 
| assigned_to    | uuid              | No       | 担当者ID 
| deadline       | timestamptz       | Yes      | 締切日時 
| one_line       | text              | Yes      | 一行説明 
| memo           | text              | Yes      | 詳細メモ 
| related_url    | text              | Yes      | 関連URL 
| project_id     | uuid              | No       | プロジェクトID 
| created_at     | timestamptz       | Yes      | 作成日時 
| updated_at     | timestamptz       | Yes      | 更新日時 

### 認証
- Supabase Auth
- 「Googleで続ける」などの外部認証を想定

---

## 📁 ディレクトリ構成 (React)
```
src/
│
├─ components/              # 共通コンポーネント
│  ├─ Calender/             
│  │   └─ CalenderView.tsx   # カレンダー表示コンポーネント
│  │
│  ├─ Layout/              
│  │   └─ MainLayout.tsx     # メインレイアウトコンポーネント
│  │
│  ├─ Sidebar/              
│  │   ├─ Sidebar.tsx        # サイドバーのメインコンポーネント
│  │   └─ SidebarItem.tsx    # サイドバーの各項目
│  │
│  ├─ TaskBoard/              
│  │   └─ TaskBoard.tsx      # タスクボード表示コンポーネント
│  │
│  ├─ TaskCard/              
│  │   ├─ TaskCard.tsx       # タスク表示用カード
│  │   └─ PriorityBadge.tsx  # 優先度を色で示すバッジ
│  │
│  ├─ TaskModal/             
│  │   └─ TaskModal.tsx      # タスクの詳細表示・編集用モーダル
│  │
│  ├─ TaskForm/              
│  │   └─ TaskForm.tsx       # タスクの入力・編集フォーム
│  │
│  ├─ Tabs/                  
│  │   └─ Tabs.tsx           # タブ切り替えコンポーネント
│  │
│  └─ types/                 # 型定義ファイル
│      ├─ outletContext.ts   # アウトレットコンテキストの型定義
│      ├─ project.ts         # プロジェクト関連の型定義
│      ├─ projectMember.ts   # プロジェクトメンバー関連の型定義
│      ├─ sidebar.ts         # サイドバー関連の型定義
│      ├─ task.ts            # タスク関連の型定義
│      └─ user.ts            # ユーザー関連の型定義
│
├─ pages/                   # ページコンポーネント
│  ├─ AdminPage.tsx          # 管理者向けページ
│  ├─ BackTask.tsx           # バックエンドタスク管理ページ
│  ├─ FrontTask.tsx          # フロントエンドタスク管理ページ
│  ├─ Login.tsx              # ログインページ
│  ├─ RegisterPage.tsx       # ユーザー登録ページ
│  ├─ SettingTask.tsx        # タスク設定ページ
│  ├─ SoloTask.tsx           # 個人タスク管理ページ
│  └─ TeamTask.tsx           # チームタスク管理ページ
│
├─ services/                # API通信および外部サービス関連
│  ├─ adminService.ts        # 管理者機能関連のサービス
│  ├─ authService.ts         # 認証関連のサービス
│  ├─ supabaseClient.ts      # Supabaseクライアントの初期化
│  └─ taskService.ts         # タスク関連のサービス
│
├─ hooks/                   # カスタムフック
│  ├─ useAdmin.ts            # 管理者機能用のカスタムフック
│  ├─ useAuth.ts             # 認証関連のカスタムフック
│  └─ useTasks.ts            # タスクデータ取得用のカスタムフック
│
├─ utils/                   # 共通ユーティリティ関数
│  └─ dateUtils.ts           # 日付操作関連のヘルパー関数
│
├─ assets/                  # 静的アセット
│  └─ react.svg             # Reactロゴ
│
├─ App.tsx                  # アプリケーションのルートコンポーネント
├─ index.css                # グローバルCSS
├─ main.tsx                 # アプリケーションのエントリーポイント
├─ tailwind.css             # Tailwind CSS設定
└─ vite-env.d.ts            # Vite環境の型定義
```


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
