const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const User = require('../models/User');

router.get('/', async (req, res) => {
    let layout;
    const locals = { title: 'home' };

    layout = '../views/layouts/main';
    res.render('index', {
        locals,
        layout: layout,
    });
    
    
});

router.get('/instructor/:name', async (req, res) => {
    const instructorName = req.params.name;
    const locals = {
        title: instructorName
    };
    try {
    
        layout = '../views/layouts/main'
        
        const instructor = await Instructor.findOne({ name: instructorName });
        
        if (instructor) {

            res.render('body/instructor', {
                instructor,
                locals,
                layout: layout,
            });
        } else {
            res.render('body/notFound', {
                name: instructorName,
                layout: layout
            }); 
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/search', async (req, res) => {
    const searchName= req.query.name;
    try {
        
        const searchResults = await Instructor.find({
            name: { $regex: new RegExp(searchName, 'i') }
        }).limit(10);
        
        if(searchResults.length > 0) {
            res.render('body/searchResults', {
                searchResults,
                layout: false
            });
        } else {
            res.render('body/notFound', {
                name: searchName,
                layout: false
            }); 
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/addInstructor', async (req, res) => {

    try{
        
        req.body.user = req.session.user.id;
        const profile = await Instructor.create(req.body);

        await User.findByIdAndUpdate( req.session.user.id, {
            $set: { profile: profile._id } 
        });
        
        try {
            res.redirect('/');
        } catch(error) {
            console.log(error)
        }
        
        
    }catch(error) {
        console.log(error);
    }

});



module.exports = router;