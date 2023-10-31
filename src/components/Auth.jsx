import { useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert ( 'Check you email for de login link' );
        }
        setLoading(false);
    };

    return (
        <div className="row flex flex-center">
            <div style={{borderRadius: "5px", padding: "5px"}}>
                <h1 className="header">
                    Supabase + React
                </h1>
                <p className="description">Sign in via magic link with you email below</p>
                <form className="form-widget" onSubmit={handleLogin}>
                    <div style={{borderRadius: "5px", padding: "5px"}}>
                        <input 
                            className="inputField"
                            type="email"
                            placeholder={email}
                            required = {true}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </input>
                    </div>
                    <div style={{borderRadius: "5px", padding: "5px"}}>
                        <button className={'button block'} disabled = {loading} >
                            { loading ? <span>Loading</span> : <span>Send Magic Link</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}