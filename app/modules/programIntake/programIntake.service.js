const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const ProgramIntake = db.programIntake;


const insertIntoDB = async (data) => {

  const result = await ProgramIntake.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await ProgramIntake.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await ProgramIntake.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await ProgramIntake.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await ProgramIntake.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const ProgramIntakeService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProgramIntakeService;