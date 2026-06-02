const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const PaymentService = require("./payment.service");
const ApiError = require("../../../error/ApiError");


// const insertIntoDB = catchAsync(async (req, res) => {

//   const {amount, paymentReason, refundCondition, paymentStatus, user_id  } = req.body;

//   // const filePath = req.file.path.replace(/\\/g, "/");
 

//   const data = {
//     amount, paymentReason, refundCondition, paymentStatus, user_id,
//    file: req.file ? req.file.path : undefined
//   }

//   const result = await PaymentService.insertIntoDB(data);
 
//   sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Application successfully created!!",
//       data: result
//   })
// })


const initPayment = catchAsync(async (req, res) => {

 const result = await PaymentService.initPayment(req.body)

  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment init successfully!!",
      data: result
  })
})

const webhook = catchAsync(async (req, res) => {

 const result = await PaymentService.webhook(req.body)

  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment webhook successfully!!",
      data: result
  })
})


const getAllFromDB = catchAsync(async (req, res) => {

  const result = await PaymentService.getAllFromDB();
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Application data fetch!!",
      data: result
  })
})

const getAllDataById = catchAsync(async (req, res) => {

  const {id} = req.params;
  
  const result = await PaymentService.getAllDataById(id);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Application data fetch!!",
      data: result
  })
})


const updateOneFromDB = catchAsync(async (req, res) => {
    const {id} = req.params;
      const result = await PaymentService.updateOneFromDB(id, req.body);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Application update successfully!!",
          data: result
      })
    })
    
    
    const deleteIdFromDB = catchAsync(async (req, res) => {
        const {id} = req.params;
        console.log('deleteId',id)
    
      const result = await PaymentService.deleteIdFromDB(id);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Application delete successfully!!",
          data: result
      })
    })

 const PaymentController = {
  getAllFromDB,
  getAllDataById,

  deleteIdFromDB,
  updateOneFromDB,
  initPayment,
  webhook
}

module.exports = PaymentController;