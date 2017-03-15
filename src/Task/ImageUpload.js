import React from 'react';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
     this.state = {
          
          userId: '',
          open: false,
            applicationInProgress: false,
            isLoading: true,
            isMyTask: false,
          profile: {
            talents: [],
            profile : {

            },
            Lists: {
                skills: []
            },
           
          },
            
        
    };
  }
   onDrop(files) {
      this.setState({
        files: files
      });
    }

    onOpenClick () {
      this.refs.dropzone.open();
    }
 

 

  render() {
   

    return (
      <div>
            <Dropzone ref="dropzone" onDrop={this.onDrop} >
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <button type="button" onClick={this.onOpenClick}>
                Open Dropzone
            </button>
            {this.state.files ? <div>
            <h2>Uploading {files.length} files...</h2>
            <div>this.state.files.map((file) => <img src={file.preview} />)</div>
            </div> : null}
      </div>
    )
  }
}
  


export default ImageUpload;