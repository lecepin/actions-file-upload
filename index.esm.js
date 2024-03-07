import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let dmgFile = null;

// 特定文件上传
// const packsDir = join(__dirname, "packs");
// try {
//   const files = fs.readdirSync(packsDir);
//   for (let file of files) {
//     if (extname(file).toLowerCase() === ".dmg") {
//       dmgFile = join(packsDir, file);
//       break;
//     }
//   }
// } catch (error) {
//   console.error("Error reading directory", error.message);
//   process.exit(1);
// }

// if (!dmgFile) {
//   console.log("No .dmg file found in directory.");
//   process.exit(1);
// }

if (dmgFile) {
  const form = new FormData();
  form.append("fileToUpload", fs.createReadStream(dmgFile));

  const config = {
    headers: {
      ...form.getHeaders(),
    },
    onUploadProgress: (progressEvent) => {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`${percentCompleted}% completed`);
    },
  };

  axios
    .post("http://127.0.0.1:3003/upload", form, config)
    .then((response) => {
      console.log("File uploaded successfully", response.data);
    })
    .catch((error) => {
      console.error(
        "Error uploading file",
        error.response ? error.response.data : error.message
      );
    });
}
