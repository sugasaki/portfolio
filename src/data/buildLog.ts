import type { BuildLogEntry } from '../types'

/**
 * 公開用 Build Log の正本。
 *
 * GitHub から収集した生データをそのまま置かず、公開可能な表現へ手で整えてから追加する。
 * Private リポジトリは url を持たせず、内部の Issue / PR 番号や認証構成を含めない。
 */
export const BUILD_LOG: BuildLogEntry[] = [
  {
    id: '2026-08-07--2026-08-14',
    period: '2026.08.07 — 08.14',
    title: 'What I built this week.',
    intro:
      '新しいアプリを形にする速度と、実際に使い続けられる品質の両方に取り組んだ。完成品だけでなく、何に困り、どう考え、どこまで前へ進めたかを残す。',
    metrics: [
      { value: 12, label: 'Projects' },
      { value: 186, label: 'Commits' },
      { value: 103, label: 'Pull requests' },
      { value: 96, label: 'Merged' },
    ],
    projects: [
      {
        id: 'memorybar',
        title: 'MemoryBar',
        url: 'https://github.com/sugasaki/memorybar',
        isPrivate: false,
        tagline: '正確さと、毎日使える軽さを両立した Mac メモリモニタ',
        story:
          '新規アプリの初期実装から、実測による数値合わせ、画面の磨き込み、配布と自動更新までを一週間で進めた。',
        problem: '既存のメモリ表示は、macOS のアクティビティモニタと値がずれやすい。',
        outcome:
          '内訳、負荷の高いアプリ、フローティング表示、ログイン時起動まで、日常利用に必要な流れを整えた。',
        counts: { commits: 93, pullRequests: 44, issues: 41, comments: 21, reviews: 9 },
      },
      {
        id: 'wan-navi-v3',
        title: 'わんなび刷新版',
        isPrivate: true,
        tagline: '距離の意味から設計し直した、Expo + MapLibre のナビアプリ',
        story:
          'データ契約とルート計算を先に固め、その上にモバイル画面を積み上げた。仕様書と実装を対にして進めている。',
        problem:
          '現在地、コース逸脱、チェックポイント到着の意味が曖昧だと、画面ごとに判断が食い違う。',
        outcome: 'コース選択・描画、現在地、記録ピン、CP 詳細、設定まで M0-c を完了した。',
        counts: { commits: 33, pullRequests: 32, comments: 1 },
      },
      {
        id: 'wan-navi',
        title: 'わんなび',
        isPrivate: true,
        tagline: '既存サービスの位置予測と大会運用画面を改善',
        story:
          'group モードの CP 表示、予測位置の外挿、スマホ操作性、全チェックポイント通過時刻の表示を改善した。',
        problem: '同じ場所にいる参加者の予測位置が散らばり、スマホでは操作要素が重なっていた。',
        outcome: '予測計算を安定化し、運営側が参加者ごとの通過状況を追える表示を追加した。',
        counts: { commits: 11, pullRequests: 5, issues: 2, comments: 17, reviews: 2 },
      },
      {
        id: 'stayput',
        title: 'StayPut',
        isPrivate: true,
        tagline: 'スリープ復帰で崩れたウィンドウ配置を、正しく元へ戻す',
        story:
          '復元できなかったのに成功と表示する経路を修正し、失敗の内訳と Spaces の UUID 対応を追加した。',
        problem: 'マルチディスプレイ環境では、画面や Spaces の識別が再接続のたびに変わりうる。',
        outcome: '失敗を観測できるようにし、復元先の誤認を減らす土台を整えた。',
        counts: { commits: 11, pullRequests: 3, issues: 10, comments: 1 },
      },
      {
        id: 'kml-to-gpx',
        title: 'KML to GPX',
        isPrivate: true,
        tagline: '地図データを、迷わず選び、確認し、GPX へ保存する',
        story:
          '実データで不要ポイントを分類し、アップロードから保存までを 4 ステップの UI へまとめた。',
        problem: 'KML / KMZ には案内点や km マーカーが混ざり、残すルートを判断しづらい。',
        outcome: '変換コアを分離し、生成 GPX と地図操作を実フローで検証。次の 3 スプリントも準備した。',
        counts: { commits: 7, pullRequests: 9, issues: 7 },
      },
      {
        id: 'dandori',
        title: '段取り',
        isPrivate: true,
        tagline: 'イベント準備を、本番日から静かに逆算する',
        story:
          'React と Supabase の土台、RLS、デモモード、更新通知を整え、「静かな段取り表」のデザインを反映した。',
        problem: '汎用 ToDo では、イベント固有の準備と締切を毎回組み直す必要がある。',
        outcome: 'テンプレートから相対期日を逆算し、接続設定なしでも価値を試せる状態へ進めた。',
        counts: { commits: 7, pullRequests: 2, issues: 4, comments: 8 },
      },
      {
        id: 'portfolio',
        title: 'Portfolio',
        url: 'https://github.com/sugasaki/portfolio',
        isPrivate: false,
        tagline: '全件一覧から、説明できる作品集へ',
        story:
          'Featured と Archive の二層構成、OGP、年別表示、スクリーンショット、改名時の回帰テストを追加した。',
        problem: 'リポジトリ一覧だけでは、何を作り、なぜ価値があるのかが伝わらない。',
        outcome: '代表作を物語付きで見せ、全履歴も検索できる構成へ改善した。',
        counts: { commits: 8, pullRequests: 8, issues: 3 },
      },
      {
        id: 'stream-deck-status',
        title: 'Claude / Codex Status',
        url: 'https://github.com/sugasaki/stream-deck-claude-codex-status',
        isPrivate: false,
        tagline: 'AI エージェントの状態と確認待ちを、Stream Deck で見る',
        story:
          'Claude Code と Codex のタスク状態、使用量、確認待ち、タスク操作を Stream Deck Neo へ載せた。',
        problem: '複数のエージェントを動かすと、どれが待機中かを画面で追い続ける必要がある。',
        outcome: '実機のキーから状態確認と操作ができ、日英ドキュメント付きで公開可能な形にした。',
        counts: { commits: 13 },
      },
      {
        id: 'local-llm-evaluations',
        title: 'Local LLM Evaluations',
        isPrivate: true,
        tagline: 'Mac 上の LLM 計測を、条件付きの記録として残す',
        story: '評価リポジトリを作成し、ベンチマーク順位と計測条件をレビューして修正した。',
        problem: '単発計測を一般的な性能順位として見せると、再現性と解釈を誤る。',
        outcome: '一回の計測であることと、比較に必要な条件を明記した。',
        counts: { commits: 1, issues: 1, comments: 6 },
      },
      {
        id: 'runspot',
        title: 'RunSpot',
        isPrivate: true,
        tagline: 'スポット情報を扱う画面と、公開・管理の境界を整理',
        story:
          'DB 型 UI の刷新を検証し、公開閲覧と管理操作を分離する認証アーキテクチャを整理した。',
        problem: '管理画面を認証で守ると、匿名で見せたい公開情報まで閉じてしまう。',
        outcome: '公開側と管理側を分ける設計方針を確立した。',
        counts: { comments: 8 },
      },
      {
        id: 'gpx-route-creator',
        title: 'GPX Route Creator',
        isPrivate: true,
        tagline: 'ルートの別案を複製し、切り替え、比較する',
        story: '既存の実装上で、全ルート複製と区間比較の仕様・操作を検証した。',
        problem: '一つのルートだけでは、代替案を保ちながら区間を比較しにくい。',
        outcome: '別案を壊さず比較できる操作モデルを詰めた。',
        counts: { comments: 7 },
      },
      {
        id: 'obsidian-mcp-server',
        title: 'Obsidian MCP Server',
        isPrivate: true,
        tagline: 'OneDrive 上の Vault へ、Markdown を安全に書き込む',
        story: 'OneDrive を正本にしたリモート MCP サーバーと、GitHub Actions の土台を作った。',
        problem: 'クラウド上の Vault をローカル同期に依存せず、競合を避けて更新したい。',
        outcome: 'Microsoft Graph 経由の書き込みと ETag ベースの更新条件を実装した。',
        counts: { commits: 2 },
      },
    ],
  },
]
