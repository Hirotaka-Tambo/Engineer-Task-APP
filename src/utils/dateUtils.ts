/* 日付・時刻周りの関数*/

/**
 * @description 日付の短縮形式表示(例:12/25)にフォーマット。
 * @param date - フォーマット対象のDateオブジェクト
 * @returns 短縮形式の文字列 
 */

export const formatDateShort = (date : Date): string=>{
    // 日本語ローカルで月と日のみの表示
    return date.toLocaleDateString('ja-JP',{
        year:'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * @description 締め切りまでの残り日数を計算
 * @param deadline -締め切りのDateオブジェクト
 * @returns 残り日数の情報
 */

export const getDeadlineStatus = (deadline : Date):string =>{
    const today = new Date();
    // 時刻情報を一旦無視する(クリア)
    today.setHours(0,0,0,0)
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0,0,0,0);

    // 1日のミリ秒数
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = deadlineDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / oneDay); // 切り上げ
    
    if(daysRemaining < 0){
        return "期限切れ";
    }else if(daysRemaining === 0){
        return "本日締め切り!!";
    }else if(daysRemaining === 1){
        return "締め切りは明日!!";
    }else{
        return `残り${daysRemaining}日です`;
    }
}