const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const {
  getProducts,
  createProduct,
  getProductById,
  getMyProducts,
  deleteProduct,
  updateProduct
} = require('../controllers/productController');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/my', auth, getMyProducts);         // ✅ Place before /:id
router.get('/:id', getProductById);
router.post('/', auth, upload.single('image'), createProduct);
router.delete('/:id', auth, deleteProduct);

router.put('/:id', auth, upload.single('image'), updateProduct);




module.exports = router;
