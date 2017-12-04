var express = require('express'),
	bodyParser = require('body-parser'),
	MongoClient = require('mongodb').MongoClient,
	template = require('pug'),
	ObjectId = require('mongodb').ObjectID;
	app = express()

var db
var selfurl='http://localhost:3000'


//app.set('view engine','pug')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//for connection db
MongoClient.connect('mongodb://localhost:27017/tokobuku', (err, database) => {
	if (err) return console.log(err)
	db=database
	app.listen(3000, () => {
	console.log('listening on 3000')
	})
})

//routing
app.get('/', (req, res) => {
	db.collection('buku').find().toArray(function(err, results){
	if(err) return console.log(err)
		var html = template.compileFile(__dirname + '/views/index.pug')({
			data:results,self_url:selfurl
		})
		res.send(html)
	})
})
app.get('/update/:id', (req, res) => {
	db.collection('buku').find({"_id":ObjectId(req.params.id)}).toArray(function(err, results){
		if(err) return console.log(err)

		var html = template.compileFile(__dirname + '/views/update.pug')({
			data:results,self_url:selfurl
		})
		res.send(html)
		
	})
})




//insert data
app.post('/savedata', (req,res) => {
  db.collection('buku').save(req.body,(err,response) => {
  	if(err) return console.log(err+" error nih")

  	res.redirect('/')
  })
})


//delete data
app.get('/delete/:id', (req, res) => {
	db.collection('buku').deleteOne({"_id":ObjectId(req.params.id)}, function(err){
		if(err) return console.log(err)

		console.log('berhasil di delete')
	})
})

//update data
app.post('/updatedataAndSave', (req, res) => {
	db.collection('buku').update(
	   {
		"_id":ObjectId(req.body.id)
	    },
	    {
	    	"judul":req.body.judul,
	    	"pengarang":req.body.pengarang
	    },function(err,response){
	    	if(err) return console.log('gagal update')
	    	res.redirect('/')
	    	console.log('berhasil update')
	    })
})

