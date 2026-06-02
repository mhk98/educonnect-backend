const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Tests = db.tests;


const insertIntoDB = async (data) => {

  const result = await Tests.create(data);

  console.log('Tests', result)
  return result
};



const getAllFromDB = async () => {
  
    const result = await Tests.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await Tests.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await Tests.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    const {examinationDate, waiver, overallScore, listening, reading, writing, speaking, trfNo} = payload;

    const data = {
      examinationDate: examinationDate === "" ? undefined : examinationDate,
      waiver: waiver === "" ? undefined : waiver,
      overallScore: overallScore === "" ? undefined : overallScore,
      listening: listening === "" ? undefined : listening,
      reading: reading === "" ? undefined : reading,
      writing: writing === "" ? undefined : writing,
      speaking: speaking === "" ? undefined : speaking,
      trfNo: trfNo === "" ? undefined : trfNo,
     
    };

    console.log("Tests", data)
    
    const result = await Tests.update(data,{
      where:{
        user_id:id
      }
    })
  
  
    return result
  
  };


const TestsService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = TestsService;