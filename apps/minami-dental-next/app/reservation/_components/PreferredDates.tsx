import { FieldLabel } from "@/components/form/FieldLabel";
import {
  FIELD_CONTROL_CLASS,
  FIELD_ROW_CLASS,
} from "@/components/form/FormField";

/** Figmaの「希望日」は3つ（必須ではない） */
const PREFERRED_DATE_COUNT = 3;

/**
 * Chromeの日付欄の右端にある標準のカレンダーボタンを透明にし、同じ位置にFigmaのアイコンを重ねる。
 * ボタン自体は残るので、アイコンの位置を押せば標準の日付選択が開く
 */
const DATE_PICKER_INDICATOR_CLASS =
  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:size-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

/** 希望日×3（Figma: 年 / 月 / 日 ＋ icon-calender）。WEB予約でしか使わないのでページの中に置く */
export function PreferredDates() {
  return (
    <fieldset className={FIELD_ROW_CLASS}>
      {/* float の理由は ChoiceGroup と同じ（legendを flex の並びに入れるため） */}
      <legend className="float-left">
        <FieldLabel label="希望日" />
      </legend>

      <div className="flex w-full flex-col gap-5 lg:w-[488px]">
        {Array.from({ length: PREFERRED_DATE_COUNT }, (_, index) => {
          const order = index + 1;

          return (
            <span key={order} className="relative flex w-full max-w-[488px]">
              <input
                type="date"
                name={`preferredDate${order}`}
                aria-label={`第${order}希望日`}
                className={`${FIELD_CONTROL_CLASS} relative pr-12 ${DATE_PICKER_INDICATOR_CLASS}`}
              />
              <CalendarIcon />
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Figma: icon-calender（20px四方）。押せるのは下の透明な標準ボタンなので、こちらはクリックを素通しする。
 * 標準ボタンを透明にできるのは ::-webkit-calendar-picker-indicator のあるブラウザだけなので、
 * 自前のアイコンもその場合だけ出す（Firefoxなどでは標準のアイコンと2つ並んでしまうため、標準の方だけにする）
 */
function CalendarIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute top-1/2 right-4 hidden size-5 -translate-y-1/2 text-contrast supports-[selector(::-webkit-calendar-picker-indicator)]:block"
    >
      <path d="M4 16.5725C4 17.3477 4.6169 17.9766 5.37727 17.9766H15.4772C16.2376 17.9766 16.8545 17.3477 16.8545 16.5725V8.61621H4V16.5725ZM13.1818 10.8393C13.1818 10.6462 13.3367 10.4883 13.5261 10.4883H14.6738C14.8632 10.4883 15.0181 10.6462 15.0181 10.8393V12.0093C15.0181 12.2024 14.8632 12.3604 14.6738 12.3604H13.5261C13.3367 12.3604 13.1818 12.2024 13.1818 12.0093V10.8393ZM13.1818 14.5834C13.1818 14.3904 13.3367 14.2324 13.5261 14.2324H14.6738C14.8632 14.2324 15.0181 14.3904 15.0181 14.5834V15.7535C15.0181 15.9465 14.8632 16.1045 14.6738 16.1045H13.5261C13.3367 16.1045 13.1818 15.9465 13.1818 15.7535V14.5834ZM9.50907 10.8393C9.50907 10.6462 9.66401 10.4883 9.85338 10.4883H11.0011C11.1905 10.4883 11.3454 10.6462 11.3454 10.8393V12.0093C11.3454 12.2024 11.1905 12.3604 11.0011 12.3604H9.85338C9.66401 12.3604 9.50907 12.2024 9.50907 12.0093V10.8393ZM9.50907 14.5834C9.50907 14.3904 9.66401 14.2324 9.85338 14.2324H11.0011C11.1905 14.2324 11.3454 14.3904 11.3454 14.5834V15.7535C11.3454 15.9465 11.1905 16.1045 11.0011 16.1045H9.85338C9.66401 16.1045 9.50907 15.9465 9.50907 15.7535V14.5834ZM5.83636 10.8393C5.83636 10.6462 5.9913 10.4883 6.18067 10.4883H7.3284C7.51777 10.4883 7.67271 10.6462 7.67271 10.8393V12.0093C7.67271 12.2024 7.51777 12.3604 7.3284 12.3604H6.18067C5.9913 12.3604 5.83636 12.2024 5.83636 12.0093V10.8393ZM5.83636 14.5834C5.83636 14.3904 5.9913 14.2324 6.18067 14.2324H7.3284C7.51777 14.2324 7.67271 14.3904 7.67271 14.5834V15.7535C7.67271 15.9465 7.51777 16.1045 7.3284 16.1045H6.18067C5.9913 16.1045 5.83636 15.9465 5.83636 15.7535V14.5834ZM15.4772 4.87207H14.1V3.46802C14.1 3.21061 13.8934 3 13.6409 3H12.7227C12.4702 3 12.2636 3.21061 12.2636 3.46802V4.87207H8.59089V3.46802C8.59089 3.21061 8.3843 3 8.1318 3H7.21362C6.96112 3 6.75453 3.21061 6.75453 3.46802V4.87207H5.37727C4.6169 4.87207 4 5.50097 4 6.27612V7.68018H16.8545V6.27612C16.8545 5.50097 16.2376 4.87207 15.4772 4.87207Z" />
    </svg>
  );
}
