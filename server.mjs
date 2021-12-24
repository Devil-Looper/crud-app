  
import express from "express";
import morgan from "morgan";
import cors from "cors"
import mongoose from "mongoose"

mongoose.connect('mongodb+srv://hamzakhan62777@nodecrudcluster.pnzhv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
const USER = mongoose.model('users', {
    name: String,
    email: String,
    address: String,
})

const port = process.env.PORT || 3001;
const app = express();

const user = [];

app.use(express.json());
app.use(morgan('short'));

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send("Server is working")
})

// get all user
app.get('/users', (req, res) => {
    USER.find({}, (err, users) => {
        if (!err) {
            res.send(users)
        } else {
            res.status(500).send("error happened")
        }
    })
    .catch(error => {console.log(error.message)})
})

// add user
app.post('/user', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.address) {
        res.status(400).send('invalid data');
    }
    else {
         // user.push({
        //     name: req.body.name,
        //     email: req.body.email,
        //     address: req.body.address
        // })
        const newUser = new USER({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        });

        newUser.save().then(() => {
            console.log('user created success')
            res.json({response: 'User Created'});
        })
        .catch(error => {console.log(error.message)})
       
    }
})

// update user
app.put('/user/:id', (req, res) => {
    
    let updateObj = {}

    if (req.body.name) {
        updateObj.name = req.body.name;
    }
    if (req.body.email) {
        updateObj.email = req.body.email;
    }
    if (req.body.address) {
        updateObj.address = req.body.address;
    }

    USER.findByIdAndUpdate(req.params.id, updateObj, { new: true },
        (err, data) => {
            if (!err) {
                res.send(data)
            } else {
                res.status(500).send("error happened")
            }
    })
    .catch(error => {console.log(error.message)})


})

// delete user
app.delete('/user/:id', (req, res) => {
    USER.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            res.send({response: "user deleted"})
        } else {
            res.status(500).send("error happened")
        }
    })
    .catch(error => {console.log(error.message)})

})

app.listen(port);
