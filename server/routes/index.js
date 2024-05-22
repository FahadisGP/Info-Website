const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const User = require('../models/User');
const bcrypt = require('bcrypt');

function isLoggedIn(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
}

router.get('/', async (req, res) => {
    let layout;
    const locals = { title: 'home' };

    if(req.session.user) {
        layout = '../views/layouts/mainLoggedIn'
        const instructor = await Instructor.findOne().where({user: req.session.user.id});
        if(instructor) {
            
            res.render('index', {
                instructor,
                locals,
                layout: layout,
                index: 1
            });
        }
        else {
            res.render('index', {
                locals,
                layout: layout,
                index: 2
            });
        }
    }
    else {
        layout = '../views/layouts/main';
        res.render('index', {
            locals,
            layout: layout,
            index: 3
        });
    }
    
    
});

router.get('/login', async (req, res) => {
    const locals = {
        title: 'تسجيل دخول'
    };
    res.render('body/login', {
        locals,
        layout: '../views/layouts/main'
    });
});

router.get('/signup', async (req, res) => {
    const locals = {
        title: 'إنشاء حساب'
    };
    res.render('body/signup', {
        locals,
        layout: '../views/layouts/main'
    });
});

router.get('/instructor/:name', async (req, res) => {
    const instructorName = req.params.name;
    const locals = {
        title: instructorName
    };
    try {
        let layout;
        if(req.session.user) {
            layout = '../views/layouts/mainLoggedIn'
        }
        else {
            layout = '../views/layouts/main'
        }
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

router.get('/addInstructor', isLoggedIn, async (req, res) => {
    
    let layout;
    if(req.session.user) {
        layout = '../views/layouts/mainLoggedIn'
    }
    else {
        layout = '../views/layouts/main'
    }
    locals = { title: 'إضافة محاضر' };

    const instructor = await Instructor.findOne().where({user: req.session.user.id});
    
    if(instructor) {
        res.render('body/instructor', {
            instructor,
            locals,
            layout: layout,
        });
    }
    else {
        res.render('body/addInstructor', {
            locals,
            layout: layout
        });
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


router.get('/editInstructor', isLoggedIn, async (req, res) => {
    
    let layout;
    if(req.session.user) {
        layout = '../views/layouts/mainLoggedIn'
    }
    else {
        layout = '../views/layouts/main'
    }
    
    const instructor = await Instructor.findOne().where({user: req.session.user.id});
    
    if(instructor) {
        const locals = { title: 'تعديل محاضر' };
        res.render('body/editInstructor', {
            instructor,
            locals,
            layout: layout
        });
    }
    else { 
        res.redirect(`/addinstructor`)
    }



});

router.put('/editInstructor', async (req, res) => {
    
    try {
        await Instructor.findOneAndUpdate({ user: req.session.user.id }, req.body);

        res.json({ message: 'Instructor updated successfully' });
    } catch(error) {
        console.log(error);
    }
});

router.delete('/deleteInstructor', async (req, res) => {
    
    try {
        await Instructor.deleteOne({ user: req.session.user.id });

        await User.findByIdAndUpdate( req.session.user.id, {
            $set: { profile: null } 
        });
        res.json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        console.log(error)
    }
});

router.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({username: username, password: hashedPassword, profile: null});
        
        req.session.user = {
            id: newUser._id,
            username: username,
          };

        res.json({ success: true, redirectUrl: '/addInstructor' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Registration failed. Please try again later.');
    }

});

router.post('/login', async(req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    
    try {
        let user = await User.findOne({ username: username});

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = {
                    id: user._id,
                    username: username,
                };
                res.json({ success: true, redirectUrl: '/' });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred during the login process');
        
    }
});

router.post('/logout', async(req, res) => {
    req.session.destroy(error => {
        if(error) {
          console.log(error);
          res.send('Error loggin out');
        } else {
          res.json({ success: true, redirectUrl: '/' });
        }
    });
   
});


module.exports = router;