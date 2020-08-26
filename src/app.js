const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Ivalid Repository Id"})
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id = id);
  
  if(repoIndex < 0){
    return response.status(404).json({error: "Repository Not Found"})
  }

  const repositoryUpdated = {id, title, url, techs, likes:0};

  repositories[repoIndex] = repositoryUpdated;

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

   if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository Not Found"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

   if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository Not Found"})
  }

  const repository = repositories[repositoryIndex];
  repository.likes ++; 

  repositories[repositoryIndex] = repository;
  return response.json(repository)
});

module.exports = app;
