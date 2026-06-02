const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { ProgramUniversitySearchAbleFields } = require("./programUniversity.constants");
const ProgramUniversity = db.programUniversity;


const insertIntoDB = async (data) => {

  const result = await ProgramUniversity.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async (filters) => {
  // const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    if (searchTerm) {
      where[Op.or] = ProgramUniversitySearchAbleFields.map(field => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` },
      }));
    }

    if (Object.keys(filterData).length > 0) {
      const orConditions = Object.entries(filterData).map(([key, value]) => ({
        [key]: { [Op.eq]: value },
      }));

      if (where[Op.or]) {
        where[Op.or].push(...orConditions);
      } else {
        where[Op.or] = orConditions;
      }
    }

    return where;
  };

  // Initial filtering query
  let whereConditions = buildWhereConditions();

  let result = await ProgramUniversity.findAll({
    where: whereConditions,
    // offset: skip,
    // limit,
    // order: options.sortBy && options.sortOrder
    //   ? [[options.sortBy, options.sortOrder.toUpperCase()]]
    //   : [['createdAt', 'ASC']],
  });

  let total = await ProgramUniversity.count({ where: whereConditions });

  // If no results, fetch all data without filtering
  // if (result.length === 0) {
  //   whereConditions = {}; // Clear filters
  //   result = await ProgramUniversity.findAll({
  //     offset: skip,
  //     limit,
  //     order: options.sortBy && options.sortOrder
  //       ? [[options.sortBy, options.sortOrder.toUpperCase()]]
  //       : [['createdAt', 'ASC']],
  //   });
  //   total = await ProgramUniversity.count(); // Count all records
  // }

  return {
    // meta: { total, page, limit },
    data: result,
  };
};


  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await ProgramUniversity.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await ProgramUniversity.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await ProgramUniversity.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const ProgramUniversityService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProgramUniversityService;