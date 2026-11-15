"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function FindInvite({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const router = useRouter();
  const go = () => { const c = code.replace(/[^a-z0-9]/gi, "").toUpperCase(); if (c) router.push(`/i/${c}`); };
  return (
    <div className="form">
      <label>Invitation code<input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="For example K7MQ4P" /></label>
      <button className="yes big" onClick={go}>Open my invitation</button>
      <p className="small">Your code is in the WhatsApp message we sent you.</p>
    </div>
  );
}
