// helper function to get url from file and bucket id
import { storage } from "@/appwrite";
const getUrl = async (image: Image) => {
  // store and return url
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};

export default getUrl;