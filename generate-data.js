const { faker, th } = require('@faker-js/faker');
const { create } = require('domain');
const fs=require('fs');
faker.locale = 'vi';


const randomCategoryList=(n)=>{
    if(n<=0) return [];
    const categoryList=[];
    //loop and push category
    Array.from(new Array(n)).forEach(()=>{
        const category={
            id:faker.string.uuid(),
            name:faker.commerce.department(),
            createdAt:Date.now(),
            updatedAt:Date.now(),
        }
        categoryList.push(category);
    });
    return categoryList;
};
const randomproductList=(categoryList,numberOfproducts)=>{
    if(numberOfproducts<=0) return [];
    const productList=[];
   //random data
    for (const category of categoryList) 
        {
            Array.from(new Array(numberOfproducts)).forEach(()=>{
                const product ={
                    categoryId:category.id,
                    id:faker.string.uuid(),
                    name:faker.commerce.productName(),
                    color:faker.color.human(),
                    price:Number.parseFloat(faker.commerce.price()),
                    description:faker.commerce.productDescription(),
                    createdAt:Date.now(),
                    updatedAt:Date.now(),
                    thumbnailUrl:faker.image.urlPicsumPhotos({ width: 400, height: 400 })
                    
                }
                productList.push(product);
            })
        
    }


    return productList;
};
//IFFE
(()=>{
    //RANDOM DATA
const categoryList=randomCategoryList(4);
const productList =randomproductList(categoryList,5);



    //prepare db obj
    const db = { 
        categories:categoryList,
        products:productList,
        profile:{
            name:"Po",
        },

    };
    //write db obj to db json
    fs.writeFile('db.json',JSON.stringify(db),()=>{
        console.log('Generate data successfully!');
    });

})();