const express = require('express');

const router = express.Router();

const projectModel = require('./projectModel.js');
const actionModel = require('./actionModel.js');

const apiBase = '/api/projects';

//custom middleware

const validateProjectId = require('../../middleware/validateProjectId');
const validateProject = require('../../middleware/validateProject.js');
const validateAction = require('../../middleware/validateAction');

router.post('/', validateProject, (req, res) => {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({ success: false, errorMessage: "Please provide name and description for the project." });
  } else {
    projectModel.insert(req.body)
      .then(project => {
        console.log(`POST ${apiBase}/ insert(): \n`, project);
        res.status(201).json({ success: true, project: project });
      })
      .catch(err => {
        res.status(500).json({ success: false, errorMessage: "There was an error while saving the project to the database." });
      });
  }
});

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
  const projectId = req.params.id;

  if (!req.body.notes || !req.body.description) {
    res.status(400).json({ success: false, errorMessage: "Please provide description and notes for the project action." });
  } else {
    projectModel.get(projectId)
      .then(project => {
        console.log(`POST ${apiBase}/:projectId project:\n`, project);
        if (project) {
          req.body.project_id = projectId;
          console.log(`POST ${apiBase}/:projectId/actions req.body: \n`, req.body);
          actionModel.insert(req.body)
            .then(action => {
              console.log(`POST ${apiBase}/:projectId/actions insert(${projectId}): \n`, action);
              res.status(201).json({ success: true, action: action });
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "There was an error while saving the project action to the database." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The project with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ success: false, errorMessage: "There was an error while fetching the project." });
      });
  }
});

router.get('/', (req, res) => {
  projectModel.get()
    .then(projects => {
      console.log(`GET ${apiBase}/ get():\n`, projects);
      res.status(200).json({ success: true, projects: projects });
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The projects information could not be retrieved."});
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  console.log(`TCL: req.params`, req.params);
  const projectId = req.params.id;

  projectModel.get(projectId)
    .then(project => {
      console.log(`GET ${apiBase}/:projectId get(${projectId}): \n`, project);
      if (project) {
        res.status(200).json({ success: true, project: project });
      } else {
        res.status(404).json({ success: false, errorMessage: "The project with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The project information could not be retrieved." });
    });
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  const projectId = req.params.id;

  projectModel.get(projectId)
    .then(project => {
      if (project) {
        projectModel.getProjectActions(projectId)
        .then(actions => {
          console.log(`GET ${apiBase}/:projectId/actions getProjectActions(${projectId}): \n`, actions);
          if (actions) {
            res.status(200).json({ success: true, actions: actions });
          } else {
            res.status(404).json({ success: false, errorMessage: "The project has no actions." });
          }
        })
        .catch(err => {
          res.status(500).json({ success: false, errorMessage: "The project actions information could not be retrieved." });
        });
      } else {
        res.status(404).json({ success: false, errorMessage: "The project with the specified ID does not exist." });
      }
    })
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  const projectId = req.params.id;

  if (!req.body.name || !req.body.description) {
    res.status(400).json({ success: false, errorMessage: "Please provide name and description for the project." });
  } else {
    projectModel.get(projectId)
      .then(project => {
        if (project) {
          projectModel.update(projectId, req.body)
            .then(projectIdUpdated => {
              console.log(`PUT ${apiBase}/:id update(${projectId}):`, projectIdUpdated); //TODO why does this return 1?
              if (projectIdUpdated) {
                res.status(200).json({ success: true, projectIdUpdated: parseInt(projectId, 10) });
              }
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "The project information could not be modified." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The project with the specified ID does not exist." });
        }
      });
  }
});

router.delete('/:id', validateProjectId, (req, res) => {
  const projectId = req.params.id;

  projectModel.get(projectId)
    .then(project => {
      if (project) {
        projectModel.remove(projectId, req.body)
          .then(projectIdRemoved => {
            console.log(`DELETE ${apiBase}/:projectId remove(${projectId}):`, projectIdRemoved); //TODO why does this return 1?
            if (projectIdRemoved) {
              res.status(200).json({ success: true, projectIdRemoved: parseInt(projectId, 10) });
            }
          })
          .catch(err => {
            res.status(500).json({ success: false, errorMessage: "The project could not be removed." });
          });
      } else {
        res.status(404).json({ success: false, errorMessage: "The project with the specified ID does not exist." });
      }
    });
});

module.exports = router;
