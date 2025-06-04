// export const extractPublicId = (url) => {
//   if (!url) return null;
//   const parts = url.split("/");
//   const filename = parts.pop(); // get the last part of the URL
//   return filename.split(".")[0]; // remove the extension
// };


export const extractPublicId = (url) => {
  if (!url) return null;

  // Match folder/filename or just filename
  const regex = /upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
