"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function FindInvite() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const go = () => code.trim() && router.push(`/i/${code.trim().toLowerCase()}`);
  return (
    <div className="form">
      <label>Invitation code<input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="For example 3f9a1c07be" /></label>
      <button className="yes big" onClick={go}>Open my invitation</button>
      <p className="small">Your code is the last part of the link we sent you, or you can simply tap that link.</p>
    </div>
  );
}
