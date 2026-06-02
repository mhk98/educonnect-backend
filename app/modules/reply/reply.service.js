const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const NotificationService = require("../notification/notification.service");
const Reply = db.reply;
const Enquiries = db.enquiries;
const User = db.user;


const insertIntoDB = async (data) => {
  const { enquiry_id, user_id } = data;

  const result = await Reply.create(data);

   const enquiry = await Enquiries.findOne({
     where: {
       id: enquiry_id,
     },
   });
 
   if (!enquiry) {
     throw new ApiError(400, "Enquiry not found");
   }
 
   const user = await User.findOne({
     where: {
       id: user_id,
     },
   });
 
   if (!user) {
     throw new ApiError(400, "User not found");
   }
 
   if (!result) {
     throw new ApiError(400, "Failed to create task.");
   }
 
   const notificationData = {
     message: `${user.FirstName} ${user.LastName} comment for this ${enquiry.firstName} ${enquiry.lastName} enquiry student`,
     branch: enquiry.Branch,
     url: "manage-enquiries",
     userId: user_id,
   };
 
   await NotificationService.createNotification(notificationData);
 
  return result
};



const getAllFromDB = async () => {
  
    const result = await Reply.findAll()
  
    return result
  };

  
  const getDataById = async (id) => {
  
    console.log("dataid", id)
    const result = await Reply.findOne(
     {
      where:{
        user_id:id
      }
     }
  )
  
    return result
  };


  const deleteIdFromDB = async (id) => {
  
    const result = await Reply.destroy(
      {
        where:{
          id:id
        }
      }
    )
  
    return result
  };
  
  
  const updateOneFromDB = async (id, payload) => {

    console.log("academic", data)
    
    const result = await Reply.update(data,{
      where:{
        user_id:id
      }
    })
  
  
    return result
  
  };


const ReplyService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ReplyService;