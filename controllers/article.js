const validator = require("validator");
const path = require('path');
const Article = require("../models/Article");
const fs = require("fs");

const test = (req, res) => {
    return res.status(200).json({
        message: "Accion de prueba"
    });
}

const course = (req, res) => {
    return res.status(200).json({
        id: 12,
        name: "Camilo Lopez",
        web: "https://portfolio-camilo-lopez.web.app"
    });
}

const create = (req, res) => {

    let params = req.body;

    try {
        let validate_title = !validator.isEmpty(params.title);
        let validate_content = !validator.isEmpty(params.content);

        if (!validate_content || !validate_title) {
            throw new Error("No se ha validado la informacion");
        }

    } catch (error) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar"
        });
    }

    const article = new Article(params);
    article.save();

    if (article)
        return res.status(200).json({
            status: "success",
            message: "Articulo creado con exito",
            article
        });
    else {
        return res.status(400).json({
            status: "Error",
            message: "Error al crear el articulo"
        });
    }
}

const getArticles = async(req, res) => {

    try {
        let articlesQuery = Article.find({}); // Inicializar la consulta

        let amount = parseInt(req.params.amount);

        console.log(amount);

        if (amount) {
            // Si se proporciona un valor para amount, aplicar el límite a la consulta
            articlesQuery = articlesQuery.limit(amount);
        }

        const articles = await articlesQuery.exec(); // Espera a que se resuelva la consulta

        return res.status(200).json({
            status: "success",
            amount: req.params.amount,
            message: "Encontrados con éxito!!",
            articles: articles
        });
        
    } catch (err) {
        console.error('Error al obtener los datos:', err);
        return res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

const getArticle = (req, res) => {
    let id = req.params.id;

    Article.findById(id)
        .then((article) => {
            if (!article) {
                return res.status(404).json({ error: 'Artículo no encontrado' });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Artículo encontrado con éxito!!',
                article: article,
            });
        })
        .catch((err) => {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ error: 'Error al obtener el artículo' });
        });
};

const deleteArticle = (req, res) => {
    let id = req.params.id;

    Article.findOneAndDelete({ _id: id })
        .then((article) => {
            if (!article) {
                return res.status(404).json({ error: 'Artículo no encontrado' });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Artículo borrado con éxito!!',
                article: article,
            });
        })
        .catch((err) => {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ error: 'Error al borrar el artículo' });
        });
}

const updateArticle = (req, res) => {
    let id = req.params.id;
    let data = req.body;

    try {
        let validate_title = !validator.isEmpty(req.body.title);
        let validate_content = !validator.isEmpty(req.body.content);

        if (!validate_content || !validate_title) {
            throw new Error("No se ha validado la informacion");
        }

    } catch (error) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar"
        });
    }

    Article.findOneAndUpdate({ _id: id }, data, { new: true })
        .then((article) => {
            if (!article) {
                return res.status(404).json({ error: 'Artículo no encontrado' });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Artículo encontrado con éxito!!',
                article: article,
            });
        })
        .catch((err) => {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ error: 'Error al obtener el artículo' });
        });
}

const upload = (req, res) => {

    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "Error",
            message: "Petición invalida"
        })
    }

    let filename = req.file.originalname;
    let file_split = filename.split("\.");
    let file_extension = file_split[1];

    if (file_extension !== "png" && file_extension !== "jpg" && file_extension !== "jpeg" && file_extension !== "webp") {
        fs.unlink(req.file.path, (err) => {
            return res.status(400).json({
                status: "Error",
                message: "Imagen invalida"
            })
        })
    } else {

        Article.findOneAndUpdate({ _id: req.params.id }, { image: req.file.filename }, { new: true })
            .then((article) => {
                if (!article) {
                    return res.status(404).json({ error: 'Artículo no encontrado' });
                }

                return res.status(200).json({
                    status: 'success',
                    message: 'Imagen del artículo actualizado con éxito!!',
                    article: article,
                    image: req.file
                });
            })
            .catch((err) => {
                console.error('Error al obtener el artículo:', err);
                return res.status(500).json({ error: 'Error al obtener el artículo y actualizarlo' });
            });
    }
}

const image = (req, res) => {
    let filename = req.params.filename;
    let route = "./images/articles/" + filename;

    fs.stat(route, (err, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(route));
        } else {
            return res.status(404).json({
                status: 'Error',
                message: 'Imagen no encontrada'
            });
        }
    })
}

const search = (req, res) => {

    let search = req.params.search;

    Article.find({
        "$or": [
            { "title": { "$regex": search, "$options": "i" } },
            { "content": { "$regex": search, "$options": "i" } }
        ]
    })
        .sort({ fecha: -1 })
        .exec()
        .then((articles) => {
            if (!articles || articles.length <= 0) {
                return res.status(404).json({
                    message: 'Artículos no encontrados',
                    status: "Error"
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Articulos con éxito!!',
                articles
            });
        })
        .catch((err) => {
            console.error('Error al obtener el artículo:', err);
            return res.status(500).json({ message: 'Error al buscar los artículos' });
        });

}

module.exports = {
    test,
    course,
    create,
    getArticle,
    getArticles,
    deleteArticle,
    updateArticle,
    upload,
    image,
    search
}