/**
 * 注目プロジェクトのキュレーション情報（手書き・正本）。
 *
 * public/repos.json は scripts/fetch-repos.sh が丸ごと上書きする機械生成ファイルなので、
 * 手で書いた情報は必ずこちら側に置く。`repo` をキーに読み込み時に結合され、
 * 言語・更新日・スター数・公開/非公開は repos.json 側の値が使われる。
 *
 * 掲載順がそのまま画面の表示順になる。先頭の1件は大きく（リード扱いで）表示される。
 */
export interface FeaturedProject {
  /** public/repos.json の name と一致させる。一致しない場合は掲載されない */
  repo: string
  /** 画面上の表示名。リポジトリ名と違う「作品としての名前」を持てる */
  title: string
  /** 一行の要約 */
  tagline: string
  /** 何を作ったか・なぜ作ったか。1〜3文 */
  story: string
  /** 主要技術。多くても5個程度に絞る */
  tech: string[]
  /** public/shots/ 配下の画像ファイル名。未設定ならフォールバック表示になる */
  shot?: string
  /** 公開URL。Private リポジトリでも画面を見せられる場合に使う */
  liveUrl?: string
}

export const FEATURED: FeaturedProject[] = [
  {
    repo: 'memorybar',
    title: 'MemoryBar',
    tagline: 'アクティビティモニタと1バイトも食い違わないメモリモニタ',
    story:
      'メニューバー常駐のメモリ表示アプリは数あるが、どれもアクティビティモニタと値がずれる。同じ Mach API（host_statistics64）を同じ計算式で読み、実測で検証しながら「本当の値」を出すことに徹した。残容量・使用量・使用率の切替、内訳とメモリを食っているアプリの表示、常時出しておけるフローティングウィンドウを備える。外部依存なしで常駐時 CPU 約1%。',
    tech: ['Swift 6', 'SwiftUI', 'MenuBarExtra', 'Mach API', 'SPM'],
  },
  {
    repo: 'stayput',
    title: 'StayPut',
    tagline: 'スリープ復帰で崩れたウィンドウ配置を元に戻す',
    story:
      '3画面環境の Mac はスリープから復帰するたびにウィンドウ配置が崩れる。配置を記憶して復元する常駐アプリ。調査の結果スペースの復元は OS 上不可能と判明したため、位置とサイズの復元に範囲を絞った。ディスプレイの UUID が変わりうることも実機で確認し、矩形による対応付けをフォールバックに持たせている。',
    tech: ['Swift', 'AppKit', 'CoreGraphics', 'SkyLight'],
  },
  {
    repo: 'dandori',
    title: '段取り (Dandori)',
    tagline: '主催イベントの準備を本番日から逆算するタスク管理',
    story:
      '汎用の ToDo ではなく「自分が主催するイベントの準備」に特化。イベント種別ごとにタスクと相対期日を持つテンプレートを定義し、本番日を入れると期日が自動で逆算される。準備中に気づいたタスクをテンプレートへ還元できるので、回を重ねるほどテンプレートが育つのが中心的な価値。',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Supabase'],
  },
  {
    repo: 'kml-to-gpx',
    title: 'KML to GPX',
    tagline: 'ブラウザだけで完結する KML/KMZ → GPX 変換',
    story:
      '地図サービスから書き出した KML/KMZ には右折・左折といった案内ポイントが大量に混ざる。それを整理してチェックポイントだけを残し、GPX 1.1 として書き出す。ファイルはサーバーへ送らずブラウザ内だけで処理し、変換結果は地図でプレビューできる。',
    tech: ['TypeScript', 'React', 'MapLibre GL'],
  },
  {
    repo: 'gpx2geojson-wasm',
    title: 'gpx2geojson-wasm',
    tagline: 'Rust を WebAssembly に載せた GPX → GeoJSON 変換器',
    story:
      'GPX から GeoJSON への変換を Rust で書き、WebAssembly にコンパイルしてブラウザから呼べるようにしたもの。大きなトラックログを扱うときの変換速度を狙った実装。',
    tech: ['Rust', 'WebAssembly', 'wasm-bindgen'],
  },
  {
    repo: 'supabase-rls-checker',
    title: 'Supabase RLS Checker',
    tagline: 'RLS の設定漏れを自動で見つける Chrome 拡張',
    story:
      'Supabase は Row Level Security を有効にし忘れるとテーブルが素通しになる。管理画面を開いたときに設定状態を自動でチェックし、危険なテーブルを指摘する拡張機能。',
    tech: ['TypeScript', 'Chrome Extension', 'Supabase'],
  },
  {
    repo: 'bib-detection',
    title: 'ゼッケン番号の自動認識',
    tagline: 'マラソン大会の写真からゼッケン番号を読み取る',
    story:
      '大会写真に写ったゼッケンを検出し、番号を読み取る。YOLOv8 で検出し PaddleOCR で文字を起こす二段構成で、学習済みモデルは Docker で動かせるようにしてある。',
    tech: ['Python', 'YOLOv8', 'PaddleOCR', 'Docker'],
  },
  {
    repo: 'meeting-who-said-what',
    title: 'Who Said What',
    tagline: '会議の録画から話者つきの議事録を作るローカルツール',
    story:
      'Teams の録画を読み込み、話者分離 → 文字起こし → 議事録生成までを一気通貫で行う。会議の音声は外に出したくないので、すべてローカルで完結させている。',
    tech: ['Python', 'Tkinter', '話者分離', '音声認識'],
  },
]
