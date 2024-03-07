const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
        const products = this.getProducts()
        this.setProducts(products);
    }

    addProduct(product) {
        const { title, description, price, img, code, stock } = product
        if (!title || !description || !price || !img || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const products = this.getProducts()

        if (products.some(product => product.code === code)) {
            console.error("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: this.getLastId()+1,
            title,
            description,
            price,
            img,
            code,
            stock
        }
        products.push(newProduct);
        this.setProducts(products);
    }

    updateProduct(id, data) {
        const products = this.getProducts()
        const product = products.find(product => product.id === id);

        if (!product) {
            return;
        }

        product.title = data.title;
        product.description = data.description;
        product.price = data.price;
        product.img = data.img;
        product.code = data.code;
        product.stock = data.stock;

        this.setProducts(products);
    }

    getProducts() {
        try {
            return JSON.parse(fs.readFileSync(this.path));
        } catch {
            return [];
        }
    }

    setProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }

    getProductById(id) {
        const products = this.getProducts()
        const product = products.find(product => product.id === id);

        if (!product) {
            console.error("No se ha encontrado el producto.");

        } else {
            console.log("Producto encontrado.", product);
        }
        return product;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex < 0) {
            console.error("No se ha encontrado el producto.");
            return;
        }

        products.splice(productIndex, 1);
        this.setProducts(products);
    }

    getLastId(){
        const products = this.getProducts();
        let id = 0;

        products.forEach(product => {
            if(product.id > id ) {
                id = product.id;
            } 
        });
        return id;
    }
}
// creamos la instancia del manager
const manager = new ProductManager("./maxProducts.json");

// mostramos el estado inicial de los productos ( en este caso el estado es vacio. )
//console.log(manager.getProducts());

// agregamos productos de forma correcta.
manager.addProduct({
    "title": "producto prueba",
    "description": "este es un producto prueba",
    "price": 200,
    "img": "sin imagen",
    "code": "abc123",
    "stock": 25
});
manager.addProduct({
    "title": "american burger",
    "description": "la mas rica",
    "price": 200,
    "img": "sin imagen",
    "code": "abc124",
    "stock": 30
});
manager.addProduct({
    "title": "triple cheese",
    "description": "la mas potente",
    "price": 100,
    "img": "sin imagen",
    "code": "abc125",
    "stock": 40
});

// agregamos productos sin stock
manager.addProduct({
    "title": "doble bacon",
    "description": "la mas vendida",
    "price": 100,
    "img": "sin imagen",
    "code": "abc126",
    "stock": null
});

// agregamos productos con codigo repetido
manager.addProduct({
    "title": "simple burger",
    "description": "basica",
    "price": 100,
    "img": "sin imagen",
    "code": "abc123",
    "stock": 25
});

// mostramos el nuevo estado de los productos ( deberiamos tener 3 productos en el array )
//console.log(manager.getProducts());

// probamos obtener un producto existente por ID 
manager.getProductById(2);

// probamos obtener un producto inexistente 
manager.getProductById(-1);

// actualizamos el producto ID = 3
manager.updateProduct(3, {
    "title": "Triple Cheese",
    "description": "la mas ricarda, gordardo!",
    "price": 999999,
    "img": "sin imagen",
    "code": "abc125",
    "stock": 300000
});

// probamos borrar un producto inexistente 
manager.deleteProduct(-1);

// probamos borrar un producto existente 
manager.deleteProduct(2);
