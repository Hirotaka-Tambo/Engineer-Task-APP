# Nexst Task

本アプリは、個人・グループ・チーム単位でのタスク管理を行うWebアプリです。  
UIは **Notion** を参考にし、タスクの登録・管理・カレンダー表示・モーダルでの詳細編集をサポートします。  
バックエンドは **Supabase** を利用し、ログイン認証とDB管理を行います。

## 技術スタック
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Hooks + Context API
- **Build Tool**: Vite
- **Linting**: ESLint

### プロジェクト体制
- **開発メンバー**: 2人
- **開発者**: Hirotaka-Tambo, Kamon-Tahara-504

### プロジェクト工程
- **開発開始日**: 2025 / 9/21
- **github pages**: 2025 / 10/17
- **リリース予定日**: 未定

---

## 機能一覧

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
- メールアドレスとパスワードでの認証
- 新規ユーザー登録機能
- 自動デフォルトプロジェクト割り当て
- プロジェクトメンバーシップの自動管理
- セッション管理と自動ログイン

---

## Supabase (DB)

### users テーブル
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
- メールアドレス・パスワード認証
- 自動セッション管理
- RLS（Row Level Security）対応
- プロジェクトメンバーシップの自動管理

---

## ディレクトリ構成

```
Engineer-Task-APP/
│
├─ public/                  # 静的ファイル
│  └─ icons/                # アイコンファイル（43種類の技術スタックアイコン）
│      ├─ angular.svg
│      ├─ react.svg
│      ├─ typescript.svg
│      └─ ... (その他のアイコン)
│
├─ src/
│  │
│  ├─ components/           # 共通コンポーネント
│  │  ├─ ConfirmModal/
│  │  │   └─ ConfirmModal.tsx         # 確認ダイアログコンポーネント
│  │  │
│  │  ├─ IconSelector/
│  │  │   └─ IconSelector.tsx         # アイコン選択コンポーネント
│  │  │
│  │  ├─ Layout/
│  │  │   └─ MainLayout.tsx           # メインレイアウトコンポーネント
│  │  │
│  │  ├─ ProjectCreation/
│  │  │   └─ ProjectCreationModal.tsx # プロジェクト作成モーダル
│  │  │
│  │  ├─ Sidebar/
│  │  │   ├─ Sidebar.tsx              # サイドバーのメインコンポーネント
│  │  │   └─ SidebarItem.tsx          # サイドバーの各項目
│  │  │
│  │  ├─ TaskBoard/
│  │  │   └─ TaskBoard.tsx            # タスクボード表示コンポーネント
│  │  │
│  │  ├─ TaskCard/
│  │  │   ├─ TaskCard.tsx             # タスク表示用カード
│  │  │   ├─ PriorityBadge.tsx        # 優先度を色で示すバッジ
│  │  │   └─ TaskCategoryLabel.tsx    # タスクカテゴリラベルコンポーネント
│  │  │
│  │  ├─ TaskModal/
│  │  │   ├─ TaskModal.tsx            # タスクの詳細表示・編集用モーダル
│  │  │   └─ TaskModalForm.tsx        # タスクフォームコンポーネント
│  │  │
│  │  └─ types/                       # 型定義ファイル
│  │      ├─ outletContext.ts         # アウトレットコンテキストの型定義
│  │      ├─ project.ts               # プロジェクト関連の型定義
│  │      ├─ projectMember.ts         # プロジェクトメンバー関連の型定義
│  │      ├─ sidebar.ts               # サイドバー関連の型定義
│  │      ├─ task.ts                  # タスク関連の型定義
│  │      └─ user.ts                  # ユーザー関連の型定義
│  │
│  ├─ contexts/                       # Reactコンテキスト
│  │  └─ ProjectContext.tsx           # プロジェクトコンテキスト
│  │
│  ├─ pages/                          # ページコンポーネント
│  │  ├─ Admin.tsx                    # 管理者向けページ
│  │  ├─ BackTask.tsx                 # バックエンドタスク管理ページ
│  │  ├─ FrontTask.tsx                # フロントエンドタスク管理ページ
│  │  ├─ Login.tsx                    # ログインページ
│  │  ├─ ProjectSelection.tsx         # プロジェクト選択ページ
│  │  ├─ Register.tsx                 # ユーザー登録ページ
│  │  ├─ SettingTask.tsx              # タスク設定ページ
│  │  ├─ SoloTask.tsx                 # 個人タスク管理ページ
│  │  └─ TeamTask.tsx                 # チームタスク管理ページ
│  │
│  ├─ services/                       # API通信および外部サービス関連
│  │  ├─ adminService.ts              # 管理者機能関連のサービス
│  │  ├─ authService.ts               # 認証関連のサービス
│  │  ├─ supabaseClient.ts            # Supabaseクライアントの初期化
│  │  ├─ taskService.ts               # タスク関連のサービス
│  │  └─ userService.ts               # ユーザー関連のサービス
│  │
│  ├─ hooks/                          # カスタムフック
│  │  ├─ useAdmin.ts                  # 管理者機能用のカスタムフック
│  │  ├─ useAdminActions.ts           # 管理者アクション用のカスタムフック
│  │  ├─ useAuth.ts                   # 認証関連のカスタムフック
│  │  ├─ useDropdownMenu.ts           # ドロップダウンメニュー用のカスタムフック
│  │  ├─ useLogin.ts                  # ログイン処理用のカスタムフック
│  │  ├─ useLoginValidation.ts        # ログインフォームバリデーション用のカスタムフック
│  │  ├─ useProjectCreation.ts        # プロジェクト作成用のカスタムフック
│  │  ├─ useProjectSelection.ts       # プロジェクト選択用のカスタムフック
│  │  ├─ useRegister.ts               # 新規登録処理用のカスタムフック
│  │  ├─ useRegisterValidation.ts     # 新規登録フォームバリデーション用のカスタムフック
│  │  ├─ useTaskModal.ts              # タスクモーダル用のカスタムフック
│  │  └─ useTasks.ts                  # タスクデータ取得用のカスタムフック
│  │
│  ├─ utils/                          # 共通ユーティリティ関数
│  │  ├─ dateUtils.ts                 # 日付操作関連のヘルパー関数
│  │  ├─ svgUtils.ts                  # SVGアイコンサニタイゼーション関連のユーティリティ
│  │  └─ validationUtils.ts           # 入力検証関連のユーティリティ
│  │
│  ├─ App.tsx                         # アプリケーションのルートコンポーネント
│  ├─ index.css                       # グローバルCSS
│  ├─ main.tsx                        # アプリケーションのエントリーポイント
│  ├─ tailwind.css                    # Tailwind CSS設定
│  └─ vite-env.d.ts                   # Vite環境の型定義
│
├─ .github/
│  └─ workflows/
│      └─ deploy.yml                  # GitHub Pages自動デプロイ設定
│
├─ index.html                         # エントリーポイントHTML
├─ package.json                       # 依存関係管理
├─ vite.config.ts                     # Vite設定
├─ tailwind.config.js                 # Tailwind CSS設定
├─ tsconfig.json                      # TypeScript設定
└─ README.md                          # プロジェクトドキュメント
```
