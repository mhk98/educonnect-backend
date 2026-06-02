const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const ProgramYear = db.programYear;


const insertIntoDB = async (data) => {

  const result = await ProgramYear.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await ProgramYear.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await ProgramYear.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await ProgramYear.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await ProgramYear.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const ProgramYearService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProgramYearService;