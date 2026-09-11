// 医院の連絡先。ヘッダー・フッター・SP固定バー・WEB予約とお問い合わせの案内など複数か所に同じ値が出るため1か所で持つ

export const CLINIC_NAME = "みなみ歯科クリニック";
export const CLINIC_POSTAL_CODE = "〒166-0001";
export const CLINIC_ADDRESS = "東京都杉並区阿佐谷北7-3-1";
// 架空の番号なので電話発信リンクにはしない（実在した場合に閲覧者が発信してしまうため。components/layout/TelNumber.tsx）
export const CLINIC_TEL = "03-1234-5678";
export const CLINIC_HOURS_NOTE = "(年中無休 AM9:00〜PM22:00)";
