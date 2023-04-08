const Producto = require('../models/producto');
const slugify = require('slugify')
const fs = require('fs')
const path = require('path')

const registro_producto_admin = async function (req, res) {
  if (req.user) {
    let data = req.body;
    let productos = await Producto.find({ titulo: data.titulo });

    if (productos.length >= 1) {
      res.status(401).send({ data: undefined, message: 'El titulo del producto ya existe.' });
    } else {
      //REGISTRO PRODUCTO
      const img_path = req.files.portada.path
      const str_img = img_path.split('\\')
      const str_portada = str_img[2]

      data.portada = str_portada
      data.slug = slugify(data.titulo)

      try {
        let producto = await Producto.create(data);
        res.status(200).send({ data: producto, message: 'Productos subidos' })
      } catch (error) {
        res.status(400).send({ data: undefined, message: messages.join(', ') });
      }
    }
  } else {
    res.status(500).send({ data: undefined, message: 'Ocurrió un error al registrar el producto.' });
  }
}

const listar_productos_admin = async (req, res) => {
  if (req.user) {
    let filtro = req.params['filtro'];

    let productos = await Producto.find({
      $or: [
        { titulo: new RegExp(filtro, 'i') },
        { categoria: new RegExp(filtro, 'i') },
      ]
    });
    res.status(200).send({ message: "Lista de productos", productos })
  } else {
    res.status(401).send({ data: undefined, message: "No se puede encontrar el producto" })
  }
}

const obtener_portada_producto = async (req, res) => {
  // Obtenemos el nombre de la imagen de portada del producto a través del parámetro 'img' de la solicitud
  let img = req.params['img'];

  // Utilizamos el método 'fs.stat' para verificar si la imagen existe en la carpeta 'uploads/productos/'
  fs.stat('./uploads/productos/' + img, function (err) {
    if (err) {
      // Si la imagen no existe, establecemos la ruta de una imagen predeterminada como portada
      let path_img = './uploads/default.jpg';
      // Enviamos la imagen predeterminada como respuesta con un estado HTTP 200
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      // Si la imagen existe, establecemos la ruta de la imagen correspondiente como portada
      let path_img = './uploads/productos/' + img;
      // Enviamos la imagen correspondiente como respuesta con un estado HTTP 200
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
}


module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada_producto
}
