const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ProgramUniversityService = require("./programUniversity.service");
const { where } = require("sequelize");
const { ProgramUniversityFilterAbleFileds } = require("./programUniversity.constants");


const insertIntoDB = catchAsync(async (req, res) => {


  const result = await ProgramUniversityService.insertIntoDB(req.body);
 
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "University successfully created!!",
      data: result
  })
})


const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ProgramUniversityFilterAbleFileds);
    // const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    console.log("filters", filters)
  const result = await ProgramUniversityService.getAllFromDB(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "University data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {

  const {id} = req.params;
  
  const result = await ProgramUniversityService.getDataById(id);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "University data fetch!!",
      data: result
  })
})


const updateOneFromDB = catchAsync(async (req, res) => {
    const {id} = req.params;
      const result = await ProgramUniversityService.updateOneFromDB(id, req.body);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "University update successfully!!",
          data: result
      })
    })
    
    
    const deleteIdFromDB = catchAsync(async (req, res) => {
        const {id} = req.params;
        console.log('deleteId',id)
    
      const result = await ProgramUniversityService.deleteIdFromDB(id);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "University delete successfully!!",
          data: result
      })
    })

 const ProgramUniversityController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById
}

module.exports = ProgramUniversityController;