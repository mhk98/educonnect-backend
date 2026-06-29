const jwt = require("jsonwebtoken");
const db = require("../../models");
const { ensureTable } = require("../modules/logHistory/logHistory.service");

const METHODS_TO_LOG = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SENSITIVE_KEYS = new Set([
  "password",
  "Password",
  "confirmPassword",
  "ConfirmPassword",
  "token",
  "accessToken",
]);

const sanitize = (value) => {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sanitize);

  return Object.keys(value).reduce((acc, key) => {
    acc[key] = SENSITIVE_KEYS.has(key) ? "[REDACTED]" : sanitize(value[key]);
    return acc;
  }, {});
};

const getModuleName = (path = "") => {
  const parts = path.split("/").filter(Boolean);
  const apiIndex = parts.findIndex((part) => part === "v1");
  return parts[apiIndex + 1] || parts[0] || "unknown";
};

const getAction = (method, path) => {
  if (path.includes("/user/login")) return "LOGIN";
  if (method === "POST") return "CREATE";
  if (method === "PUT") return "UPDATE";
  if (method === "PATCH") return "PATCH";
  if (method === "DELETE") return "DELETE";
  return method;
};

const getTokenUserId = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    return verified?.id || null;
  } catch (error) {
    return null;
  }
};

const findActor = async (req, responseBody) => {
  const loginUser = responseBody?.data?.user;
  if (loginUser?.id) return loginUser;

  const candidateId =
    getTokenUserId(req) ||
    req.body?.user_id ||
    req.body?.userId ||
    req.body?.student_id ||
    req.body?.id;

  if (!candidateId) return null;

  return await db.user.findByPk(candidateId, {
    attributes: ["id", "FirstName", "LastName", "Role", "Branch", "image"],
  });
};

const auditLogger = (req, res, next) => {
  const shouldLog =
    req.path.includes("/user/login") ||
    (METHODS_TO_LOG.has(req.method) && !req.path.includes("/logHistory"));

  if (!shouldLog) return next();

  const startedAt = Date.now();
  const originalJson = res.json.bind(res);
  let responseBody = null;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    setImmediate(async () => {
      try {
        await ensureTable();
        const actor = await findActor(req, responseBody);
        const userName = actor
          ? [actor.FirstName, actor.LastName].filter(Boolean).join(" ")
          : null;

        await db.logHistory.create({
          user_id: actor?.id || null,
          userName: userName || null,
          userRole: actor?.Role || null,
          branch: actor?.Branch || req.body?.branch || null,
          method: req.method,
          module: getModuleName(req.originalUrl),
          endpoint: req.originalUrl,
          action: getAction(req.method, req.path),
          statusCode: res.statusCode,
          target_id: req.params?.id || req.params?.user_id || req.body?.id || null,
          message: responseBody?.message || responseBody?.error || null,
          request: sanitize({
            params: req.params,
            query: req.query,
            body: req.body,
          }),
          response: sanitize({
            success: responseBody?.success,
            status: responseBody?.status,
            message: responseBody?.message,
            error: responseBody?.error,
          }),
          ip: req.ip,
          meta: { durationMs: Date.now() - startedAt },
        });
      } catch (error) {
        console.error("Audit log failed:", error.message);
      }
    });
  });

  next();
};

module.exports = auditLogger;
