// const { default: axios } = require("axios");
// const crypto = require("crypto");
// const ApiError = require("../../../error/ApiError");

// // Cookie helper to extract fbp/fbc
// function getCookieValue(name, cookieHeader) {
//   if (!cookieHeader) return undefined;
//   const match = cookieHeader.match(new RegExp(`(^|; )${name}=([^;]*)`));
//   return match ? decodeURIComponent(match[2]) : undefined;
// }

// // SHA256 হ্যাশ ফাংশন
// function sha256Hash(value) {
//   return crypto
//     .createHash("sha256")
//     .update(value.trim().toLowerCase())
//     .digest("hex");
// }

// const insertIntoDB = async (data, req) => {
//   const { eventId, event_name } = data;

//   if (!eventId) {
//     throw new ApiError(400, `Event ID is required.`);
//   }

//   // স্যাম্পল ইমেইল এবং ফোন নম্বর (প্রয়োজনমত বদলাতে পারো)
//   const sampleEmail = "sample@example.com";
//   const samplePhone = "0123456789";

//   // হ্যাশ করা ইমেইল ও ফোন নম্বর
//   const hashedEmail = sha256Hash(sampleEmail);
//   const hashedPhone = sha256Hash(samplePhone);

//   // user_data (IP ছাড়া)
//   const userData = {
//     em: hashedEmail,
//     ph: hashedPhone,
//   };

//   const payload = {
//     data: [
//       {
//         event_name,
//         event_time: Math.floor(Date.now() / 1000),
//         event_id: eventId,
//         action_source: "website",
//         user_data: userData,
//       },
//     ],
//   };

//   const url = `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events`;
//   const params = {
//     access_token: process.env.FB_CONVERSION_API_TOKEN,
//   };

//   const fbRes = await axios.post(url, payload, { params });

//   console.log("Facebook Pixel Response:", fbRes.data);

//   return fbRes.data;
// };

// const PixelService = {
//   insertIntoDB,
// };

// module.exports = PixelService;

const { default: axios } = require("axios");
const crypto = require("crypto");
const ApiError = require("../../../error/ApiError");

// Cookie helper to extract fbp/fbc
function getCookieValue(name, cookieHeader) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

// SHA256 হ্যাশ ফাংশন
function sha256Hash(value) {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

const insertIntoDB = async (data, req) => {
  const { eventId, event_name } = data;

  if (!eventId) {
    throw new ApiError(400, `Event ID is required.`);
  }

  // স্যাম্পল ইমেইল এবং ফোন নম্বর (প্রয়োজনমত বদলাতে পারো)
  const sampleEmail = "sample@example.com";
  const samplePhone = "0123456789";

  // হ্যাশ করা ইমেইল ও ফোন নম্বর
  const hashedEmail = sha256Hash(sampleEmail);
  const hashedPhone = sha256Hash(samplePhone);

  // cookie safe extract
  const cookieHeader = req?.headers?.cookie || "";
  const fbp = getCookieValue("_fbp", cookieHeader);
  const fbc = getCookieValue("_fbc", cookieHeader);

  // user_data
  const userData = {
    em: hashedEmail,
    ph: hashedPhone,
    ...(fbp && { fbp }),
    ...(fbc && { fbc }),
  };

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        user_data: userData,
      },
    ],
  };

  const url = `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events`;
  const params = {
    access_token: process.env.FB_CONVERSION_API_TOKEN,
  };

  const fbRes = await axios.post(url, payload, { params });

  console.log("Pixel fbc/fbp:", { fbp, fbc });
  console.log("Pixel event name", data);
  console.log("Facebook Pixel Response:", fbRes.data);

  return fbRes.data;
};

const PixelService = {
  insertIntoDB,
};

module.exports = PixelService;
