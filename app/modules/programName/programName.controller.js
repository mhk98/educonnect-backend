const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ProgramNameService = require("./programName.service");
const { where } = require("sequelize");
const { ProgramNameFilterAbleFileds } = require("./programName.constants");


const insertIntoDB = catchAsync(async (req, res) => {


  const result = await ProgramNameService.insertIntoDB(req.body);
 
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Application successfully created!!",
      data: result
  })
})


const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ProgramNameFilterAbleFileds);
    // const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    console.log("filters", filters)
  const result = await ProgramNameService.getAllFromDB(filters);

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
  
  const result = await ProgramNameService.getDataById(id);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Application data fetch!!",
      data: result
  })
})


const updateOneFromDB = catchAsync(async (req, res) => {
    const {id} = req.params;
      const result = await ProgramNameService.updateOneFromDB(id, req.body);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Application update successfully!!",
          data: result
      })
    })
    
    
    const deleteIdFromDB = catchAsync(async (req, res) => {
        const {id} = req.params;
        console.log('deleteId',id)
    
      const result = await ProgramNameService.deleteIdFromDB(id);
      sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Application delete successfully!!",
          data: result
      })
    })

 const ProgramNameController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById
}

module.exports = ProgramNameController;