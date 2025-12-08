const cloudinary = require('../config/configuration.images');
const logger = require('../utils/utilitaire.logs');

async function uploadImage(fileBuffer, folder = 'allo-tracteur') {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) {
            logger.error('Erreur upload Cloudinary:', error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    logger.error('Erreur lors de l\'upload:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
}

async function uploadBase64(base64String, folder = 'allo-tracteur') {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: 'image'
    });
    logger.info(`Image uploadée: ${result.public_id}`);
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    logger.error('Erreur upload base64:', error);
    throw new Error('Erreur lors de l\'upload de l\'image');
  }
}

async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image supprimée: ${publicId}`);
    return result;
  } catch (error) {
    logger.error('Erreur suppression image:', error);
    throw new Error('Erreur lors de la suppression de l\'image');
  }
}

async function uploadMultiple(files, folder = 'allo-tracteur') {
  const uploadPromises = files.map(file => uploadImage(file.buffer, folder));
  return await Promise.all(uploadPromises);
}

module.exports = {
  uploadImage,
  uploadBase64,
  deleteImage,
  uploadMultiple
};
