const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UrlModel = require('./models/UrlModel');
const base58 = require('./base58');
const reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
mongoose.Promise = global.Promise;

mongoose.connect(process.env.ConnectionString,
{useMongoClient:true});


app.use(express.static('public'));

app.get('/',(req , res )=>{
  res.status(200).sendFile(__dirname+'/views/index.html');
});
app.get('/new/:url*',(req , res )=>{
  let url = req.params['url'] + req.params[0];
  if(url.match(reg)){
         UrlModel.count({}).then(function(count){
           const newURL = {
             origin:url,
             _id:19999+count
           };

           UrlModel.create(newURL).then(function(){
             res.status(200).send({
               origin:url,
               shorten: req.protocol + '://' + req.get('host') +'/'+base58.encode(19999+count)
             });
           }).catch(function(err){console.log(err)});
      }).catch(function(err){console.log(err)});
  }else {
    res.status(400).send({error:"Wrong url format."});
  }
});

app.get('/:id',(req , res )=>{
  let id =  base58.decode(req.params.id);
  UrlModel.findOne({_id:id},function(err,u){
    if(u){
      res.redirect(u.origin);
    }else res.status(404).sendFile(__dirname+'/views/404.html');
  });
});

app.listen(process.env.Port||3000,()=>{
  console.log('Server is ready ...');
});
