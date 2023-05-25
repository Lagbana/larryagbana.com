import { createContext, useContext } from "react";
import { DataService } from "../services/DataService";

export const DataServiceContext = createContext<DataService | undefined>(
  undefined
);

export const useDataService = () => {
  const context = useContext(DataServiceContext);
  if (!context) {
    throw new Error("Data service must be within a data service provider!");
  }
  return context;
};
