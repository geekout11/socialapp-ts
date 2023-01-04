import nextConnect from 'next-connect';
import multer from 'multer';

const handler = nextConnect();
const upload = multer({ dest: 'uploads/' });

handler.post(upload.single('file'), (req, res) => {
  // the file is now uploaded and stored in the 'uploads' directory
  console.log(req.file);
  res.sendStatus(200);
});

export default handler;