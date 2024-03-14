const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all songs by this artist
const getAllArtistSongs = async (req, res, next) => {
  const artistId = new ObjectId(req.params.id);
  console.log("artistsongs Get Artist Songs");
  console.log(req.params.id);
  console.log(artistId);

  const result = await mongodb.getDb().db("music").collection('songs').find({"artist_id": artistId});
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};  

const getAll = async (req, res, next) => {
    //const artistId = new ObjectId(req.params.id);
    console.log("artistsongs getAll");
    //console.log(req.params.id);
    //console.log(artistId);
  
    const result = await mongodb.getDb().db("music").collection('songs').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  };  
  
module.exports = { 
    getAll,
    getAllArtistSongs
};

