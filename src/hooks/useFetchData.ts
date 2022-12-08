import axios from "axios";
import { useEffect, useState } from "react";
import { IUsers, IUsersMap, TRequestStatus } from "../types/dashboard.types";

export const useFetchData = (url: string) => {
  const [fetchStatus, setFetchStatus] = useState<TRequestStatus>("idle");
  const [data, setData] = useState<IUsersMap>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setFetchStatus("pending");
      try {
        const response = await axios.get<IUsers[]>(url);

        // convert array into map
        const dataCopy: IUsersMap = {};
        response.data.forEach((ele) => {
          dataCopy[ele.id] = { ...ele, isSelected: false };
        });

        setData(dataCopy);
        setFetchStatus("fulfilled");
      } catch (error) {
        setError("Something went wrong. Failed to fetch users data.");
        setFetchStatus("rejected");
      }
    };

    fetchData();
  }, [url]);

  return { fetchStatus, data, error };
};
