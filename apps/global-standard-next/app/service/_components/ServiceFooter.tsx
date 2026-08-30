// 仮実装（本格的な共通レイアウト実装は別タスク）
export function ServiceFooter() {
  return (
    <footer className="flex flex-col gap-8 bg-contrast px-5 py-12 text-white lg:px-[90px] lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-center lg:gap-16">
        <a
          href="#"
          className="flex flex-1 flex-col items-center justify-center gap-1 border-2 border-accent-1 bg-main py-8 text-center"
        >
          <span className="font-fira-sans text-xl italic">Download</span>
          <span className="text-sm font-bold">資料ダウンロード</span>
        </a>
        <a
          href="#"
          className="flex flex-1 flex-col items-center justify-center gap-1 border-2 border-accent-1 bg-main py-8 text-center"
        >
          <span className="font-fira-sans text-xl italic">contact</span>
          <span className="text-sm font-bold">お問い合わせ</span>
        </a>
      </div>

      <div className="flex flex-col items-center gap-2 text-center text-sm">
        <p className="font-fira-sans text-2xl italic">Global standard</p>
        <address className="not-italic">
          〒550-1000　大阪市西区土佐堀9-5-5
          <br />
          TEL　06-123-4567
          <br />
          FAX　06-123-4568
        </address>
      </div>

      <p className="text-center text-xs">
        ©︎2021 Global Standard. All Rights Reserved.
      </p>
    </footer>
  );
}
