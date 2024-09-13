import { useDropzone } from 'react-dropzone';

const Upload = ({ onFileUploaded }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFileUploaded(acceptedFiles[0]);
    },
  });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px' }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a file here, or click to select one</p>
    </div>
  );
};

export default Upload;
