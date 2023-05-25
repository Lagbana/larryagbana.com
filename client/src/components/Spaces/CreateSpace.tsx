import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useDataService } from "../../hooks/useDataService";
import { NavLink } from "react-router-dom";

export function CreateSpace() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState("");

  const dataService = useDataService();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (name && location) {
      const id = await dataService.createSpace(name, location, photo);
      setActionResult(`Created space with id: ${id}`);
      setName("");
      setLocation("");
    } else {
      setActionResult("Please provide a name and a location!");
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.name === "name") {
      setName(event.target.value);
    }
    if (event.target.name === "location") {
      setLocation(event.target.value);
    }
    if (event.target.name === "photo") {
      if (event.target.files && event.target.files[0]) {
        setPhoto(event.target.files[0]);
      }
    }
  };

  if (!dataService.isAuthorized()) {
    return <NavLink to={"/login"}>Please login</NavLink>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <br />
        <input name={"name"} value={name} onChange={handleChange} />
        <br />
        <label>Location:</label>
        <br />
        <input name={"location"} value={location} onChange={handleChange} />
        <br />
        <label>Photo:</label>
        <br />
        <input type={"file"} name={"photo"} onChange={handleChange} />
        <br />
        <br />
        {photo ? <DisplayPhoto photo={photo} /> : null}
        <br />
        <input type={"submit"} value={"Create space"} />
      </form>
      {actionResult ? <h3>{actionResult}</h3> : null}
    </>
  );
}

function DisplayPhoto({ photo }: { photo: File }) {
  const localPhotoURL = URL.createObjectURL(photo);
  return <img alt='' src={localPhotoURL} style={{ maxWidth: "200px" }} />;
}
