const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const AdditionalDocument = db.additionalDocument;


const insertIntoDB = async (info, filePath) => {
  const data = {
    ...info, // Spread all properties like title, institution, user_id, etc.
    file: filePath
  };

  console.log("data", data);
  const result = await AdditionalDocument.create(data);
  console.log("AdditionalDocument", result);
  return result;
};




const getAllFromDB = async () => {
  
    const result = await AdditionalDocument.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await AdditionalDocument.findAll(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await AdditionalDocument.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {


    console.log("payload", payload)
    
    const result = await AdditionalDocument.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const AdditionalAdditionalDocumentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = AdditionalAdditionalDocumentService;