import { useEffect, useId, useRef, useState } from "react";
import { OPEN_SUGGESTIONS_LABEL, RESTART_LABEL, RESTART_REPLY, ROOT_TOPIC_IDS, getGreeting, topics } from "../data/chatbot";
import type { ChatLink, ChatTopic } from "../data/chatbot";

interface Message {
  id: number;
  role: "bot" | "user";
  paragraphs: string[];
  links?: ChatLink[];
}

const topicById = new Map<string, ChatTopic>(topics.map((topic) => [topic.id, topic]));

const isInternalLink = (href: string) => href.startsWith("#");
const isWebLink = (href: string) => href.startsWith("http");

const ICON_CLASS = "size-6";

const VISITED_KEY = "chatbot-visited";
// 再読み込みのたびに「おかえりなさい」へ変わらないよう、そのタブでの判定を覚えておく
const GREETING_KIND_KEY = "chatbot-greeting-kind";

// localStorage が使えない環境（プライベートブラウズなど）では、初回扱いにする
const readIsReturning = (): boolean => {
  try {
    const sessionKind = sessionStorage.getItem(GREETING_KIND_KEY);
    if (sessionKind !== null) return sessionKind === "returning";
    const isReturning = localStorage.getItem(VISITED_KEY) !== null;
    sessionStorage.setItem(GREETING_KIND_KEY, isReturning ? "returning" : "first");
    localStorage.setItem(VISITED_KEY, "1");
    return isReturning;
  } catch {
    return false;
  }
};

// 回答が一瞬で出ると機械的に見えるので、入力中のドットを短く見せる。長すぎると待たされる印象になる
const TYPING_DELAY_MS = 700;
const TYPING_DOT_STEP_MS = 150;
const TYPING_DOT_COUNT = 3;

const AVATAR_SIZE_PX = 32;

// 吹き出しの話し手が分かるように、ボット側にだけ付ける。訪問者側は右寄せと色で区別できる。
// パネルは閉じている間 display:none なので、loading="lazy" で開くまで読み込まれない
const BotAvatar = () => (
  <img
    src="/chatbot-avatar.webp"
    alt=""
    width={AVATAR_SIZE_PX}
    height={AVATAR_SIZE_PX}
    loading="lazy"
    decoding="async"
    className="shrink-0 size-8 rounded-full object-cover"
  />
);

