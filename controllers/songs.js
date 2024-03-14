//const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all songs
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("music").collection('songs').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Return one song by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }

  const userId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db("music").collection('songs').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Create one song from body json
const createSong = async (req, res, next) => {

  // Create a song
  const song = {
    title: req.body.title,
    artist_id: new ObjectId(req.body.artist_id),
    album_id: new ObjectId(req.body.album_id),
    time: req.body.time,
  };

  // Save song in the database
  const result = await mongodb.getDb().db("music").collection('songs').insertOne(song);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the song.');
  }
};
  
// Update a single Song
const updateSong = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }
  
  const userId = new ObjectId(req.params.id);

  // Update a songs
  const song = {
    title: req.body.title,
    artist_id: new ObjectId(req.body.artist_id),
    album_id: new ObjectId(req.body.album_id),
    time: req.body.time,
  };
  
  // Update data in database
  const response = await mongodb.getDb().db("music").collection('songs').replaceOne({ _id: userId }, song);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the song.');
  }
}; 

// Delete one song
const deleteSong = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }

  const userId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("music").collection('songs').deleteOne({ _id: userId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the song.');
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createSong, 
  updateSong, 
  deleteSong 
};

