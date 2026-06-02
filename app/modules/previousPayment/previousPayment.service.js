const db = require("../../../models");
const PreviousPayment = db.previousPayment;



const insertIntoDB = async (data) => {

  const result = await PreviousPayment.create(data);

  return result
};



const getAllFromDB = async () => {
  
    const result = await PreviousPayment.findAll()
  
    return result
  };
const getAllDataById = async (id) => {
  
    const result = await PreviousPayment.findAll({
      where: {
        user_id:id
      }
    })
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await PreviousPayment.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

  
  
  
    const result = await PreviousPayment.update(payload, {
      where: {
        id: id,
      }
    });
  
    return result;
  };
  


const PreviousPaymentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById
};

module.exports = PreviousPaymentService;