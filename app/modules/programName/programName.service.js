const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { ProgramNameSearchAbleFields } = require("./programName.constants");
const ProgramName = db.programName;


const insertIntoDB = async (data) => {

  const result = await ProgramName.create(data);

  console.log('Application', result)
  return result
};



const getAllFromDB = async (filters) => {
  // const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  // const buildWhereConditions = () => {
  //   const where = {};

  //   if (searchTerm) {
  //     where[Op.or] = ProgramNameSearchAbleFields.map(field => ({
  //       [field]: { [Op.iLike]: `%${searchTerm}%` },
  //     }));
  //   }

  //   if (Object.keys(filterData).length > 0) {
  //     const orConditions = Object.entries(filterData).map(([key, value]) => ({
  //       [key]: { [Op.eq]: value },
  //     }));

  //     if (where[Op.or]) {
  //       where[Op.or].push(...orConditions);
  //     } else {
  //       where[Op.or] = orConditions;
  //     }
  //   }

  //   return where;
  // };

  const buildWhereConditions = () => {
  const where = {};

  if (searchTerm) {
    where[Op.or] = ProgramNameSearchAbleFields.map(field => ({
      [field]: { [Op.iLike]: `%${searchTerm}%` },
    }));
  }

  Object.entries(filterData).forEach(([key, value]) => {
    where[key] = { [Op.eq]: value };
  });

  return where;
};


  // Initial filtering query
  let whereConditions = buildWhereConditions();

  let result = await ProgramName.findAll({
    where: whereConditions,
    // offset: skip,
    // limit,
    // order: options.sortBy && options.sortOrder
    //   ? [[options.sortBy, options.sortOrder.toUpperCase()]]
    //   : [['createdAt', 'ASC']],
  });

  let total = await ProgramName.count({ where: whereConditions });


  return {
    // meta: { total, page, limit },
    data: result,
  };
};

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await ProgramName.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await ProgramName.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    
    const result = await ProgramName.update(payload,{
      where:{
        id:id
      }
    })
  
  
    return result
  
  };


const ProgramNameService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProgramNameService;