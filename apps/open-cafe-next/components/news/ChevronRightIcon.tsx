interface ChevronRightIconProps {
  /** 大きさは6×12で固定。向き（回転）や色を変えるときに渡す */
  className?: string;
}

/**
 * 右向きの山形（Figma: Icon metro-chevron-thin-right 6×12）。
 * サイドバーは contrast、ページ送りと前後記事は main と場所ごとに色が違うので、
 * public のSVGを `<img>` で貼らず `currentColor` で塗る。図形はFigmaの書き出しそのまま
 */
export function ChevronRightIcon({ className }: ChevronRightIconProps) {
  return (
    <svg
      width="6"
      height="12"
      viewBox="0 0 6 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4.78773 6.00091L0.131077 0.824286C-0.0436923 0.635918 -0.0436923 0.331047 0.131077 0.141276C0.214499 0.0508806 0.328286 0 0.447021 0C0.565756 0 0.679545 0.0508806 0.762966 0.141276L5.86892 5.65836C6.04369 5.84743 6.04369 6.15301 5.86892 6.34138L0.762966 11.8585C0.588198 12.0475 0.305858 12.0468 0.131077 11.8585C-0.0436923 11.6708 -0.0436923 11.3652 0.131077 11.1755L4.78775 6.00093L4.78773 6.00091Z"
        fill="currentColor"
      />
    </svg>
  );
}
