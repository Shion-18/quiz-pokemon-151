## 概要

「ポケットモンスター赤・緑」に登場する151匹のポケモンから出題される、シルエットクイズ・アプリケーションです。
"https://quiz-pokemon-151.vercel.app/"

![topscreen](https://github.com/user-attachments/assets/bd4d2652-5b97-439a-8c1a-5e696b015ed3)
![quizscreen](https://github.com/user-attachments/assets/630c0f4e-045e-47f6-be6a-7dade5a3d5dd)
![resultscreen](https://github.com/user-attachments/assets/31536434-4626-440f-87f7-11717ac527c6)

## 主な機能

### クイズ機能
- ランダムに選ばれたポケモンのシルエットを表示
- 4つの選択肢から正解を選ぶ
- 正解・不正解がすぐに分かる

### 結果表示
- 全10問の正誤履歴を表示
- グラフィカルなスコア表示

### Xへのシェア機能
- 絵文字を用いた視覚的な結果表示

### プレイ回数カウント
- 累計プレイ回数の表示


## 技術スタック

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (アイコン)


## プロジェクト構成

```
src/
├── components/     # UIコンポーネント
├── contexts/       # Reactコンテキスト
├── data/          # ポケモンのデータ
├── hooks/         # カスタムフック
├── types/         # 型定義
└── App.tsx        # メインアプリケーション
```


## 謝辞

ポケモンの画像データは"PokeAPI"(https://pokeapi.co/)から提供されています。
