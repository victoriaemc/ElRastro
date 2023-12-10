const CloudinaryImage = (CloudinaryImageId) => {

    const baseImageUrl = "https://res.cloudinary.com/daef41lib/image/upload/v1701452747/";
    const myImageUrl = baseImageUrl + CloudinaryImageId + ".jpg" 
  return (
    myImageUrl
  );
};

export default CloudinaryImage;