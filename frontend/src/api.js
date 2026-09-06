import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export const analyzeBusiness = async (data) => {
  console.log("=================================");
  console.log("GRAMBIZ AI - SENDING TO BACKEND");
  console.log("=================================");
  console.log("REQUEST DATA:", data);

  try {
    const response = await API.post("/api/analyze", data);

    console.log("=================================");
    console.log("GRAMBIZ AI - BACKEND RESPONSE");
    console.log("=================================");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    // IMPORTANT
    return response.data;
  } catch (error) {
    console.error("=================================");
    console.error("GRAMBIZ AI - API ERROR");
    console.error("=================================");

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("ERROR DATA:", error.response.data);
    } else if (error.request) {
      console.error("REQUEST WAS SENT BUT NO RESPONSE RECEIVED");
      console.error(error.request);
    } else {
      console.error("ERROR:", error.message);
    }

    throw error;
  }
};

export default API;