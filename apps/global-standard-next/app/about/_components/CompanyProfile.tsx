import Image from "next/image";

interface CompanyProfileRow {
  term: string;
  /** 値。要素が複数あるものは改行して並べる */
  lines?: string[];
  /** 値を箇条書きで出すもの（事業内容） */
  items?: string[];
}

const COMPANY_PROFILE_ROWS: CompanyProfileRow[] = [
  { term: "代表", lines: ["波瑠　慶太"] },
  {
    term: "事業内容",
    items: [
      "ビジネス英会話教育事業",
      "異文化交流サポート事業",
      "ビジネス留学事業",
    ],
  },
  { term: "設立", lines: ["2012年10月03日"] },
  { term: "所在地", lines: ["〒550-1000", "大阪市西区土佐堀9-5-5"] },
  { term: "TEL", lines: ["06-123-4567（代表）"] },
  { term: "FAX", lines: ["06-123-4568（代表）"] },
  { term: "E-mail", lines: ["globalstandard@example.com"] },
];

// 値の列の罫線。項目名の列（border-main）と描き分けるためのFigma指定色
const VALUE_BORDER_CLASS = "border-[#e8eaec]";

export function CompanyProfile() {
  return (
    <section
      aria-labelledby="company-profile-heading"
      className="relative isolate flex justify-center px-5 pt-[60px] pb-[100px] lg:px-[90px] lg:py-[92px]"
    >
      <Image
        src="/images/about/company-bg-sp.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-10 object-cover lg:hidden"
      />
      <Image
        src="/images/about/company-bg-pc.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        loading="lazy"
        className="-z-10 hidden object-cover lg:block"
      />
      {/* 写真を紺で覆って、白いカードと表の文字を読ませる */}
      <div className="absolute inset-0 -z-10 bg-main/80" aria-hidden="true" />

      <div className="flex w-full max-w-[768px] flex-col gap-10 bg-white px-5 py-10 lg:gap-[60px] lg:border lg:border-[#707070] lg:px-10 lg:py-[60px]">
        <h2
          id="company-profile-heading"
          className="text-center text-2xl font-bold text-contrast"
        >
          会社概要
        </h2>

        {/* table-fixed：項目名の列をFigmaどおりの幅で固定する。既定の自動レイアウトだと
            値の文字数に引っ張られて項目名の列が縮む */}
        <table className="w-full table-fixed text-sm text-contrast lg:text-base">
          <tbody>
            {COMPANY_PROFILE_ROWS.map((row, index) => {
              // 1行目だけは表の上辺にも罫線を引く
              const topBorderClass = index === 0 ? "border-t" : "";

              return (
                <tr key={row.term}>
                  <th
                    scope="row"
                    className={`w-[100px] border-b border-main py-4 text-left align-middle font-medium lg:w-[200px] lg:px-8 lg:py-6 ${topBorderClass}`}
                  >
                    {row.term}
                  </th>
                  <td
                    className={`border-b py-4 pl-5 align-middle lg:px-8 lg:py-6 ${VALUE_BORDER_CLASS} ${topBorderClass}`}
                  >
                    {row.items ? (
                      <ul className="list-disc pl-[21px] lg:pl-6">
                        {row.items.map((item) => (
                          <li key={item} className="lg:leading-[25px]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      row.lines?.map((line) => (
                        <p key={line} className="lg:leading-[25px]">
                          {line}
                        </p>
                      ))
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
