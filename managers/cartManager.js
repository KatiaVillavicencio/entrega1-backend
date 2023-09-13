import fs from "fs"

export default class CartManager{
    constructor(){
      this.path ="./files/carts.json",
      this.carts=[]
    }


    //Read//
    getCarts=async()=>{
    if(fs.existsSync(this.path)){
      const cartList= await fs.promises.readFile(this.path,"utf-8")
      const cartlistParse=JSON.parse(cartList)
      return cartlistParse
    }
    else{
      return []
     }
    }


    getCartbyId=async(id)=>{

     try {
      const {cid}=id
      if (fs.existsSync(this.path)) {
        const allcarts=await this.getCarts()
        const carts=allcarts.find(element=>element.id===parseInt(cid))
        if (carts) {
          return carts;
        } else {
         return ("cart not found");
        }
      } else {
        return("cart json no encontrado");
      }
      } catch (error) {
      return(error);
      }
    }
    //Generate Id
    generatecartId=async()=>{
      try {
        if (fs.existsSync(this.path)) {
          const cartlist = await fs.promises.readFile(this.path, "utf-8");
          const cartlistJs = JSON.parse(cartlist);
          const counter = cartlistJs.length;
          if (counter == 0) {
            return 1;
          } else {
            return cartlistJs[counter - 1].id + 1;
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    addCart = async () => {
      const listaCarts = await this.getCarts();
      const id = await this.generatecartId();
      const cartNew = {
        id,
        products: []
      };
      listaCarts.push(cartNew);
      await fs.promises.writeFile(this.path, JSON.stringify(listaCarts));
    }
    

      addProductToCart = async (cid, pid) => {
        const listaCarts = await this.getCarts();
        const cart = listaCarts.find(e => e.id === cid);
        const productIndex = cart.products.findIndex(p => p.pid === pid);
      
        if (productIndex !== -1) {
          // Si el producto ya existe en el carrito, incrementar la cantidad
          cart.products[productIndex].quantity++;
        } else {
          // Si el producto no existe en el carrito, agregarlo como un nuevo
          cart.products.push({
            pid,
            quantity: 1
          });
        }
      
        await fs.promises.writeFile(this.path, JSON.stringify(listaCarts));
      }
      

     
    }