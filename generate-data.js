const { faker } = require('@faker-js/faker');
const fs = require('fs');
faker.locale = 'vi';

// Danh sách danh mục quần áo thực tế
const clothingCategories = [
    'Áo thun nam',
    'Áo sơ mi nam', 
    'Quần jean nam',
    'Quần tây nam',
    'Áo thun nữ',
    'Áo sơ mi nữ',
    'Váy đầm nữ',
    'Quần jean nữ',
    'Áo khoác',
    'Đồ thể thao'
];

// Danh sách màu sắc quần áo
const clothingColors = [
    'Đen', 'Trắng', 'Xanh dương', 'Xanh lá', 'Đỏ', 'Vàng', 'Cam', 'Tím', 'Hồng', 'Nâu', 'Xám'
];

// Danh sách kích thước
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Danh sách thương hiệu
const clothingBrands = [
    'Nike', 'Adidas', 'Uniqlo', 'Zara', 'H&M', 'Gap', 'Levi\'s', 'Calvin Klein', 'Tommy Hilfiger'
];

// Hàm tạo URL ảnh phù hợp với từng loại quần áo
const getClothingImageUrl = (categoryName, imageType = 'main') => {
    let searchTerm = 'fashion';
    
    if (categoryName.includes('Áo thun')) {
        searchTerm = 't-shirt';
    } else if (categoryName.includes('Áo sơ mi')) {
        searchTerm = 'dress-shirt';
    } else if (categoryName.includes('Quần jean')) {
        searchTerm = 'jeans';
    } else if (categoryName.includes('Quần tây')) {
        searchTerm = 'dress-pants';
    } else if (categoryName.includes('Váy')) {
        searchTerm = 'dress';
    } else if (categoryName.includes('Áo khoác')) {
        searchTerm = 'jacket';
    } else if (categoryName.includes('thể thao')) {
        searchTerm = 'sportswear';
    }
    
    // Thêm từ khóa bổ sung để có ảnh đa dạng hơn
    const additionalTerms = ['clothing', 'fashion', 'apparel', 'wear'];
    const randomTerm = faker.helpers.arrayElement(additionalTerms);
    
    return `https://source.unsplash.com/400x400/?${searchTerm},${randomTerm}`;
};

// Alternative: Sử dụng Picsum với seed để có ảnh ổn định
const getStableImageUrl = (productId) => {
    return `https://picsum.photos/seed/${productId}/400/400`;
};

const randomCategoryList = (n) => {
    if (n <= 0) return [];
    const categoryList = [];
    
    const shuffled = clothingCategories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffled.slice(0, n);
    
    selectedCategories.forEach((categoryName, index) => {
        const category = {
            id: faker.string.uuid(),
            name: categoryName,
            description: faker.commerce.productDescription(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        categoryList.push(category);
    });
    return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
    if (numberOfProducts <= 0) return [];
    const productList = [];
    
    for (const category of categoryList) {
        Array.from(new Array(numberOfProducts)).forEach(() => {
            const productId = faker.string.uuid();
            
            // Tạo tên sản phẩm dựa trên danh mục
            let productName = '';
            if (category.name.includes('Áo thun')) {
                productName = faker.helpers.arrayElement([
                    'Áo thun basic', 'Áo thun polo', 'Áo thun graphic', 'Áo thun cổ tròn'
                ]);
            } else if (category.name.includes('Áo sơ mi')) {
                productName = faker.helpers.arrayElement([
                    'Áo sơ mi trắng', 'Áo sơ mi kẻ sọc', 'Áo sơ mi hoa', 'Áo sơ mi denim'
                ]);
            } else if (category.name.includes('Quần jean')) {
                productName = faker.helpers.arrayElement([
                    'Quần jean slim fit', 'Quần jean straight leg', 'Quần jean boyfriend', 'Quần jean mom fit'
                ]);
            } else if (category.name.includes('Váy')) {
                productName = faker.helpers.arrayElement([
                    'Váy hoa', 'Váy body', 'Váy xòe', 'Váy maxi', 'Váy mini'
                ]);
            } else {
                productName = faker.commerce.productName();
            }
            
            const product = {
                categoryId: category.id,
                id: productId,
                name: productName,
                brand: faker.helpers.arrayElement(clothingBrands),
                color: faker.helpers.arrayElement(clothingColors),
                size: faker.helpers.arrayElement(clothingSizes),
                price: Number.parseFloat(faker.commerce.price({ min: 100000, max: 2000000 })),
                salePrice: Number.parseFloat(faker.commerce.price({ min: 80000, max: 1500000 })),
                description: faker.commerce.productDescription(),
                material: faker.helpers.arrayElement(['Cotton', 'Polyester', 'Denim', 'Linen', 'Silk']),
                inStock: faker.datatype.boolean(),
                rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
                reviewCount: faker.number.int({ min: 0, max: 100 }),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                
                // Cải thiện URL ảnh - Chọn 1 trong 2 phương pháp:
                
                // Phương pháp 1: Sử dụng Unsplash với từ khóa cụ thể
                thumbnailUrl: getClothingImageUrl(category.name),
                images: [
                    getClothingImageUrl(category.name, 'main'),
                    getClothingImageUrl(category.name, 'detail'),
                    getClothingImageUrl(category.name, 'style')
                ],
                
                // Phương pháp 2: Sử dụng Picsum với seed (uncomment để dùng)
                // thumbnailUrl: getStableImageUrl(productId + '-thumb'),
                // images: [
                //     getStableImageUrl(productId + '-1'),
                //     getStableImageUrl(productId + '-2'),
                //     getStableImageUrl(productId + '-3')
                // ],
                
                // Phương pháp 3: Sử dụng placeholder image cố định
                // thumbnailUrl: `https://via.placeholder.com/400x400/cccccc/333333?text=${encodeURIComponent(productName)}`,
                // images: [
                //     `https://via.placeholder.com/400x400/f0f0f0/333333?text=${encodeURIComponent('Ảnh 1')}`,
                //     `https://via.placeholder.com/400x400/e0e0e0/333333?text=${encodeURIComponent('Ảnh 2')}`,
                //     `https://via.placeholder.com/400x400/d0d0d0/333333?text=${encodeURIComponent('Ảnh 3')}`
                // ]
            }
            productList.push(product);
        })
    }
    return productList;
};

// IIFE
(() => {
    // RANDOM DATA
    const categoryList = randomCategoryList(10);
    const productList = randomProductList(categoryList, 10);

    // prepare db obj
    const db = { 
        categories: categoryList,
        products: productList,
        profile: {
            name: "Po",
        },
    };
    
    // write db obj to db json
    fs.writeFile('db.json', JSON.stringify(db, null, 2), () => {
        console.log('Generate clothing data successfully!');
        console.log(`Created ${categoryList.length} categories and ${productList.length} products`);
    });
})();