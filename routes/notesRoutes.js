const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middlewares/jwt');
const Notes = require('../models/Notes');

// GET all notes with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10

    const startIndex = (page - 1) * limit;
    const total = await Notes.countDocuments();
    const notes = await Notes.find().skip(startIndex).limit(limit);

    res.status(200).json({
      totalNotes: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      notes: notes,
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send(`Server Error while fetching data ${err.message}`);
  }
});


// GET a specific note by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await Notes.findById(req.params.id);
    if (!response) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send(`Server Error while fetching data ${err.message}`);
  }
});




// POST a new note (requires JWT authentication middleware)
router.post('/create', async (req, res) => {
  try {
    //check if the user has user type author 
    //if (!isAuthor(req.user)) return res.status(403).json({ message: 'You are not registered as author' });

    const data = req.body;
    console.log("req.body", data);

    const newNote = new Notes(data);

    // Save the new note to DB
    const response = await newNote.save();
    console.log(`Note saved in DB ${response}`);
    res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send(`Server Error ${err.message}`);
  }
});



//delete note route

router.delete('/:id', async (req, res) => {
  try {
    const response = await Notes.findByIdAndDelete(req.params.id);
    if (!response) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send(`Server Error while deleting data ${err.message}`);
  }
});



//approval route handle by admin
router.put('/:id/approve', jwtAuthMiddleware, async (req, res) => {
  try {
    //check if the user has user type admin
    if (!isAdmin(req.user)) return res.status(403).json({ message: 'You are not registered as admin' });

    const response = await Notes.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!response) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send(`Server Error while approving data ${err.message}`);
  }
});





module.exports = router;
