import apiClient from "../client";

export const formsService = {
  submitContact: (payload) => apiClient.post("/contact", payload),
  submitEnquiry: (payload) => {
    if (payload instanceof FormData) {
      return apiClient.post("/enquiry", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return apiClient.post("/enquiry", payload);
  },
  subscribe: (payload) => apiClient.post("/subscribe", payload),
  getQrCode: () => apiClient.get("/qr/generate-qr", { responseType: "text" }),
};