const Chatbot = () => {
  const panelId = useId();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestionIds, setSuggestionIds] = useState<string[]>(ROOT_TOPIC_IDS);
  // 開いた直後は挨拶だけにして、パネルを軽く見せる。一度選び始めたら閉じ直さない
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const nextMessageId = useRef(0);
  const hasGreeted = useRef(false);
  const typingTimer = useRef<number | undefined>(undefined);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  // 選択肢を押すと、押したボタンごと一覧が入れ替わる。キーボード操作でフォーカスが迷子にならないよう、入れ替え後に先頭へ戻す
  const shouldRefocusSuggestions = useRef(false);

  const pushMessages = (added: Omit<Message, "id">[]) => {
    const withIds = added.map((message) => ({ ...message, id: nextMessageId.current++ }));
    setMessages((previous) => [...previous, ...withIds]);
  };

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();

    // 時刻と再訪はブラウザでしか分からないので、最初に開いたときに挨拶を作る
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    pushMessages([{ role: "bot", paragraphs: [getGreeting(new Date().getHours(), readIsReturning())] }]);
  }, [isOpen]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;

    if (shouldRefocusSuggestions.current) {
      shouldRefocusSuggestions.current = false;
      suggestionsRef.current?.querySelector("button")?.focus();
    }
  }, [messages, isSuggestionsOpen, isTyping]);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  // パネル内にフォーカスがなくても（起動ボタンの上でも）Esc で閉じられるよう、開いている間だけ document で受ける
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpenSuggestions = () => {
    shouldRefocusSuggestions.current = true;
    setIsSuggestionsOpen(true);
  };

  // 押した質問は先に出し、回答は入力中のドットを挟んでから出す
  const replyAfterTyping = (
    userText: string,
    botMessage: Omit<Message, "id" | "role">,
    nextSuggestionIds: string[],
  ) => {
    if (isTyping) return;
    pushMessages([{ role: "user", paragraphs: [userText] }]);
    setIsTyping(true);
    typingTimer.current = window.setTimeout(() => {
      shouldRefocusSuggestions.current = true;
      pushMessages([{ role: "bot", ...botMessage }]);
      setSuggestionIds(nextSuggestionIds);
      setIsTyping(false);
    }, TYPING_DELAY_MS);
  };

  const handleSelect = (topic: ChatTopic) => {
    replyAfterTyping(topic.question, { paragraphs: topic.answer, links: topic.links }, topic.next);
  };

  const handleRestart = () => {
    replyAfterTyping(RESTART_LABEL, { paragraphs: [RESTART_REPLY] }, ROOT_TOPIC_IDS);
  };

  const suggestions = suggestionIds
    .map((id) => topicById.get(id))
    .filter((topic): topic is ChatTopic => topic !== undefined);
  const isAtStart = suggestionIds === ROOT_TOPIC_IDS;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "チャットを閉じる" : "チャットを開く"}
        className="fixed z-[90] bottom-24 right-4 md:bottom-6 md:right-6 flex items-center justify-center size-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sec)] focus-visible:ring-offset-2"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={ICON_CLASS} aria-hidden="true">
            <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
          </svg>
        )}
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        tabIndex={-1}
        hidden={!isOpen}
        className={`fixed z-[95] bottom-40 inset-x-4 md:inset-x-auto md:bottom-24 md:right-6 md:w-96 ${isOpen ? "flex" : "hidden"} flex-col max-h-[60dvh] rounded-2xl border border-[var(--white-icon-tr)] bg-[var(--background)] text-[var(--white)] shadow-xl overflow-hidden focus:outline-none`}
      >
        <div className="px-4 py-3 border-b border-[var(--white-icon-tr)] bg-[var(--component-bg)]">
          <p id={titleId} className="text-sm font-semibold">
            ご質問を選んでください
          </p>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm leading-relaxed"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`motion-safe:animate-chat-message-in ${message.role === "user" ? "flex justify-end" : "flex justify-start items-start gap-2"}`}
            >
              {message.role === "bot" && <BotAvatar />}
              <div
                className={
                  message.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 text-white px-4 py-2"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--component-bg)] border border-[var(--white-icon-tr)] px-4 py-2 space-y-2"
                }
              >
                {message.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {message.links && (
                  <ul className="flex flex-col gap-1 pt-1">
                    {message.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={isInternalLink(link.href) ? () => setIsOpen(false) : undefined}
                          target={isWebLink(link.href) ? "_blank" : undefined}
                          rel={isWebLink(link.href) ? "noopener noreferrer" : undefined}
                          className="underline underline-offset-2 hover:text-[var(--sec)]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-start gap-2 motion-safe:animate-chat-message-in">
              <BotAvatar />
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[var(--component-bg)] border border-[var(--white-icon-tr)] px-4 py-3">
                <span className="sr-only">入力中</span>
                {Array.from({ length: TYPING_DOT_COUNT }, (_, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    style={{ animationDelay: `${index * TYPING_DOT_STEP_MS}ms` }}
                    className="size-1.5 rounded-full bg-[var(--white-icon)] motion-safe:animate-bounce"
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          ref={suggestionsRef}
          aria-busy={isTyping}
          className="flex flex-wrap gap-2 px-4 py-3 border-t border-[var(--white-icon-tr)] bg-[var(--component-bg)]"
        >
          {isSuggestionsOpen ? (
            <>
              {suggestions.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelect(topic)}
                  aria-disabled={isTyping}
                  className={`${isTyping ? "opacity-60 cursor-wait " : ""}rounded-full border border-[var(--white-icon-tr)] bg-[var(--background)] px-3 py-1.5 text-sm hover:border-[var(--sec)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sec)]`}
                >
                  {topic.question}
                </button>
              ))}
              {!isAtStart && (
                <button
                  type="button"
                  onClick={handleRestart}
                  aria-disabled={isTyping}
                  className={`${isTyping ? "opacity-60 cursor-wait " : ""}rounded-full px-3 py-1.5 text-sm text-[var(--white-icon)] underline underline-offset-2 hover:text-[var(--white)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sec)]`}
                >
                  {RESTART_LABEL}
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleOpenSuggestions}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sec)] focus-visible:ring-offset-2"
            >
              {OPEN_SUGGESTIONS_LABEL}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
