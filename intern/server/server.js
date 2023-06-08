let express = require("express")
let app = express()
let axs = require("axios")
let pdf = require("./pdfgen")
let expressfileupload = require("express-fileupload")
app.use(express.urlencoded({extended:true}))
app.use(expressfileupload())

app.use(function(req,res,next){
	res.setHeader("Access-Control-Allow-Origin","http://localhost:3000")
	res.setHeader("Access-Control-Allow-Headers","*")
	next()
})
app.post("/execute",function(req,res){
	let runtimes = [{ext:"py"}]
	let data = req.files.file.data.toString()
	console.log(req.files)
	let language = req.files.file.mimetype.split("/")[1]
	console.log(req.body)
	axs({url:"https://emkc.org/api/v2/piston/runtimes",method:"get"}).then((e)=>{
		return e.data.filter((value)=>{
			if(value.language.includes(req.files.file.name.split(".")[1]) || value.language.includes(req.files.file.mimetype.split("/")[1])){
				return value
			}
		})
	}).then((e)=>{
		
		
	  axs({url:"https://emkc.org/api/v2/piston/execute",
	  method:"post",
	  headers:{"content-type":"application/json"},
	  data:{
  "language": e[e.length-1].language,
  "version": e[e.length-1].version,
  "files": [
    {
      "name": req.files.file.name,
      "content": req.files.file.data.toString()
    }
  ]
}}).then((e)=>{
		pdf(req.files.file.name,data,e.data,res)
	})
			
	}).catch((e)=>{
		console.log(e.data)
	})

	

})

app.listen(80,()=>{
	console.log("server running")
})