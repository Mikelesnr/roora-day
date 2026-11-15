const A = [
  { f: "prince.jpg", who: "Prince", frame: ["#4B5A2A", "#8A9A6B"], bg: ["#8A9A6B", "#4B5A2A"], tall: false },
  { f: "couple.jpg", who: "Prince and Tatenda", frame: ["#D9A021", "#EBD3A8"], bg: ["#C2571B", "#8E3F1B"], tall: true },
  { f: "tatenda.jpg", who: "Tatenda", frame: ["#8E3F1B", "#C2571B"], bg: ["#D9A021", "#C2571B"], tall: false },
];
export default function Arches({ className }: { className: string }) {
  return (
    <section className={className}>
      {A.map((a) => (
        <div key={a.f} className={`frame${a.tall ? " tall" : ""}`} style={{ background: `linear-gradient(160deg, ${a.frame[0]}, ${a.frame[1]})` }}>
          <div className="pic" role="img" aria-label={a.who} style={{ backgroundImage: `url(/photos/${a.f}), linear-gradient(160deg, ${a.bg[0]}, ${a.bg[1]})` }} />
        </div>
      ))}
    </section>
  );
}
