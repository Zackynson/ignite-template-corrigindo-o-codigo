const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const validateRepository = (req, res, next) => {
  const { id } = req.params;
  // if(!id || !validate(id)) return res.status(404).json({error: 'invalid id'})
  
  const repository = repositories.find(r => r.id === id);

  if (!repository) {
    return res.status(404).json({ error: "Repository not found" });
  }

  req.repository = repository

  return next()
}

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", validateRepository, (request, response) => {
  const { url, title, techs } = request.body;
  const { repository } = request;

  repository.url = url
  repository.techs = techs
  repository.title = title

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepository, (request, response) => {
  const { repository } = request;

  repositories.splice(repositories.indexOf(repository), 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepository, (request, response) => {
  const {repository} = request;

  repository.likes += 1;

  return response.json({likes: repository.likes});
});

module.exports = app;
