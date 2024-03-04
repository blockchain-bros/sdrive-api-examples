import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import mime from "mime-types";
import path from "path";
dotenv.config();
async function uploadVideo(fileStream, filename, callback_url) {
  let formData = new FormData();
  let apikey = process.env.apikey;
  let base_url = process.env.base_url || "https://sdrive.app/api/v3";
  let mimetype = mime.lookup(path.extname(filename));
  formData.append("fileupload", fileStream, {
    filename: filename,
    contentType: mimetype,
  });
  formData.append("callback_url", callback_url);
  formData.append("apikey", apikey);

  return await axios
    .post(base_url + "/upload/video", formData, {
      headers: formData.getHeaders(), // Set headers from formData
    })
    .catch((error) => {
      const errorInfo = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      };
      throw Error(JSON.stringify(errorInfo));
    })
    .then((response) => {
      return response.data;
    });
}

// Example usage
(async () => {
  const inputPath = process.argv[2];
  const filename = inputPath.split("/").pop();
  const callback_url = "https://jobs.sdrive.app/callback";
  const fileStream = fs.createReadStream(inputPath);
  try {
    const response = await uploadVideo(fileStream, inputPath, callback_url);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();