export interface PostDate {
  /** 画面に出す日付（2024.12.10） */
  displayDate: string;
  /** <time datetime>用（2024-12-10） */
  isoDate: string;
}

export function toPostDate(wordpressDate: string): PostDate {
  // WordPressは`2024-12-10T21:48:48`形式で返す。Dateに通すと時差で日付がずれうるので、
  // 日付部分を文字列のまま切り出す
  const isoDate = wordpressDate.slice(0, 10);

  return { displayDate: isoDate.replaceAll("-", "."), isoDate };
}
