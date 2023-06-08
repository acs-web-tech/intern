import loadingImage from './images/loading.gif';
import './App.css';
import React from "react";
import axios from "axios";
function App() {
  let [loading,updateLoader] = React.useState({loading:false})
  return (
  <>
  { loading.loading?<div className="loader">
		   <img src={loadingImage}/>
  </div>:"" }
   <Navigation></Navigation>
   <FileUpload loadInfo={updateLoader}></FileUpload> 
 </>
  );
}

function Navigation(){
	return(
	 <>
	<nav>
	<h1>Code Compiler</h1>
	</nav>
	</>
	)
}
function FileUpload(props){
	let [fileUpload,updateUpload] = React.useState([])
	
	return(
	  <div className="fileupload-container">   
		 <table>
		 <thead>
		 <tr>
		 <th>No </th>
		 <th>File name</th>
		 <th>Report</th>
		 </tr>
		 </thead>
		 <tbody>
		 <FileUploadListDOM data={fileUpload}  statedata={fileUpload}></FileUploadListDOM>
		 </tbody>
		 </table>
		 <div className="file-upload-btn" >
             <input type="file" onChange={function(event){
				serverAPI(updateUpload,fileUpload,event,
				new Blob([event.target.files[0]],
				{type:event.target.files[0].type}),
				event.target.files[0].name,props.loadInfo)
                 		
			}} style={{visibility:"hidden"}}  id="upload-label" />			
			<button className="file-upload-elem" id="upload-label">
			<label htmlFor="upload-label"  style={{width:"inherit",height:"inherit"}}>Add Files</label></button>			
		 </div>
		 
	  </div>
	)
}
let FileUploadListDOM =React.memo(function (props){
	
	if(props.data.length>0){
	
		return props.data.map((value,index)=>{
			return(<tr key={index}>
			        <td>{value.id}</td>
					<td>{value.fileObj.name}</td>
					<td data-order={index}><button onClick={()=>{
						let url = URL.createObjectURL(props.statedata[index].report)
						let externalWindow = window.open(
						url,"_blank","width=500,height=500,top=500,left=500,right=500")
					      externalWindow.onunload=()=>{
							  URL.revokeObjectURL(url)
						  }
					}}>Download Report </button></td>
					
			     </tr>)
		})
	}else{
		return(<tr>
			        <td>1</td>
					
			     </tr>)
	}
	
})
function serverAPI(state,fileUpload,event,dataBlob,name,loader){
	let formdata = new FormData()
	formdata.append("file",dataBlob,name)
	
	loader({loading:true})
	let datafetch = axios({
		responseType:"blob",
		method:"post",
		url:"http://localhost:80/execute",
		data:formdata
	}).then((e)=>{
		console.log(e.data)
		state([...fileUpload,{id:fileUpload.length+1,fileObj:event.target.files[event.target.files.length-1],report:e.data}])
	   loader({loading:false})
	}).catch((e)=>{
		console.log(e.data)
	})
}
export default App;


