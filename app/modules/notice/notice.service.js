const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Notice = db.notice;


const insertIntoDB = async (data) => {

  const result = await Notice.create(data);

  console.log('Notice', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await Notice.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await Notice.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await Notice.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await Notice.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const NoticeService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = NoticeService;