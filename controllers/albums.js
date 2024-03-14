const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all albums
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("music").collection('albums').find();
  //console.log(result);
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Return one album by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }

  const userId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db("music").collection('albums').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Create one album from body json
const createAlbum = async (req, res, next) => {

  var artistId = new ObjectId;

  /*
  // Find the artist by name
  if (typeof req.body.artist != "undefined") {
    console.log("artist block");
    const artist = req.body.artist;

    var myCursor = await mongodb.getDb().db("music").collection('artists').find({ name: artist });
    var myDocumentList = myCursor.toArray();

    var myDocument = myDocumentList[0];

    if (typeof myDocument != "undefined") {
      artistId = new ObjectId(myDocument.artist_id);
    }
  }
  else {
    */
    // Use artist id
    artistId = new ObjectId(req.body.artist_id);
  //}

  // Create an album
  const album = {
    title: req.body.title,
    artist_id: artistId,
    media: req.body.media,
    genre: req.body.genre,
    year: req.body.year,
    tracks: req.body.tracks,
    mins: req.body.mins,
    discnbr: req.body.discnbr
  };

  // Save Album in the database
  const result = await mongodb.getDb().db("music").collection('albums').insertOne(album);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the album.');
  }
};
  
// Update a single album
const updateAlbumById = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }

  const userId = new ObjectId(req.params.id);

  // Update an album
  const album = {
    title: req.body.title,
    artist_id: new ObjectId(req.body.artist_id),
    media: req.body.media,
    genre: req.body.genre,
    year: req.body.year,
    tracks: req.body.tracks,
    mins: req.body.mins,
    discnbr: req.body.discnbr
  };
  
  // Update data in database
  const response = await mongodb.getDb().db("music").collection('albums').replaceOne({ _id: userId }, album);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the album.');
  }
}; 

// Delete one albums
const deleteAlbum = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
    return;
  }

  const userId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("music").collection('albums').deleteOne({ _id: userId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the album.');
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createAlbum, 
  updateAlbumById, 
  deleteAlbum 
};

