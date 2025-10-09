import { useState, useEffect } from "react";
import type { ExtendedTask, NewTaskUI, TaskStatus } from "../components/types/task";

interface UseTaskModalProps {
  task: ExtendedTask | NewTaskUI;
  onClose: () => void;
  onSave: (updatedTask: ExtendedTask | NewTaskUI) => void;
}

export const useTaskModal = ({ task, onClose, onSave }: UseTaskModalProps) => {
  // NewTaskUI（新規）かExtendedTask（既存）かを判定
  // createdAtプロパティの有無で判別
  const isNewTask = !("createdAt" in task);

  // 新規タスクのデフォルト値
  const defaultNewTask: NewTaskUI = {
    title: "",
    taskStatus: "todo" as TaskStatus,
    priority: 1,
    taskCategory: ['solo'],
    icon: "",
    createdBy: "",     // ログインユーザーから埋め込む想定
    assignedTo: "",    // チーム内ユーザー（のちにselectタグに変更予定）
    deadline: new Date(),
    oneLine: "",
    memo: "",
    relatedUrl: "",
  };

  // 編集中のタスクデータを管理
  const [editedTask, setEditedTask] = useState<ExtendedTask | NewTaskUI>(task);
  // バリデーションエラーを管理
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // タスクが切り替わったときに状態を初期化
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setErrors({});
    } else {
      setEditedTask({...defaultNewTask});
      setErrors({});
    }
  }, [task]);

  /**
   * 残り日数に応じたスタイルを取得する関数
   * 締切日までの日数によって色分けを行う
   * - 期限切れ: 赤
   * - 当日: 濃い赤
   * - 明日: オレンジ
   * - 3日以内: 黄色
   * - それ以上: 緑
   */
  const getDeadlineStyle = (deadline: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / oneDay);
    
    if (daysRemaining < 0) {
      return "bg-red-100 text-red-800 border-red-300";  // 期限切れ
    } else if (daysRemaining === 0) {
      return "bg-red-200 text-red-900 border-red-400 font-bold";  // 当日
    } else if (daysRemaining === 1) {
      return "bg-orange-200 text-orange-800 border-orange-300 font-semibold";  // 明日
    } else if (daysRemaining <= 3) {
      return "bg-yellow-200 text-yellow-800 border-yellow-300";  // 3日以内
    } else {
      return "bg-green-100 text-green-800 border-green-300";  // それ以上
    }
  };

  /**
   * キャンセルボタンのハンドラー
   * モーダルを閉じる
   */
  const handleCancel = () => {
    onClose();
  };

  /**
   * 保存ボタンのハンドラー
   * バリデーションを行い、問題なければタスクを保存
   */
  const handleSave = () => {
    if(!editedTask) return;
    if(Object.keys(errors).length > 0) return;

    // タイトルの必須チェック
    if(!editedTask || editedTask.title.trim() === ""){
      setErrors((prev)=>({...prev, title:"タイトルは必須です"}));
      return;
    }

    onSave(editedTask);
  };

  /**
   * 入力フィールドの変更ハンドラー
   * フィールドの種類に応じて適切な型変換とバリデーションを行う
   * 
   * @param name - 変更するフィールド名
   * @param value - 新しい値
   */
  const handleInputChange = (name: keyof ExtendedTask, value: any) => {
    setEditedTask((prev) => {
      // 優先度の場合は数値に変換
      if(name === "priority"){
        return {...prev, [name]: Number(value) as ExtendedTask["priority"]};
      }
      // 締切日の場合はDateオブジェクトに変換
      if(name === "deadline"){
        return {...prev, [name]: new Date(value)};
      }
      // グループ選択の場合は特別な処理
      if(name === "taskCategory" && typeof value === "object") {
        const { category, checked, currentCategories } = value;
        let newCategories = [...currentCategories];
        if (checked) {
          // 3つ以下の場合のみ追加を許可
          if (!newCategories.includes(category) && newCategories.length < 3) {
            newCategories.push(category);
          }
        } else {
          newCategories = newCategories.filter((c) => c !== category);
        }
        return { ...prev, taskCategory: newCategories };
      }
      // その他のフィールドはそのまま設定
      return {...prev, [name]: value};
    });

    // タイトルのバリデーション
    if(name === "title"){
      if(value.trim() === ""){
        setErrors((prev) => ({...prev, title:"タイトルは必須です"}));
      } else {
        setErrors((prev) => {
          const newErrors = {...prev};
          delete newErrors.title;
          return newErrors;
        });
      }
    }
  };

  // 日付をinput[type="date"]用の文字列に変換
  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
  
  // input[type="date"]の文字列をDateオブジェクトに変換
  const parseDateFromInput = (dateString: string) => new Date(dateString);

  // TaskModalFormで使用する状態とハンドラーを返す
  return {
    editedTask,          // 編集中のタスクデータ
    isNewTask,           // 新規タスクかどうか
    errors,              // バリデーションエラー
    handleCancel,        // キャンセル処理
    handleSave,          // 保存処理
    handleInputChange,   // 入力変更処理
    getDeadlineStyle,    // 締切日のスタイル取得
    formatDateForInput,  // 日付フォーマット（表示用）
    parseDateFromInput,  // 日付パース（入力用）
  };
};
