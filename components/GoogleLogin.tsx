"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

declare global { interface Window { google: any } }

export default function GoogleLogin() {
    const { googleLogin } = useAuth()
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: any) => {
                    const res = await fetch("/api/auth/google", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: response.credential }),
                    });
                    const data = await res.json();
                    const token = data.token
                    await googleLogin(token)
                },
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleBtn"),
                { theme: "outline", size: "large" }
            );
        };
    }, []);

    return <div id="googleBtn" />;
}