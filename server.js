const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const path=require('path');
const {MongoClient}=require('mongodb');
const app=express();
const port=5000;
const root = process.cwd();
const mongoURI='mongodb://127.0.0.1:27017/login'; 
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'register.html'));
});
app.get('/search',(req,res)=>{
    res.sendFile(path.join(__dirname,'search.html'));
});
app.get('/feedback',(req,res)=>{
    res.sendFile(path.join(__dirname,'feedback.html'));
});
app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'adminlogin.html'));
});
app.get('/addlaw',(req,res)=>{
    res.sendFile(path.join(__dirname,'adminhome.ejs'));
});
app.get('/', (req, res) => {
    res.render('searchresults');
});

//User Login

app.post('/index', async (req, res) => {
    try {
    const {email, password} = req.body;
    console.log('Received Form Data:', req.body);
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true,
    useUnifiedTopology: true });
    const db = client.db();
    const loginDetails = await db.collection('login').findOne({ email });
    console.log('Login Details from Database:', loginDetails);
    if (loginDetails.email !== email || loginDetails.password !== password) {
    return res.status(400).json({ message: 'Login details not found or incorrect' });
    }
    console.log('Success');
    res.render('home');
    client.close();
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    console.log(error);
    }
    });

    // Admin Login

    app.post('/admin', async (req, res) => {
        try {
        const {email, password} = req.body;
        console.log('Received Form Data:', req.body);
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true,
        useUnifiedTopology: true });
        const db = client.db();
        const loginDetails = await db.collection('admin_login').findOne({ email });
        console.log('Login Details from Database:', loginDetails);
        if (loginDetails.password !== password) {
        return res.status(400).json({ message: 'Login details not found or incorrect' });
        }
        console.log('Success');
        res.render('adminhome');
        client.close();
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        }
        });

        //User Registration

    app.post('/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;
            console.log('Received Form Data:', req.body);
            const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db();
            
            const login = {
                name,
                email,
                password,
               
            };
    
            await db.collection('login').insertOne(login);
    
            client.close();
    
            //res.redirect('/index');
            res.json({ message: 'registration successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // ADMIN ADDING LAW

    app.post('/addlaw', async (req, res) => {
        try {
            const { keyword,law } = req.body;
            console.log('Received Form Data:', req.body);
            const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db();
            
            const addlaw = {
                keyword,
                law,
            };
    
            await db.collection('law_details').insertOne(addlaw);
    
            client.close();
    
            console.log('Law Added Successfully');
            res.render('adminhome');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    // ADMIN UPDATING LAW

    app.post('/updatelaw', async (req, res) => {
        try {
            const { keyword, law } = req.body;
            console.log('Received Form Data:', req.body);
            const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db();
    
            const existingLaw = await db.collection('law_details').findOne({ keyword });
    
            if (!existingLaw) {
                client.close();
                return res.status(404).json({ message: 'Keyword not found' });
            }
    
            await db.collection('law_details').updateOne({ keyword }, { $set: { law } });
    
            client.close();
            console.log('Law Updated Successfully');
            res.render('adminhome');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    
    // ADMIN DELETING THE LAW

    app.post('/deletelaw', async (req, res) => {
        try {
            const { keyword } = req.body;
            console.log('Received Form Data:', req.body);
    
            const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db();
    
            const existingLaw = await db.collection('law_details').findOne({ keyword });
    
            if (!existingLaw) {
                client.close();
                return res.status(404).json({ message: 'Keyword not found' });
            }

            await db.collection('law_details').deleteOne({ keyword });
    
            client.close();
    
            console.log('Law Deleted Successfully');
            res.render('adminhome');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    
    


    //  USER FEEDBACK

    app.post('/feedback', async (req, res) => {
        try {
            const { fbck } = req.body;
            console.log('Received Form Data:', req.body);
            const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db();
            
            const feedback = {
                fbck,
            };
    
            await db.collection('feedback').insertOne(feedback);
            client.close();
    
            res.json({ message: 'feedback submitted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    //USER SEARCH

    app.post('/search', async (req, res) => {
        try {
            const { keyword } = req.body;
            console.log('Received Form Data:', req.body);
    
            const client = await MongoClient.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    
            const db = client.db();
            const lawDetailsCursor = db.collection('law_details').find({ keyword });
    
            console.log('Law Details Cursor:', lawDetailsCursor);
    
            const lawDetails = [];
            await lawDetailsCursor.forEach(doc => {
                lawDetails.push(doc);
            });
    
            console.log('Law Details from Database:', lawDetails);
    
            if (lawDetails.length === 0) {
                return res.status(404).json({ message: 'Search details not found' });
            }
    
            res.render('searchresults', { lawDetails });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    
    
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });
