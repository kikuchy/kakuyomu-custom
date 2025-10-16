# Kakuyomu Custom

カクヨムの体験をカスタムするブラウザ拡張機能です。

## 機能

- **システムテーマ連動**: システムのダークモード/ライトモード設定に合わせて、カクヨムの背景色を自動調整します
- **カクヨムの表示設定に「システム」オプションを追加**: カクヨムの表示設定に「システム」という新しい背景色オプションを追加します

## 対応ブラウザ

- Chrome
- Firefox
- Safari

## インストール方法

### 開発版のインストール

1. このリポジトリをクローンします

   ```bash
   git clone https://github.com/kikuchy/kakuyomu-custom.git
   cd kakuyomu-custom
   ```

2. 依存関係をインストールします

   ```bash
   npm install
   ```

3. 拡張機能をビルドします

   ```bash
   npm run build
   ```

4. ブラウザに拡張機能を読み込みます

   **Chrome/Edge:**
   - `chrome://extensions/` にアクセス
   - 「デベロッパーモード」を有効にする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist` フォルダを選択

   **Firefox:**
   - `about:debugging` にアクセス
   - 「この Firefox」を選択
   - 「一時的なアドオンを読み込む」をクリック
   - `dist/manifest.json` を選択

   **Safari:**
   - Safari > 環境設定 > 拡張機能
   - 「開発」メニューを有効にする
   - 開発 > 拡張機能を読み込む
   - `dist` フォルダを選択

## 使用方法

1. カクヨムの小説ページにアクセスします
2. カクヨムの表示設定を開きます
3. 背景色の設定で「システム」を選択します
4. システムのテーマ設定（ダークモード/ライトモード）に合わせて、カクヨムの背景色が自動的に調整されます

## 開発

### 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番用ビルド
- `npm run build:chrome`: Chrome用ビルド
- `npm run build:firefox`: Firefox用ビルド
- `npm run build:safari`: Safari用ビルド
- `npm run typecheck`: TypeScriptの型チェック
- `npm run lint`: ESLintによるコードチェック
- `npm run format`: Prettierによるコードフォーマット
- `npm run zip`: ビルドしてzipファイルを作成

### 技術スタック

- TypeScript
- Vite
- WebExtensions API
- webextension-polyfill

## ライセンス

MIT
