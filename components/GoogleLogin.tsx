"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

declare global { interface Window { google: any } }

type GoogleLoginProps = {
    size?: "large" | "medium" | "small";
};

export default function GoogleLogin({ size = "large" }: GoogleLoginProps) {
    const { setGoogleToken } = useAuth()
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: any) => {
                    const token = response.credential
                    setGoogleToken(token)
                },
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleBtn"),
                { theme: "outline", size },
            );
        };
    }, [size]);

    return <div id="googleBtn" className="w-full [&>div]:!w-full [&>div]:!justify-center" />;
}