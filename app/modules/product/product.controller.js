const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ProductService = require("./product.service");
const { ProductFilterAbleFileds } = require("./product.constants");







// const insertIntoDB = catchAsync(async (req, res) => {

//   const data = req.body;
//   const image = req.file.path;
//   const images = req.files;
  
  
//   const result = await ProductService.insertIntoDB(data, image, images);
 
//   sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Product data created!!",
//       data: result
//   })
// })



// const insertIntoDB = catchAsync(async (req, res) => {
//   try {
//     const data = req.body;
//     const image = req.file ? `/media/${req.file.filename}` : null; // Handle single file
//     const images = req.files ? req.files.map((file) => `/media/${file.filename}`) : []; // Handle multiple files

//     const result = await ProductService.insertIntoDB(data, image, images);

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Product data created!!",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error inserting product:", error.message);
//     sendResponse(res, {
//       statusCode: 400,
//       success: false,
//       message: error.message,
//     });
//   }
// });

const insertIntoDB = catchAsync(async (req, res) => {
  try {
    console.log("Received files:", req.files); // Log received files
    console.log("Received body:", req.body); // Log received form data

    const data = req.body;
   
    const image = req.files?.["default_image"]?.[0]?.filename
      ? `/media/${req.files["default_image"][0].filename}`
      : null;

    const images = req.files?.["gallery_images"]
      ? req.files["gallery_images"].map((file) => `/media/${file.filename}`)
      : [];

    console.log("Processed Image Path:", image);
    console.log("Processed Gallery Images:", images);

    const result = await ProductService.insertIntoDB(data, image, images);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product data created!!",
      data: result,
    });
  } catch (error) {
    console.error("Error inserting product:", error.message);
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
});



const getAllFromDB = catchAsync(async (req, res) => {

  const filters = pick(req.query, ProductFilterAbleFileds);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  console.log('filters', req.query)


  const result = await ProductService.getAllFromDB(filters, options);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product data fetched!!",
      meta: result.meta,
      data: result.data
  })
})


const getDataById = catchAsync(async (req, res) => {

  const result = await ProductService.getDataById(req.params.id);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product data fetched!!",
      data: result
  })
})

const getArrivalDataById = catchAsync(async (req, res) => {

  const result = await ProductService.getArrivalDataById();
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Arrival Product data fetched!!",
      data: result
  })
})


const updateOneFromDB = catchAsync(async (req, res) => {
const {id} = req.params;
  const result = await ProductService.updateOneFromDB(id, req.body);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product update successfully!!",
      data: result
  })
})


const deleteIdFromDB = catchAsync(async (req, res) => {

  const result = await ProductService.deleteIdFromDB(req.params.id);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product delete successfully!!",
      data: result
  })
})

const getAllFromDBWithoutQuery = catchAsync(async (req, res) => {

  const result = await ProductService.getAllFromDBWithoutQuery();
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product data fetch!!",
      data: result
  })
})

 const ProductController = {
  getAllFromDB,
  insertIntoDB,
  getDataById,
  updateOneFromDB,
  deleteIdFromDB,
  getAllFromDBWithoutQuery,
  getArrivalDataById
}

module.exports = ProductController;