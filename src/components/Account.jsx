import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import Avatar from "./Avatar";

export default function Account({sesion}){
    const [loading,setLoading] = useState(true);
    const [username,setUsername] = useState(null);
    const [wedsite,setwebsite] = useState(null);
    const [avatarurl,setavatarurl] = useState(null);

    useEffect(()=>{
        async function getProfile() {
            setLoading(true);

            const { user } = sesion;
            const { data, error } = await supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();

            if (error) {
                console.warn(error);
            } else if (data) {
                setUsername(data.username);
                setwebsite(data.website);
                setavatarurl(data.setavatarurl);
            }
            setLoading(false);
        }
        getProfile();
    }, [sesion])

    async function updateProfile(event, avatarUrl){
        event.preventDefault();

        setLoading(true);
        const { user } = sesion;

        const updates = {
            id: user.id,
            username,
            wedsite,
            avatarUrl,
            updated_at: new Date(),
        };

        const { error} = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        } else {
            setavatarurl(avatarUrl);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={updateProfile} className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                id="username"
                type="text"
                required
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
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
            }}/>

            <div>
                <button className="button block primary" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                Sign Out
                </button>
            </div>
        </form>
    )
}