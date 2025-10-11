import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const AddressContext = createContext();
export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses();
    else setAddresses([]);
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error("❌ Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data) => {
    try {
      await axios.post("/addresses", data);
      await fetchAddresses();
    } catch (err) {
      console.error("❌ Error adding address:", err);
    }
  };

  const updateAddress = async (id, data) => {
    try {
      await axios.put(`/addresses/${id}`, data);
      await fetchAddresses();
    } catch (err) {
      console.error("❌ Error updating address:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`/addresses/${id}`);
      await fetchAddresses();
    } catch (err) {
      console.error("❌ Error deleting address:", err);
    }
  };

  return (
    <AddressContext.Provider
      value={{ addresses, loading, fetchAddresses, addAddress, updateAddress, deleteAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};
