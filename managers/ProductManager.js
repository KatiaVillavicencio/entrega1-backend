import fs from "fs"

export default class ProductManager {
  constructor(path) {
    (this.path = path), (this.products = []);
  }

    //Agregar// create
    addProduct = async (obj) => {
      const {title, description, price, thumbnail,category,status=true, code, stock}=obj
      if (!title || !description || !price || !category || !code ||!status || !stock) {
        console.error("Campos obligatorios");
        return;
      } else {
        const listadoProductos=await this.getProducts({})
        const codigorepetido = listadoProductos.find(
          (elemento) => elemento.code === code
        );
        if (codigorepetido) {
          console.error(`Código ${code} repetido`);
          return;
        } else {
          const id = await this.generateId();
          const newProduct = {id, title, description,price,category,status,thumbnail,
            code,stock };
          listadoProductos.push(newProduct);
          await fs.promises.writeFile(this.path,
            JSON.stringify(listadoProductos)
          );
        }
      }
    };

    //Generate id
  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        const counter = productlistJs.length;
        if (counter == 0) {
          return 1;
        } else {
          return productlistJs[counter - 1].id + 1;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };


  //Read//
    getProducts = async (info) => {

      try {
        const { limit } = info;
  
        if (fs.existsSync(this.path)) {
        
          const productlist = await fs.promises.readFile(this.path, "utf-8");
          const productlistJs = JSON.parse(productlist);
          if (limit) {
            const limitProducts = productlistJs.slice(0, parseInt(limit));
            return limitProducts;
          } else {
            return productlistJs;
          }
        } else {
          return [];
        }
      } catch (error) {
        throw new Error(error);
      }
    };

 //Update
   updateProduct = async (id,obj) => {
    const {pid}=id
    const {title, description, price, category,thumbnail, status,code, stock}=obj
       if(title===undefined || description===undefined || price===undefined || category===undefined || status===undefined || code===undefined||stock===undefined){
    console.error( "Campos obligatorios para actualizar");
    return;
   } else {
    const listadoProductos = await this.getProducts({});
    const codigorepetido = listadoProductos.find( (i) => i.code === code);
    if (codigorepetido) {
      console.error(`Código para actualizar ${code} repetido`);
      return;
    } else {
      const listadoProductos = await this.getProducts({});
      const newProductsList = listadoProductos.map((elemento) => {
        if (elemento.id === parseInt(pid)) {
        const updatedProduct = {...elemento,title, description, price, category, status, thumbnail, code, stock};
        return updatedProduct;
        }
         else {
          return elemento;
        }
      });
      await fs.promises.writeFile(this.path,JSON.stringify(newProductsList))
            }
            
        }
      };


//Delete//
      deleteProduct=async(id)=>{
        const allProducts=await this.getProducts()
        const productFilter=allProducts.filter(elemento=>elemento.id!==id)
       await fs.promises.writeFile(this.path,JSON.stringify(productFilter))
      }

      getProductbyId = async (id) => {
        try {
          const {pid}=id
          if (fs.existsSync(this.path)) {
            const allproducts = await this.getProducts({});
            const product = allproducts.find((element) => element.id === parseInt(pid));
            if (product) {
              return product;
            } else {
              throw new Error("Not found");
            }
          } else {
            throw new Error("Product not found");
          }
        } catch (error) {
          throw new Error(error);
        }
      };
}
  

/*

async function productsAsync(){
const productos =new ProductManager();

/*
//Agregamos productos//

await productos.addProduct('Reloj de pared','reloj vintage madera', 150,"photo1.png","001","100");
await productos.addProduct('Lámpara','lámpara de mesa Beige 35x20cm', 180,"photo2.png","002","100");
await productos.addProduct('Florero','florero de Vidrio de Cuadritos', 150,"photo3.png","003","100");

//Actualizamos//

await productos.updateProduct('Florero-2','florero de Vidrio de Cuadritos', 90,"photo4.png","003","100")

//Borramos//

await productos.deleteProduct(1)

//verificamos el id//

await productos.getProductbyId(3)

//llamamos a todos los productos //
console.log (await productos.getProducts())


}
productsAsync()*/









