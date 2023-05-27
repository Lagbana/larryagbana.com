import { type SpaceEntry } from "../../types";
import genericImage from "../../assets/racoon.webp";
import "./SpaceDetails.css";

interface SpaceDetailsProps extends SpaceEntry {
  reserveSpace: (spaceId: string, spaceName: string) => void;
}
export function SpaceDetails({
  id,
  name,
  location,
  photoUrl,
  reserveSpace,
}: SpaceDetailsProps) {
  return (
    <div className='spaceComponent'>
      {photoUrl ? <img src={photoUrl} /> : <img src={genericImage} />}
      <label className='name'>{name}</label>
      <br />
      <label className='location'>{location}</label>
      <br />
      <button onClick={() => reserveSpace(id, name)}>{"Reserve"}</button>
    </div>
  );
}
