function gen(name,code,data,res){

let document = require("pdfkit")
let fs = require("fs")
let stream = fs.createWriteStream("report.pdf")
let doc = new document()
doc.pipe(stream)
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

doc.pipe(res)
doc.fontSize(20)
.text("ACS REPORT",220,20)
.fontSize(12)
.text("File name : "+name,100,100)
.fontSize(16)
.text("Code : ",100,150)
.fontSize(12)
.text(code,150,180)
.addPage()
.fontSize(16)
.text("Error : ",100,220)
.fontSize(12)
.text(data.run.stderr?data.run.stderr:"No Errors!",150,250)
.addPage()
.fontSize(16)
.text("Output : ",100,330)
.fontSize(12)
.text(data.run.stdout?data.run.stdout:"Program Failed",150,360)
/*doc.on("end",()=>{
	let read = fs.createReadStream(__dirname+"/report.pdf")
	let size = fs.statSync(__dirname+"/report.pdf");
      res.setHeader("content-type","application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename=report.pdf`);	  
	  read.pipe(res)
	
})*/

doc.end()




}
module.exports = gen