var express= require('express')
var bodyParser= require("body-parser")
var path= require('path')
var mongoose= require('mongoose')
var app= express()
mongoose.connect('mongodb://localhost/message_board');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var Schema = mongoose.Schema;
var CommentSchema=new mongoose.Schema({
  name:{type:String},
  content:{type:String},
  _message:{type: Schema.Types.ObjectId,ref:"Message"}
})

var MessageSchema= new mongoose.Schema({
  name:{type:String},
  content:{type:String},
  comments:[{type: Schema.Types.ObjectId,ref:"Comment"}]
})
mongoose.model('Message', MessageSchema)
var Message= mongoose.model('Message')
mongoose.model('Comment', CommentSchema)
var Comment= mongoose.model('Comment')
app.get('/',(req,res)=>{
  Message.find({}).populate("comments").exec((err,messages)=>{
    if(err){
      res.json(err)
    }else{
      res.render('index',{messages})
    }
  })
})
app.post('/message', (req,res)=>{
  console.log('Post', req.body)
  var message=new Message(req.body)
  message.save((err)=>{
    if(err){
      console.log('couldnt save message')
      res.redirect('/')
    }else{
      console.log('Saved the message')
      res.redirect('/')
    }
  })
})
app.post('/comments/:mssg_id', (req,res)=>{
  Message.findOne({_id:req.params.mssg_id},(err,message)=>{
    if(err){
      console.log('couldnt find the chef')
      res.json(err)
    }else{
    console.log('found the message')
    let newComment= new Comment({
      name:req.body.name,
      content:req.body.content,
      _message:req.body.message
    })
    newComment.save((err)=>{
      if(err){
        console.log('couldnt save the comment')
      }else{
        console.log('save that comment')
        message.comments.push(newComment)
        message.save((err)=>{
          if(err){
            console.log('couldnt save the comment')
          }else{console.log('we got everything done!')}
        })
      }
    })
    }
    res.redirect('/')
  })
})
app.listen(8000, ()=>{
  console.log('listening for that shit!')
})
