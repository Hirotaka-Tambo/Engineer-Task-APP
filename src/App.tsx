import './App.css';

function App() {
  return (
    <div className="app">
      {/* 左サイドバー */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-item active">
            <span>Project Name</span>
          </div>
          <div className="sidebar-item">
            <span>Solo Task</span>
          </div>
          <div className="sidebar-item">
            <span>Group Task</span>
          </div>
          <div className="sidebar-item">
            <span>Team Task</span>
          </div>
          <div className="sidebar-item">
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="main-content">
        {/* 上部ヘッダー */}
        <div className="header">
          <h1>Task Management</h1>
          <div className="header-actions">
            <button className="btn-primary">+ New Task</button>
          </div>
        </div>

        {/* タスクカードエリア */}
        <div className="task-columns-container">
          {/* カラム1 */}
          <div className="task-column">
            <div className="task-card">
              <div className="task-card-header">
                <h3>API設計</h3>
                <div className="priority-dots">
                  <div className="dot red"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>ユーザー認証APIの設計と実装</p>
                <div className="task-meta">
                  <span className="deadline">期限: 12/25</span>
                </div>
              </div>
            </div>

            <div className="task-card">
              <div className="task-card-header">
                <h3>データベース設計</h3>
                <div className="priority-dots">
                  <div className="dot yellow"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>ユーザーテーブルとタスクテーブルの設計</p>
                <div className="task-meta">
                  <span className="deadline">期限: 12/30</span>
                </div>
              </div>
            </div>

            <div className="task-card">
              <div className="task-card-header">
                <h3>フロントエンド実装</h3>
                <div className="priority-dots">
                  <div className="dot green"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>Reactコンポーネントの実装とスタイリング</p>
                <div className="task-meta">
                  <span className="deadline">期限: 1/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* カラム2 */}
          <div className="task-column">
            <div className="task-card">
              <div className="task-card-header">
                <h3>テスト作成</h3>
                <div className="priority-dots">
                  <div className="dot red"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>単体テストと統合テストの作成</p>
                <div className="task-meta">
                  <span className="deadline">期限: 12/28</span>
                </div>
              </div>
            </div>

            <div className="task-card">
              <div className="task-card-header">
                <h3>ドキュメント作成</h3>
                <div className="priority-dots">
                  <div className="dot yellow"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>API仕様書とユーザーマニュアルの作成</p>
                <div className="task-meta">
                  <span className="deadline">期限: 1/3</span>
                </div>
              </div>
            </div>
          </div>

          {/* カラム3 */}
          <div className="task-column">
            <div className="task-card">
              <div className="task-card-header">
                <h3>デプロイ準備</h3>
                <div className="priority-dots">
                  <div className="dot green"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>本番環境へのデプロイ設定と準備</p>
                <div className="task-meta">
                  <span className="deadline">期限: 1/8</span>
                </div>
              </div>
            </div>

            <div className="task-card">
              <div className="task-card-header">
                <h3>パフォーマンス最適化</h3>
                <div className="priority-dots">
                  <div className="dot yellow"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>データベースクエリとフロントエンドの最適化</p>
                <div className="task-meta">
                  <span className="deadline">期限: 1/10</span>
                </div>
              </div>
            </div>

            <div className="task-card">
              <div className="task-card-header">
                <h3>セキュリティ監査</h3>
                <div className="priority-dots">
                  <div className="dot red"></div>
                </div>
              </div>
              <div className="task-card-content">
                <p>セキュリティ脆弱性のチェックと修正</p>
                <div className="task-meta">
                  <span className="deadline">期限: 1/12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;