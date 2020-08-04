/**
 * - `validateAction` validates the `body` on a request to create a new action
 * - if the request `body` is missing, cancel the request and respond with status `400` and `{ errorMessage: "missing action data" }`
 * - if the request `body` is missing the required `description and/or notes` field, cancel the request and respond with status `400` and `{ errorMessage: "missing required description and/or notes field" }`
 */
function validateAction(req, res, next) {
  console.log(`validateAction`);
  if (!req.body) {
    console.log(`validateAction: action is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing action data!" });
  } else if (!req.body.description || !req.body.notes) {
    console.log(`validateAction: action is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing required description and/or notes field!" });
  } else {
    console.log(`validateAction: action is valid`);
    next();
  };
}

module.exports = validateAction;