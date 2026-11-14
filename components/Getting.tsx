import { EVENT, directionsUrl, mapEmbedUrl } from "@/lib/event";
export default function Getting() {
  return (
    <section className="getting" id="map">
      <h2>Getting there</h2>
      <p>{EVENT.venue}, {EVENT.address}</p>
      <iframe title="Map to the venue" src={mapEmbedUrl()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <a className="btn" href={directionsUrl()} target="_blank" rel="noreferrer">Get directions</a>
    </section>
  );
}
