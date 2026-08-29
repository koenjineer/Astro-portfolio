# Hiroyuki Chuman | Portfolio

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://astro-portfolio-sigma-seven.vercel.app)

![Portfolio Screenshot](apps/astro-portfolio/public/ogp.webp)

---

## 🔗 Demo

[https://astro-portfolio-sigma-seven.vercel.app](https://astro-portfolio-sigma-seven.vercel.app)

---

## 📌 概要

フロントエンドエンジニア・Hiroyuki Chumanのポートフォリオサイトです。
ビジネスの意図を正確に汲み取り、確かな技術で形にすることをコンセプトに制作しました。

---

## 🛠 Stack

### Frontend
![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)

### Tools
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

---

## 📁 Project Structure

本リポジトリはモノレポ構成です。本サイトの実体は `apps/astro-portfolio/` 配下にあります。

```
apps/astro-portfolio/
├── public/
│   ├── fonts/                  # Webフォント
│   ├── mock_site/              # 各mock_siteの画像アセット
│   ├── svg/                    # 技術スタックアイコン
│   ├── favicon.svg / favicon.png
│   ├── logo-header.svg
│   ├── ogp.webp / og.image.png
│   └── *.webp                  # 制作実績のサムネイル
└── src/
    ├── components/
    │   ├── contact.astro
    │   ├── footer.astro
    │   ├── home.astro
    │   ├── logoWall.astro
    │   ├── nav.astro
    │   ├── projects.astro
    │   └── mock_site/          # 各mock_siteのコンポーネント
    │       ├── GardenSalad/
    │       ├── MELIAFITNESS/
    │       ├── Rich-Life/
    │       ├── mongol-lp/
    │       ├── suisopot/
    │       └── webservice/
    ├── React/                  # Reactコンポーネント
    │   ├── HeroVisual.tsx
    │   ├── LetterGlitch.tsx
    │   ├── LikeButton.tsx
    │   ├── SkillsList.tsx
    │   └── StatsCounter.tsx
    ├── layouts/
    │   ├── Layout.astro
    │   └── mock_site/          # 各mock_siteのレイアウト
    ├── pages/
    │   ├── index.astro
    │   └── mock_site/          # 各mock_siteのページ（oha/はプレーンHTML）
    └── styles/
        └── mock_site/          # 各mock_siteのSCSS
            └── shared/         # 共通SCSS（reset / utilities）
```

---

## 🚀 Local Setup

```bash
# リポジトリをクローン
git clone https://github.com/koenjineer/Astro-portfolio
cd Astro-portfolio/apps/astro-portfolio

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

---

## 📝 制作実績

| サイト名 | 種別 | 技術 |
|---|---|---|
| Ravek | BtoB SaaS LP（架空） | Astro / SCSS / JS |
| Garden Salad | 飲食店サイト（架空） | Astro / SCSS / JS |
| MELIA FITNESS | ジムLP（架空） | Astro / SCSS / JS |
| Rich Life | 家具レンタルLP（架空） | Astro / SCSS / JS |
| Mongol LP | 観光LP（架空） | Astro / SCSS / JS |
| OHA! | アプリLP（架空） | HTML / SCSS / JS |

---

## 📬 Contact

- X: [@hiro_engineerJp](https://x.com/hiro_engineerJp)
- Zenn: [zenn.dev/koenjineer](https://zenn.dev/koenjineer)
- Email: contact@hiroyuki-chuman.com

---

Copyright © 2026 Hiroyuki Chuman. All rights reserved.
