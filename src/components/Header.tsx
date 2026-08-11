import { useEffect, useState } from 'react'

interface Props {
  stats: {
    total: number
    stars: number
    languages: number
    publicCount: number
  }
}

export function Header({ stats }: Props) {
  // 未認証の api.github.com は 60req/h/IP で制限され、超過時も JSON ボディ付きの
  // 403 が返る（fetch は reject しない）。アバターは常に出したいので、
  // レート制限を受けない固定 URL を既定にし、API はプロフィール補強のみに使う。
  const [bio, setBio] = useState('Software Engineer')

  useEffect(() => {
    fetch('https://api.github.com/users/sugasaki')
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (user?.bio) setBio(user.bio)
      })
      .catch(() => {
        /* プロフィール取得は任意。失敗時は既定値のまま */
      })
  }, [])

  return (
    <header className="header">
      <div className="header-top">
        <img
          className="avatar"
          src="https://github.com/sugasaki.png"
          alt="sugasaki"
          width={72}
          height={72}
        />
        <div className="title-block">
          <h1>
            suga<span className="accent">saki</span>
          </h1>
          <p className="subtitle">{bio}</p>
        </div>
      </div>
      <div className="stats-row">
        <Stat value={stats.total} label="Repositories" />
        <Stat value={stats.stars} label="Stars" />
        <Stat value={stats.languages} label="Languages" />
        <Stat value={stats.publicCount} label="Public" />
      </div>
    </header>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
