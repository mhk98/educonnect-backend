const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const ProgramCountry = db.programCountry;


const insertIntoDB = async (data) => {

  const result = await ProgramCountry.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await ProgramCountry.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await ProgramCountry.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await ProgramCountry.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await ProgramCountry.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const ProgramCountryService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProgramCountryService;