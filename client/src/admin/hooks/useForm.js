import { useState } from "react";

export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setValues(initialState);

  return { values, setValues, handleChange, setValue, reset };
};
