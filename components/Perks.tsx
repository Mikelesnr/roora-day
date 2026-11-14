const s = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export default function Perks() {
  return (
    <div className="perks" aria-hidden="true">
      <span><svg {...s}><path d="M7 3h10c0 5.5-1.8 8-5 8S7 8.500 7 3z" /><path d="M12 11v9M8 21h8M7.300 7h9.400" /></svg></span>
      <span><svg {...s}><path d="M7 3v7M5 3v5a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M7 10v11" /><path d="M17 21V3c-2.500 1.500-3.500 4-3.500 7.500H17" /></svg></span>
    </div>
  );
}
