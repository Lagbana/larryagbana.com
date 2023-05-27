import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { SpaceDetails } from "./SpaceDetails";
import { useDataService } from "../../hooks/useDataService";
import { type SpaceEntry } from "../../types";

export function Space() {
  const [spaces, setSpaces] = useState<Array<SpaceEntry>>([]);
  const [reservationText, setReservationText] = useState("");

  const dataService = useDataService();

  if (!dataService.isAuthorized()) {
    return <NavLink to={"/login"}>{"Please login"}</NavLink>;
  }

  useEffect(() => {
    const getSpaces = async () => {
      console.log("getting spaces ...");
      const fetchedSpaces = await dataService.getSpaces();
      console.log("Results: ", fetchedSpaces);
      setSpaces(fetchedSpaces);
    };
    getSpaces();
  }, []);

  const reserveSpace = useCallback(
    async (spaceId: string, spaceName: string) => {
      const reservationResult = await dataService.reserveSpace(spaceId);
      setReservationText(
        `You reserved ${spaceName}, reservation id: ${reservationResult}`
      );
    },
    []
  );

  return (
    <>
      <h2>Welcome to the Space page! 🪐</h2>
      {reservationText ? <h3>{reservationText}</h3> : null}
      {spaces.map((spaceEntry) => (
        <SpaceDetails
          key={spaceEntry.id}
          id={spaceEntry.id}
          name={spaceEntry.name}
          location={spaceEntry.location}
          photoUrl={spaceEntry.photoUrl}
          reserveSpace={reserveSpace}
        />
      ))}
    </>
  );
}
