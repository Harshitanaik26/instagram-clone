import React , {useState} from 'react';
import firebase from 'firebase/compat/app';
import { storage , db , provider } from './firebase';
import Button from '@mui/material/Button';
import './ImageUpload.css'


function ImageUpload({username }) {

    const [image , setImage] = useState(null);
    const [progress , setProgress] = useState([0]);
    const [caption , setCaption] = useState('');

    const handleChange = e =>{
        if (e.target.files[0]){
            setImage(e.target.files[0])
        } 
    };

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
        "state_changed",
        (snapshot)=>{
                //progress
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgress(progress)
                },
        (error)=>{
            console.log(error)
            alert(error.message)
        },
        ()=>{
            //complete
            storage.ref('images').child(image.name).getDownloadURL().then(url=>{
                //post image in db
                db.collection("posts").add({
                    timestamp:firebase.default.firestore.FieldValue.serverTimestamp(),
                    caption:caption,
                    imgUrl:url,
                    username:username
                })
                setProgress(0);
                setCaption(" ");
                setImage(null);
            })
        }
                
            )
         //}
    }

  return (
    <div className="imageupload">
      {/* Caption input */}
      {/* Upload file */}
      {/* Post button */}
    <progress value={progress} max="100" className="imageupload-progress"/>
      <input type="text " placeholder="Enter a caption" onChange={(event=>setCaption(event.target.value))} value={caption}/>
      <input type="file" onChange={handleChange}/>
      <Button onClick={handleUpload}>
          Upload
      </Button>
    </div>
  )
}

export default ImageUpload 