const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { sslService } = require("../ssl/ssl.service");
const Payment = db.payment;



// const insertIntoDB = async (data) => {

//   const {  amount, paymentReason, refundCondition, paymentStatus, user_id, filePath} = data;

//   const user = await User.findOne({
//     where: {
//       id: user_id
//     }
//   });

//   if (!user) {
//     throw new ApiError(404, `User with ID ${user_id} does not exist.`);
    
//   }

//   const info = {
//     amount,
//     paymentReason,
//     refundCondition,
//     paymentStatus,
//     user_id:user.id,
//     filePath,
//   }

//   const result = await Payment.create(info);

//   return result
// };

const initPayment = async (data) => {

 const paymentSession = await sslService.initPayment({

      total_amount: data.total_amount,
      tran_id: data.tran_id, // use unique tran_id for each api call
      cus_name: data.cus_name,
      cus_email: data.cus_email,
      cus_add1: data.cus_add1,
      cus_add2: data.cus_add2,
      cus_phone: data.cus_phone,
 })

      await Payment.create({
        data: data.amount,
        transactionId: data.tran_id,
        user_id: data.user_id
      })
      return paymentSession.redirectGatewayURL;

};


const webhook = async (payload) => {

  if(!payload || !payload?.status || payload?.status !== 'VALID'){
    return {
      message: 'Invalid payment'
    }
  }
  const result = await sslService.validate(payload)
  
  if(result?.status !== 'VALID') {
    return {
      message: 'Payment failed'
    }
  }

  const {tran_id} = result;
  await Payment.update({
    where: {
      transactionId: tran_id
    },
    data: {
      status: PaymentStatus.PAID,
      paymentGatewayData: payload
    }
  })
  // return result

  return {
    message: "Payment Success"
  }
}

const insertIntoDB = async (data) => {

 
  const result = await Payment.create(data);

  return result
};



const getAllFromDB = async () => {
  
    const result = await Payment.findAll()
  
    return result
  };
const getAllDataById = async (id) => {
  
    const result = await Payment.findAll({
      where: {
        user_id:id
      }
    })
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await Payment.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {
  
    const result = await Payment.update(payload, {
      where: {
        id: id,
      }
    });
  
    return result;
  };
  


const PaymentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
  initPayment,
  webhook
};

module.exports = PaymentService;