import axios from "axios";

export const handleFileInput = async (file) => {
  console.log(file)
  if (!file) {
    console.error('No file provided');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axios.post('http://localhost:9500/upload-Image', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return data;

  } catch (err) {
    console.error('File upload failed:', err);
    return null; // or throw the error, depending on your error handling strategy
  }
};
export const handleSubmit = async (image) => {
  console.log(image)
  const formData = new FormData();
  formData.append('file', image);

  try {
    const { data } = await axios.post('http://localhost:9500/upload-Image', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log(data);
    return data
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

