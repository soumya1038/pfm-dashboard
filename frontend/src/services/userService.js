import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/user/profile");
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
};

export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    
    const response = await api.post("/user/profile/picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.put("/user/password", { currentPassword, newPassword });
    return response.data;
};

export const deleteUserAccount = async () => {
    const response = await api.delete("/user/account");
    return response.data;
};
