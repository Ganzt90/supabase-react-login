import { useState, useEffect } from 'react'
import { supabase } from '../api/supabaseClient'

import Avatar from './Avatar'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }

    getProfile()
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className="form-widget">
        <fieldset style={{borderWidth: "0.5px", borderRadius: "5px", padding: "5px"}}>
            <legend>Edit User!</legend>
            <div style={{borderRadius: "5px", padding: "5px"}}>
                <label htmlFor="email">Email: </label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div style={{borderRadius: "5px", padding: "5px"}}>
                <label htmlFor="username">Name: </label>
                <input
                id="username"
                type="text"
                required
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div style={{borderRadius: "5px", padding: "5px"}}>
                <label htmlFor="website">Website: </label>
                <input
                id="website"
                type="url"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <Avatar
                url={avatar_url}
                size={150}
                onUpload={(event, url) => {
                    updateProfile(event, url)
                }}
                />

            <div style={{borderRadius: "5px", padding: "5px"}}>
                <button className="button block primary" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div style={{borderRadius: "5px", padding: "5px"}}>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                Sign Out
                </button>
            </div>
      </fieldset>
    </form>
  )
}