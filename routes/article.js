const express = require('express');
const router = express.Router();
const multer = require('multer');

const ArticleController = require('../controllers/article');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/articles/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({storage});

//Routes test
router.get("/test", ArticleController.test);
router.get("/course", ArticleController.course);

//Routes
router.post("/create", ArticleController.create);
router.get("/articles/:amount?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.updateArticle);
router.post("/upload-image/:id", [uploads.single("image")], ArticleController.upload);
router.get("/image/:filename", ArticleController.image);
router.get("/search/:search", ArticleController.search);

module.exports = router;