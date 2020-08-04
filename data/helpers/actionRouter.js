const express = require('express');

const router = express.Router();

const actionModel = require('./actionModel.js');

const apiBase = '/api/actions';

// custom middleware

const validateActionId = require('../../middleware/validateActionId');
const validateAction = require('../../middleware/validateAction');

router.post('/', validateAction, (req, res) => {
  const actionId = req.params.id;

  if (!req.body.notes || !req.body.description) {
    res.status(400).json({ success: false, errorMessage: "Please provide description and notes for the action." });
  } else {
    actionModel.insert(req.body)
      .then(action => {
        console.log(`POST ${apiBase}/:actionId/action insert(${actionId}): \n`, action);
        res.status(201).json({ success: true, action: action });
      })
      .catch(err => {
        res.status(500).json({ success: false, errorMessage: "There was an error while saving the action to the database." });
      });
  }
});

router.get('/', (req, res) => {
  actionModel.get()
    .then(actions => {
      console.log(`GET ${apiBase}/ get():\n`, actions);
      res.status(200).json({ success: true, actions: actions });
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The actions information could not be retrieved."});
    });
});

router.get('/:id', validateActionId, (req, res) => {
  const actionId = req.params.id;

  actionModel.get(actionId)
    .then(action => {
      console.log(`GET ${apiBase}/:actionId get(${actionId}): \n`, action);
      if (action) {
        res.status(200).json({ success: true, action: action });
      } else {
        res.status(404).json({ success: false, errorMessage: "The action with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The action information could not be retrieved." });
    });
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
  const actionId = req.params.id;

  if (!req.body.notes || !req.body.description) {
    res.status(400).json({ success: false, errorMessage: "Please provide description and notes for the action." });
  } else {
    actionModel.get(actionId)
      .then(action => {
        if (action) {
          actionModel.update(actionId, req.body)
            .then(actionIdUpdated => {
              console.log(`PUT ${apiBase}/:id update(${actionId}): \n`, actionIdUpdated);
              if (actionIdUpdated) {
                res.status(200).json({ success: true, actionIdUpdated: parseInt(actionId, 10) });
              }
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "The action information could not be modified." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The action with the specified ID does not exist." });
        }
      });
  }
});

router.delete('/:id', validateActionId, (req, res) => {
  const actionId = req.params.id;

  actionModel.get(actionId)
    .then(action => {
      if (action) {
        actionModel.remove(actionId, req.body)
          .then(actionIdRemoved => {
            console.log(`DELETE ${apiBase}/:actionId remove(${actionId}): \n`, actionIdRemoved);
            if (actionIdRemoved) {
              res.status(200).json({ success: true, actionIdRemoved: parseInt(actionId, 10) });
            }
          })
          .catch(err => {
            res.status(500).json({ success: false, errorMessage: "The action could not be removed." });
          });
      } else {
        res.status(404).json({ success: false, errorMessage: "The action with the specified ID does not exist." });
      }
    });
});

module.exports = router;
