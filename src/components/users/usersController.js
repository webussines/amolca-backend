'use strict'

const mongoose = require('mongoose');
const User = require('./UsersModel');
const TokenService = require('../auth/tokenService');

//Controller to get ALL users
async function getAllUsers(req, res) {
    const users = await User.find();
    res.json(users);
}

//Controller to get ONE user
async function getOneUser(req, res) {
    let userId = req.params.id;

    User.findById(userId, (err, user) => {
        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'});

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: 'An error has ocurred in server'});

        //Send OK status and user
        res.status(200).send(user)
    });
}

//Controller to delete one user
async function deleteUser(req, res) {
    if(req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }
    
    let userId = req.params.id;

    User.findById(userId, (err, user) => {

        //If user not exists
        if(!user) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        //Remove user
        user.remove((err) => {
            if(err) if(err) return res.status(500).send({status: 500, message: 'An error has ocurred removing this resource'});

            res.status(200).send({status: 200, message: 'Resource successfully removed'});
        });
    });
}

//Controller to update an user
async function updateUser() {
    if(req.headers["content-type"] !== 'application/json'){
        return res.status(500).send({
            status: 500,
            message: 'Server not supported the Content-Type header sended in this request'
        })
    }

    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true} , (err, doc) => {
        //If user not exists
        if(!doc) return res.status(404).send({status: 404, message: 'This resource not exists'})

        //If user exists but an error has ocurred
        if(err) return res.status(500).send({status: 500, message: `An error has ocurred in server: ${err}`})

        res.status(200).send(doc)
    });
}

module.exports = {
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser
}