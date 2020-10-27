const router = require('express').Router();
// const { User, Tweet } = require('../models/user');
const Album = require('../models/album').Album;
const Song = require('../models/album').Song;

// USERS INDEX Route
router.get('/', (req, res) => {
    console.log('Index Route');
    Album.find({}, (error, allAlbums) => {
        res.render('albums/index.ejs', {
            albums: allAlbums,
        });
    });
});

// NEW USER FORM
router.get('/new', (req, res) => {
  res.render('albums/new.ejs');
});

// ADD EMPTY FORM TO USER SHOW PAGE TO ADD TWEET TO A USER
router.get('/:albumId', (req, res) => {
    // find user in db by id and add new tweet
    Album.findById(req.params.albumId, (error, album) => {
      res.render('albums/show.ejs', { album });
    });
});

// CREATE A NEW USER
router.post('/', (req, res) => {
    Album.create(req.body, (error, album) => {
      res.redirect(`/albums/${album.id}`);
    });
});

// CREATE TWEET EMBEDDED IN USER
router.post('/:albumId/songs', (req, res) => {
    console.log(req.body);

    // store new tweet in memory with data from request body
    const newSong = new Song({ songTitle: req.body.songTitle });

    // find user in db by id and add new tweet
    Album.findById(req.params.albumId, (error, album) => {
      album.songs.push(newSong);
      album.save((err, album) => {
        res.redirect(`/albums/${album.id}`);
      });
    });
});

router.get('/:albumId/songs/:songId/edit', (req, res) => {
    // set the value of the user and tweet ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    // find user in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find tweet embedded in user
      const foundSong = foundAlbum.songs.id(songId);
      // update tweet text and completed with data from request body
      res.render('songs/edit.ejs', { foundAlbum, foundSong });
    });
  });

  // UPDATE TWEET EMBEDDED IN A USER DOCUMENT
  router.put('/:albumId/songs/:songId', (req, res) => {
    console.log('PUT ROUTE');
    // set the value of the user and tweet ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    // find user in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find tweet embedded in user
      const foundSong = foundAlbum.songs.id(songId);
      // update tweet text and completed with data from request body
      foundSong.songTitle = req.body.songTitle;
      foundAlbum.save((err, savedAlbum) => {
        res.redirect(`/albums/${foundAlbum.id}`);
      });
    });
  });

  router.delete('/:albumId/songs/:songId', (req, res) => {
    console.log('DELETE SONG');
    // set the value of the user and tweet ids
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    // find user in db by id
    Album.findById(albumId, (err, foundAlbum) => {
      // find tweet embedded in user
      foundAlbum.songs.id(songId).remove();
      // update tweet text and completed with data from request body
      foundAlbum.save((err, savedAlbum) => {
        res.redirect(`/albums/${foundAlbum.id}`);
      });
    });
  });

router.delete('/:id', (req, res) => {
    Album.findByIdAndRemove(req.params.id, (error) => {
        res.redirect('/albums');
    });
});

module.exports = router;
