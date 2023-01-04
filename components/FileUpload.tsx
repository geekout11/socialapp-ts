import { useRef } from 'react';

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    const file = fileInputRef.current?.files![0];
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // listen for progress events
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        // calculate the progress percentage
        const progress = Math.round((event.loaded / event.total) * 100);
        console.log(`File upload progress: ${progress}%`);
      }
    });

    // listen for the load event (when the upload is complete)
    xhr.addEventListener('load', () => {
      console.log('File upload complete');
    });

    // listen for any errors
    xhr.addEventListener('error', () => {
      console.error('There was an error uploading the file');
    });

    // open the POST request to the server
    xhr.open('POST', '/api/upload');

    // send the request with the file data
    xhr.send(formData);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default FileUpload