const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const sslService = require("../ssl/ssl.service");
const { where, Op } = require("sequelize");
const NotificationService = require("../notification/notification.service");
const paginationHelpers = require("../../../helpers/paginationHelper");
const {
  PendingPaymentSearchAbleFields,
} = require("./pendingPayment.constants");

const PendingPayment = db.pendingPayment;
const User = db.user;
const Profile = db.profile;

// const generateTransactionId = () => `TXN-${Date.now()}`;

// const initPayment = async (data) => {
//   console.log("data", data);

//   const { userId } = data;
//   const user = await User.findOne({
//     where: {
//       id: data.user_id,
//     },
//   });

//   const tran_id = generateTransactionId();

//   const session = await sslService.initPayment({
//     total_amount: data.amount,
//     tran_id,
//   });

//   if (data.paymentStatus === "Offline") {
//     // Case 1: Offline payment
//     const result = await PendingPayment.create({
//       amount: data.amount,
//       transactionId: tran_id,
//       user_id: data.user_id,
//       status: "PENDING",
//       employee: data.employee,
//       branch: data.branch,
//       name: `${user.FirstName} ${user.LastName}`,
//       phone: user.Phone,
//       address: user.Address,
//       paymentStatus: data.paymentStatus,
//       purpose: data.purpose,
//       file: data.file || null,
//     });
//   } else if (
//     data.paymentStatus === "Cash-In" ||
//     data.paymentStatus === "Cash-Out"
//   ) {
//     // Case 2: Cash In or Out
//     const insertCashInORCashOut = await PendingPayment.create({
//       amount: data.amount,
//       transactionId: tran_id,
//       user_id: data.user_id,
//       employee: data.employee,
//       branch: data.branch,
//       paymentStatus: data.paymentStatus,
//       purpose: data.purpose,
//       name: `${user.FirstName} ${user.LastName}`,
//       phone: user.Phone,
//       address: user.Address,
//     });

//     if (insertCashInORCashOut) {
//       const notificationData = {
//         message: `${data.branch} branch ${data.paymentStatus} ${data.amount} Taka for ${data.purpose}`,
//         branch: "Edu Anchor",
//         userId: userId,
//         url: "wallet",
//       };

//       await NotificationService.createNotification(notificationData);
//     }
//   } else {
//     // Case 3: Any other payment status
//     await PendingPayment.create({
//       amount: data.amount,
//       transactionId: tran_id,
//       user_id: data.user_id,
//       status: "PENDING",
//       branch: data.branch,
//       paymentStatus: data.paymentStatus,
//       purpose: data.purpose,
//       name: `${user.FirstName} ${user.LastName}`,
//       phone: user.Phone,
//       address: user.Address,
//     });
//   }

//   return session?.GatewayPageURL;
// };

const generateTransactionId = () => `TXN-${Date.now()}`;

const initPayment = async (data) => {
  console.log("Payment data:", data);

  // 1️⃣ User check
  const user = await User.findOne({
    where: { id: data.user_id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tran_id = generateTransactionId();

  let gatewayUrl = null;

  // 2️⃣ Only Online Payment will call SSL
  const isOnlinePayment =
    data.paymentStatus !== "Offline" &&
    data.paymentStatus !== "Cash-In" &&
    data.paymentStatus !== "Cash-Out";

  if (isOnlinePayment) {
    const session = await sslService.initPayment({
      total_amount: data.amount,
      tran_id,
    });

    gatewayUrl = session?.GatewayPageURL || null;

    if (!gatewayUrl) {
      throw new ApiError(400, "SSL Payment Initialization Failed");
    }
  }

  // 3️⃣ Create Pending Payment Record (Common for all types)
  const payment = await PendingPayment.create({
    amount: data.amount,
    transactionId: tran_id,
    user_id: data.user_id,
    status: "PENDING",
    employee: data.employee || null,
    branch: data.branch === "null" ? null : data.branch,
    paymentStatus: data.paymentStatus,
    purpose: data.purpose,
    name: `${user.FirstName} ${user.LastName}`,
    phone: user.Phone,
    address: user.Address,
    file: data.file || null,
  });

  // 4️⃣ Cash-In / Cash-Out Extra Notification Logic
  if (data.paymentStatus === "Cash-In" || data.paymentStatus === "Cash-Out") {
    await NotificationService.createNotification({
      message: `${data.branch} branch ${data.paymentStatus} ${data.amount} Taka for ${data.purpose}`,
      branch: "Edu Anchor",
      userId: data.userId || null,
      url: "wallet",
    });
  }

  // 5️⃣ Return structured response
  return {
    payment,
    gatewayUrl,
  };
};

// const webhook = async (payload) => {
//   if (!payload || payload.status !== 'VALID') {
//     return { message: 'Invalid or failed payment' };
//   }

//   const result = await sslService.validate(payload);
//   if (result?.status !== 'VALID') {
//     return { message: 'Payment validation failed' };
//   }

//   const { tran_id } = result;

// const paymentStatus =  await PendingPayment.update(
//     {
//       status: "PAID",
//       paymentGatewayData: JSON.stringify(payload),
//     },
//     {
//       where: { transactionId: tran_id },
//     }
//   );

//   if(paymentStatus.status === "PAID") {
//     await RequestPayment.update(
//       {
//       status: "PAID"
//     },
//     {
//       where: {
//         id:requrestPayment_id,
//         user_id:
//       }
//     }
//   )
//   }

//   return { message: "Payment Success" };
// };

const webhook = async (payload) => {
  if (!payload || payload.status !== "VALID") {
    return { message: "Invalid or failed payment" };
  }

  const result = await sslService.validate(payload);
  if (result?.status !== "VALID") {
    return { message: "Payment validation failed" };
  }

  const { tran_id } = result;

  // Find the pending payment record
  const pendingPayment = await PendingPayment.findOne({
    where: { transactionId: tran_id },
  });

  if (!pendingPayment) {
    return { message: "Transaction not found in system" };
  }

  // Update the pending payment to PAID
  await PendingPayment.update(
    {
      status: "PAID",
      paymentGatewayData: JSON.stringify(payload),
    },
    {
      where: { transactionId: tran_id },
    },
  );

  // If related to RequestPayment, update that too
  // if (pendingPayment.requestPayment_id && pendingPayment.user_id) {
  //   await RequestPayment.update(
  //     { status: 'PAID' },
  //     {
  //       where: {
  //         id: pendingPayment.requestPayment_id,
  //         user_id: pendingPayment.user_id,
  //       },
  //     }
  //   );
  // }

  return { message: "Payment Success" };
};

const getAllDataById = async (id) => {
  const result = await PendingPayment.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

const getAllData = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    if (searchTerm) {
      where[Op.or] = PendingPaymentSearchAbleFields.map((field) => ({
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

  let result = await PendingPayment.findAll({
    where: whereConditions,
    offset: skip,
    limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "DESC"]],
  });

  let total = await PendingPayment.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getAllFromDBWithoutQuery = async () => {
  const result = await PendingPayment.findAll();

  return result;
};

const updateOneFromDB = async (id, payload) => {
  const result = await PendingPayment.update(payload, {
    where: {
      id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await PendingPayment.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

module.exports = {
  initPayment,
  webhook,
  getAllDataById,
  getAllData,
  updateOneFromDB,
  deleteIdFromDB,
  getAllFromDBWithoutQuery,
};
