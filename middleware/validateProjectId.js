/**
 * - `validateProjectId` validates the project id on every request that expects a project id parameter
 * - if the `id` parameter is valid, store that project object as `req.project`
 * - if the `id` parameter does not match any project id in the database, cancel the request and respond with status `404` and `{ errorMessage: "invalid project id" }`
 */
function validateProjectId(req, res, next) {
  const id = req.params.id;
  console.log(`validateProjectId -> id`, id);

  const projectModel = require('../data/helpers/projectModel.js');

  projectModel.get()
    .then(users => {
      projectModel.get(id)
        .then(project => {
          console.log(`validateProjectId -> project\n`, project);
          if (project) {
            req.project = project;
            next();
          } else {
            res.status(404).json({ success: false, errorMessage: "Invalid project id!" });
          }
        })
        .catch(errUser => {
          res.status(500).json({ success: false, errorMessage: `Error fetching project with ID ${id}!` });
        });
    })
    .catch(errUsers => {
      res.status(500).json({ success: false, errorMessage: `Error fetching projects!` });
    })
}

module.exports = validateProjectId;
