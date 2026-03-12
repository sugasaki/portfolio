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
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('Software Engineer')

  useEffect(() => {
    fetch('https://api.github.com/users/sugasaki')
      .then((r) => r.json())
      .then((user) => {
        setAvatarUrl(user.avatar_url)
        if (user.bio) setBio(user.bio)
      })
      .catch(() => {
        setAvatarUrl('https://github.com/sugasaki.png')
      })
  }, [])

  return (
    <header className="header">
      <div className="header-top">
        {avatarUrl && (
          <img className="avatar" src={avatarUrl} alt="sugasaki" width={72} height={72} />
        )}
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
