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

// Ảnh curated: dùng photo-id cố định của Unsplash (ổn định, không qua proxy)
// Curated Pexels URLs (ổn định, trả về 200 khi mở trực tiếp)
const PEXELS_CLOTHING_URLS = {
    'Áo thun': [
        'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/6311657/pexels-photo-6311657.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'Áo sơ mi': [
        'https://images.pexels.com/photos/19068124/pexels-photo-19068124.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/7679724/pexels-photo-7679724.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'Quần jean': [
        'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/4046309/pexels-photo-4046309.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'Quần tây': [
        'https://images.pexels.com/photos/3755701/pexels-photo-3755701.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'Váy': [
        'https://images.pexels.com/photos/7940642/pexels-photo-7940642.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/7940644/pexels-photo-7940644.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'Áo khoác': [
        'https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/7679681/pexels-photo-7679681.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ],
    'thể thao': [
        'https://images.pexels.com/photos/4761794/pexels-photo-4761794.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
        'https://images.pexels.com/photos/4662348/pexels-photo-4662348.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ]
};

function getStableClothingUrl(categoryName) {
    const key = Object.keys(PEXELS_CLOTHING_URLS).find(k => categoryName.includes(k)) || 'Áo thun';
    return faker.helpers.arrayElement(PEXELS_CLOTHING_URLS[key]);
}

function picsumSeed(seed) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;
}

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
                
                // Ảnh ổn định: dùng curated Unsplash + fallback picsum seed
                thumbnailUrl: getStableClothingUrl(category.name) || picsumSeed(productId + '-m'),
                images: [
                    getStableClothingUrl(category.name) || picsumSeed(productId + '-1'),
                    getStableClothingUrl(category.name) || picsumSeed(productId + '-2'),
                    getStableClothingUrl(category.name) || picsumSeed(productId + '-3')
                ]
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