/**
 * - `validateActionId` validates the action id on every request that expects a action id parameter
 * - if the `id` parameter is valid, store that action object as `req.action`
 * - if the `id` parameter does not match any action id in the database, cancel the request and respond with status `404` and `{ errorMessage: "invalid action id" }`
 */
function validateActionId(req, res, next) {
  const id = req.params.id;
  console.log(`validateActionId -> id`, id);

  const actionModel = require('../data/helpers/actionModel.js');

  actionModel.get()
    .then(actions => {
      actionModel.get(id)
        .then(action => {
          if (action) {
            req.action = action;
            console.log(`validateActionId -> action\n`, action);
            next();
          } else {
            res.status(404).json({ success: false, errorMessage: "Invalid action id!" });
          }
        })
        .catch(errPost => {
          res.status(500).json({ success: false, errorMessage: `Error fetching action with ID ${id}!` });
        });
    })
    .catch(errPosts => {
      res.status(500).json({ success: false, errorMessage: `Error fetching actions!` });
    })
}

module.exports = validateActionId;
