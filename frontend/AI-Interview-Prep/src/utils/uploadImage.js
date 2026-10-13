import api from "./axioinstance";

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/auth/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.imageURL || data.url || data.imageUrl || "";
};
