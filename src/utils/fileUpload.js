export const handleFileUpload = async (file) => {
  try {
    // Simulating API request to save the file
    const response = await saveFileToServer(file);

    // Simulating server response with the path and status
    return response;
  } catch (error) {
    return { status: "failed", error: error };
  }
};

const saveFileToServer = (file) => {
  return new Promise((resolve, reject) => {
    // Simulating server-side processing and response
    setTimeout(() => {
      const path = "/uploads/" + file.name;
      const status = "success";

      resolve({ path, status });
    }, 2000);
  });
};
