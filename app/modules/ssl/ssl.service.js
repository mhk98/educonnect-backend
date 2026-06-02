const axios = require("axios");
const ApiError = require("../../../error/ApiError");

const initPayment = async (payload) => {
  try {
    const data = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      total_amount: payload.total_amount,
      currency: "BDT",
      tran_id: payload.tran_id,
      success_url: "https://login.eaconsultancy.org/payments?status=success",
      fail_url: "https://login.eaconsultancy.org/payments?status=error",
      cancel_url: "https://login.eaconsultancy.org/payments?status=cancel",
      ipn_url: "https://api.eaconsultancy.org/api/v1/pendingPayment/webhook", // backend IPN/webhook
      shipping_method: "NO",
      product_name: "Semester Payment",
      product_category: "Education",
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios.post(process.env.SSL_PAYMENT_URL, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    console.log("error", error);
    throw new ApiError(400, "Payment Initialization Failed");
  }
};

const validate = async (data) => {
  try {
    const validationUrl = `${process.env.SSL_VALIDATION_URL}?val_id=${data.val_id}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}&format=json`;

    const response = await axios.get(validationUrl);
    return response.data;
  } catch (error) {
    throw new ApiError(400, "Payment Validation Failed");
  }
};

module.exports = {
  initPayment,
  validate,
};

// const axios = require("axios");
// const ApiError = require("../../../error/ApiError");

// const initPayment = async (payload) => {
//   try {
//     const data = new URLSearchParams({
//       store_id: process.env.store_id,
//       store_passwd: process.env.store_passwd,
//       total_amount: String(payload.total_amount),
//       currency: "BDT",
//       tran_id: payload.tran_id,
//       success_url: "https://login.eaconsultancy.info/payments?status=success",
//       fail_url: "https://login.eaconsultancy.info/payments?status=error",
//       cancel_url: "https://login.eaconsultancy.info/payments?status=cancel",
//       ipn_url: "https://api.eaconsultancy.info/api/v1/pendingPayment/webhook",
//       shipping_method: "NO",
//       product_name: "Semester Payment",
//       product_category: "Education",
//       product_profile: "general",
//       cus_name: "Customer Name",
//       cus_email: "customer@example.com",
//       cus_add1: "Dhaka",
//       cus_city: "Dhaka",
//       cus_state: "Dhaka",
//       cus_postcode: "1000",
//       cus_country: "Bangladesh",
//       cus_phone: "01711111111",
//       ship_name: "Customer Name",
//       ship_add1: "Dhaka",
//       ship_city: "Dhaka",
//       ship_state: "Dhaka",
//       ship_postcode: "1000",
//       ship_country: "Bangladesh",
//     });

//     const response = await axios.post(
//       process.env.sslPaymentUrl,
//       data.toString(),
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         timeout: 20000,
//       },
//     );

//     return response.data;
//   } catch (error) {
//     console.log("SSL init error:", error?.response?.data || error.message);
//     throw new ApiError(400, "Payment Initialization Failed");
//   }
// };
