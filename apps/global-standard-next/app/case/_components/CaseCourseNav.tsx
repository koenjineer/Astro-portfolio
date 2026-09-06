interface CaseCourseNavItem {
  slug: string;
  title: string;
}

interface CaseCourseNavProps {
  /** 実際に描画するセクションと同じ配列を受け取り、飛び先の無いボタンを作らない */
  courses: CaseCourseNavItem[];
}

export function CaseCourseNav({ courses }: CaseCourseNavProps) {
  return (
    <nav aria-label="研修コースから探す" className="px-5 lg:px-[90px]">
      <ul className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-4">
        {courses.map((course) => (
          <li key={course.slug} className="w-[294px] lg:w-[208px]">
            {/* ページ内アンカー。JSを持ち込まずにセクションへ移動させる */}
            <a
              href={`#${course.slug}`}
              className="flex h-11 items-center justify-center rounded bg-[#eee] px-2 text-center text-sm font-bold text-contrast transition-colors duration-300 hover:bg-main hover:text-white focus-visible:bg-main focus-visible:text-white motion-reduce:transition-none"
            >
              {course.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
