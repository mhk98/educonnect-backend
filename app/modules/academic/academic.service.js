const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Academic = db.academic;


const insertIntoDB = async (data) => {

  const result = await Academic.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await Academic.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await Academic.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await Academic.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    const {twelvethStartDate, twelvethEndDate, twelvethBoard, twelvethInstitution, twelvethLocation, 
      tenthStartDate, tenthEndDate, tenthBoard, tenthInstitution, tenthLocation} = payload;

    const data = {
      twelvethStartDate: twelvethStartDate === "" ? undefined : twelvethStartDate,
      twelvethEndDate: twelvethEndDate === "" ? undefined : twelvethEndDate,
      twelvethEndDate: twelvethEndDate === "" ? undefined : twelvethEndDate,
      twelvethBoard: twelvethBoard === "" ? undefined : twelvethBoard,
      twelvethInstitution: twelvethInstitution === "" ? undefined : twelvethInstitution,
      twelvethLocation: twelvethLocation === "" ? undefined : twelvethLocation,
      tenthStartDate: tenthStartDate === "" ? undefined : tenthStartDate,
      tenthEndDate: tenthEndDate === "" ? undefined : tenthEndDate,
      tenthBoard: tenthBoard === "" ? undefined : tenthBoard,
      tenthInstitution: tenthInstitution === "" ? undefined : tenthInstitution,
      tenthLocation: tenthLocation === "" ? undefined : tenthLocation,
    };

    console.log("academic", data)
    
    const result = await Academic.update(data,{
      where:{
        user_id:id
      }
    })
  
  
    return result
  
  };


const AcademicService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = AcademicService;