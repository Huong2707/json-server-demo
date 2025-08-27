const { faker } = require('@faker-js/faker');
const fs = require('fs');
faker.locale = 'vi';

// Danh sách danh mục quần áo nam nữ
const clothingCategories = [
    { name: 'Áo thun nam', gender: 'nam' },
    { name: 'Áo sơ mi nam', gender: 'nam' },
    { name: 'Quần jean nam', gender: 'nam' },
    { name: 'Quần tây nam', gender: 'nam' },
    { name: 'Áo thun nữ', gender: 'nữ' },
    { name: 'Áo sơ mi nữ', gender: 'nữ' },
    { name: 'Váy đầm', gender: 'nữ' },
    { name: 'Quần jean nữ', gender: 'nữ' },
    { name: 'Áo khoác unisex', gender: 'unisex' },
    { name: 'Đồ thể thao', gender: 'unisex' }
];

// Danh sách màu sắc
const clothingColors = [
    'Đen', 'Trắng', 'Xanh navy', 'Xanh dương', 'Xám', 'Đỏ', 'Hồng', 'Vàng', 'Cam', 'Tím', 'Nâu'
];

// Kích thước theo giới tính
const sizes = {
    nam: ['S', 'M', 'L', 'XL', 'XXL'],
    nữ: ['XS', 'S', 'M', 'L', 'XL'],
    unisex: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

// Thương hiệu
const brands = [
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Levi\'s', 'Calvin Klein', 'Tommy Hilfiger'
];

// Chất liệu
const materials = ['Cotton', 'Polyester', 'Jean', 'Kaki', 'Linen', 'Silk', 'Viscose'];

// Hàm tạo tên sản phẩm theo danh mục
const generateProductName = (categoryName) => {
    const productNames = {
        'Áo thun nam': ['Áo thun basic nam', 'Áo thun polo nam', 'Áo thun graphic nam', 'Áo thun cổ tròn nam'],
        'Áo sơ mi nam': ['Áo sơ mi trắng nam', 'Áo sơ mi kẻ sọc nam', 'Áo sơ mi công sở nam', 'Áo sơ mi denim nam'],
        'Quần jean nam': ['Quần jean slim fit nam', 'Quần jean straight nam', 'Quần jean skinny nam', 'Quần jean rách nam'],
        'Quần tây nam': ['Quần tây công sở nam', 'Quần tây kaki nam', 'Quần tây slim nam', 'Quần tây classic nam'],
        'Áo thun nữ': ['Áo thun basic nữ', 'Áo thun croptop', 'Áo thun oversized nữ', 'Áo thun vintage nữ'],
        'Áo sơ mi nữ': ['Áo sơ mi trắng nữ', 'Áo sơ mi hoa nữ', 'Áo sơ mi lụa nữ', 'Áo sơ mi tay bồng'],
        'Váy đầm': ['Váy xòe', 'Váy bodycon', 'Đầm maxi', 'Váy mini', 'Đầm suông'],
        'Quần jean nữ': ['Quần jean skinny nữ', 'Quần jean mom fit', 'Quần jean boyfriend', 'Quần jean wide leg'],
        'Áo khoác unisex': ['Áo hoodie', 'Áo bomber', 'Áo khoác jean', 'Áo cardigan', 'Áo blazer'],
        'Đồ thể thao': ['Áo thun thể thao', 'Quần short thể thao', 'Bộ đồ yoga', 'Áo tank top', 'Quần jogger']
    };
    
    return faker.helpers.arrayElement(productNames[categoryName] || [categoryName]);
};

// Hàm tạo URL ảnh theo loại sản phẩm
const getImageUrl = (categoryName) => {
    const imageKeywords = {
        'Áo thun nam': 'men-tshirt',
        'Áo sơ mi nam': 'men-shirt', 
        'Quần jean nam': 'men-jeans',
        'Quần tây nam': 'men-trousers',
        'Áo thun nữ': 'women-tshirt',
        'Áo sơ mi nữ': 'women-blouse',
        'Váy đầm': 'women-dress',
        'Quần jean nữ': 'women-jeans',
        'Áo khoác unisex': 'jacket',
        'Đồ thể thao': 'sportswear'
    };
    
    const keyword = imageKeywords[categoryName] || 'fashion';
    return `https://source.unsplash.com/400x400/?${keyword},clothing,fashion`;
};

const randomCategoryList = (n) => {
    if (n <= 0) return [];
    const categoryList = [];
    
    // Lấy ngẫu nhiên từ danh sách có sẵn
    const shuffled = clothingCategories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffled.slice(0, n);
    
    selectedCategories.forEach((categoryInfo) => {
        const category = {
            id: faker.string.uuid(),
            name: categoryInfo.name,
            gender: categoryInfo.gender,
            description: `Danh mục ${categoryInfo.name.toLowerCase()} chất lượng cao`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        categoryList.push(category);
    });
    return categoryList;
};

const randomproductList = (categoryList, numberOfproducts) => {
    if (numberOfproducts <= 0) return [];
    const productList = [];
    
    for (const category of categoryList) {
        Array.from(new Array(numberOfproducts)).forEach(() => {
            const product = {
                categoryId: category.id,
                id: faker.string.uuid(),
                name: generateProductName(category.name),
                brand: faker.helpers.arrayElement(brands),
                color: faker.helpers.arrayElement(clothingColors),
                size: faker.helpers.arrayElement(sizes[category.gender] || sizes.unisex),
                price: Number.parseFloat(faker.commerce.price({ min: 150000, max: 2000000 })),
                salePrice: Number.parseFloat(faker.commerce.price({ min: 100000, max: 1500000 })),
                material: faker.helpers.arrayElement(materials),
                gender: category.gender,
                description: `${generateProductName(category.name)} chất lượng cao, phù hợp cho ${category.gender === 'nam' ? 'nam giới' : category.gender === 'nữ' ? 'nữ giới' : 'mọi người'}`,
                inStock: faker.datatype.boolean(0.8), // 80% có hàng
                stockQuantity: faker.number.int({ min: 0, max: 100 }),
                rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
                reviewCount: faker.number.int({ min: 5, max: 150 }),
                tags: [category.gender, category.name.split(' ')[0].toLowerCase()],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                thumbnailUrl: getImageUrl(category.name),
                images: [
                    getImageUrl(category.name),
                    `https://source.unsplash.com/400x400/?${category.gender}-fashion,style`,
                    `https://source.unsplash.com/400x400/?clothing,${category.gender}-wear`
                ]
            };
            productList.push(product);
        });
    }
    return productList;
};

// IIFE
(() => {
    // RANDOM DATA
    const categoryList = randomCategoryList(8); // Tạo 8 danh mục
    const productList = randomproductList(categoryList, 6); // Mỗi danh mục 6 sản phẩm

    // prepare db obj
    const db = { 
        categories: categoryList,
        products: productList,
        profile: {
            name: "Po",
        },
    };
    
    // write db obj to db json với format đẹp
    fs.writeFile('db.json', JSON.stringify(db, null, 2), () => {
        console.log('Generate clothing data successfully!');
        console.log(`Created ${categoryList.length} categories and ${productList.length} products`);
        
        // In thống kê theo giới tính
        const stats = productList.reduce((acc, product) => {
            const category = categoryList.find(cat => cat.id === product.categoryId);
            acc[category.gender] = (acc[category.gender] || 0) + 1;
            return acc;
        }, {});
        
        console.log('Statistics by gender:', stats);
    });
})();