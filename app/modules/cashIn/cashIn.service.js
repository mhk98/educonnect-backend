const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const CashIn = db.cashIn;



const insertIntoDB = async (data) => {

  console.log("data", data)
  const result = await CashIn.create(data);

  return result
};



const getAllFromDB = async () => {
  
    const result = await CashIn.findAll()
  
    return result
  };
const getAllDataById = async (id) => {
  
    const result = await CashIn.findAll({
      where: {
        user_id:id
      }
    })
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await CashIn.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

  
  const {amount, paymentReason, refundCondition, status, user_id} = payload;


  const data = {
    amount: amount === "" ? undefined : amount,
    paymentReason: paymentReason === "" ? undefined : paymentReason,
    refundCondition: refundCondition === "" ? undefined : refundCondition,
    status: status === "" ? undefined : status,
    user_id: user_id === "" ? undefined : user_id,

  }
  
    const result = await CashIn.update(data, {
      where: {
        id: id,
      }
    });
  
    return result;
  };
  


const CashInService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById
};

module.exports = CashInService;