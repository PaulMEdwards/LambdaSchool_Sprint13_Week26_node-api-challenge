/**
 * - `validateProject` validates the `body` on a request to create a new project
 * - if the request `body` is missing, cancel the request and respond with status `400` and `{ errorMessage: "missing project data" }`
 * - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ errorMessage: "missing required name and/or description field" }`
 */
function validateProject(req, res, next) {
  console.log(`validateProject`);
  if (!req.body) {
    console.log(`validateProject: project is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing project data!" });
  } else if (!req.body.name || !req.body.description) {
    console.log(`validateProject: project is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing required name and/or description field!" });
  } else {
    console.log(`validateProject: project is valid`);
    next();
  };
}

module.exports = validateProject;