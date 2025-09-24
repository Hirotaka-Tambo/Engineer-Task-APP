//import React from 'react';(後々、コメントアウト解除)
//tailwind cssを利用
// コメントアウトiiiiiiiii
// 必ずdevelopブランチに向けてadd/commit/pushすること!!

function App() {
  return (
    // 全体コンテナ
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#3B62FF] via-[#5B8FFF] to-[#5BFFE4] p-2 md:p-4">
      {/* 左サイドバー */}
      <div className="w-full md:w-[280px] bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-8 md:p-10 m-0 md:m-4 shadow-xl border border-white border-opacity-60 transition-all duration-300 ease-in-out">
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
          <div className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none bg-white bg-opacity-50 text-gray-900 font-semibold md:shadow-md md:hover:shadow-lg hover:translate-x-1">
            <span>Project Name</span>
          </div>
          <div className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold hover:translate-x-1">
            <span>Solo Task</span>
          </div>
          <div className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold hover:translate-x-1">
            <span>Group Task</span>
          </div>
          <div className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold hover:translate-x-1">
            <span>Team Task</span>
          </div>
          <div className="p-4 md:p-6 my-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out text-gray-700 font-medium whitespace-nowrap md:transform-none hover:bg-white hover:bg-opacity-50 hover:text-gray-900 hover:font-semibold hover:translate-x-1">
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col p-2 md:p-4">
        {/* 上部ヘッダー */}
        <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 md:p-8 mb-8 flex justify-between items-center shadow-xl border border-white border-opacity-60">
          <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 m-0">Task Management</h1>
          <div className="flex gap-4 md:gap-6">
            <button className="bg-gradient-to-br from-blue-500 to-blue-800 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              + New Task
            </button>
          </div>
        </div>

        {/* タスクカードエリア */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start flex-1">
          {/* カラム1 */}
          <div className="flex flex-col gap-4">
            <TaskCard
              title="API設計"
              description="ユーザー認証APIの設計と実装"
              deadline="12/25"
              priority="red"
            />
            <TaskCard
              title="データベース設計"
              description="ユーザーテーブルとタスクテーブルの設計"
              deadline="12/30"
              priority="yellow"
            />
            <TaskCard
              title="フロントエンド実装"
              description="Reactコンポーネントの実装とスタイリング"
              deadline="1/5"
              priority="green"
            />
          </div>

          {/* カラム2 */}
          <div className="flex flex-col gap-4">
            <TaskCard
              title="テスト作成"
              description="単体テストと統合テストの作成"
              deadline="12/28"
              priority="red"
            />
            <TaskCard
              title="ドキュメント作成"
              description="API仕様書とユーザーマニュアルの作成"
              deadline="1/3"
              priority="yellow"
            />
          </div>

          {/* カラム3 */}
          <div className="flex flex-col gap-4">
            <TaskCard
              title="デプロイ準備"
              description="本番環境へのデプロイ設定と準備"
              deadline="1/8"
              priority="green"
            />
            <TaskCard
              title="パフォーマンス最適化"
              description="データベースクエリとフロントエンドの最適化"
              deadline="1/10"
              priority="yellow"
            />
            <TaskCard
              title="セキュリティ監査"
              description="セキュリティ脆弱性のチェックと修正"
              deadline="1/12"
              priority="red"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 後日修正必須(エラー回避のためにany型にしているだけなため)
const TaskCard = ({ title, description, deadline, priority }: any) => {
  // priotiy用のカラーを一時的に削除(エラー回避のため)

  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white border-opacity-60 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800 m-0 leading-tight">{title}</h3>
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full ${priority}`}></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700 m-0 leading-relaxed">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-600 bg-white bg-opacity-30 px-2 py-1 rounded-lg border border-white border-opacity-40">
            期限: {deadline}
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
