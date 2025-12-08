const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require('../config/configuration.images');
const logger = require('../utils/utilitaire.logs');

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret
});

async function uploadImage(file, folder = 'general', options = {}) {
  try {
    const uploadOptions = {
      folder: `allotracteur/${folder}`,
      resource_type: 'image',
      format: 'jpg',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    };

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    logger.info(`✅ Image uploadée: ${result.secure_url}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    logger.error('Erreur uploadImage:', error);
    throw new Error(`Échec upload image: ${error.message}`);
  }
}

async function uploadMultipleImages(files, folder = 'general') {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    logger.info(`✅ ${results.length} images uploadées`);
    return results;
  } catch (error) {
    logger.error('Erreur uploadMultipleImages:', error);
    throw error;
  }
}

async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      logger.info(`🗑️  Image supprimée: ${publicId}`);
      return true;
    } else {
      logger.warn(`⚠️  Échec suppression image: ${publicId}`);
      return false;
    }
  } catch (error) {
    logger.error('Erreur deleteImage:', error);
    throw error;
  }
}

async function deleteMultipleImages(publicIds) {
  try {
    const results = await cloudinary.api.delete_resources(publicIds);
    logger.info(`🗑️  ${Object.keys(results.deleted).length} images supprimées`);
    return results;
  } catch (error) {
    logger.error('Erreur deleteMultipleImages:', error);
    throw error;
  }
}

function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, quality, fetch_format: format }
    ]
  });
}

function getThumbnailUrl(publicId, size = 200) {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: size,
        height: size,
        crop: 'thumb',
        gravity: 'face',
        quality: 'auto:low',
        fetch_format: 'auto'
      }
    ]
  });
}

async function getImageDetails(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at
    };
  } catch (error) {
    logger.error('Erreur getImageDetails:', error);
    throw error;
  }
}

async function getAllImagesInFolder(folder) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `allotracteur/${folder}`,
      max_results: 500
    });

    return result.resources.map(resource => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      size: resource.bytes
    }));
  } catch (error) {
    logger.error('Erreur getAllImagesInFolder:', error);
    throw error;
  }
}

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getImageDetails,
  getAllImagesInFolder
};
