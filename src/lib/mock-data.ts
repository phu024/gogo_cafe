import type { MenuCategory, MenuItem, Topping, Order, User, Role } from "../types/index";


export const roles: Role[] = [
    {
        id: 1,
        name: "Customer",
    },
    {
        id: 2,
        name: "Barista",
    },
    {
        id: 3,
        name: "Manager",
    }
];

export const users: User[] = [
    // 3 customers, 1 barista, 1 manager
    {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        phone_number: "0123456789",
        role_id: roles[0],
        is_active: true
    },
    {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        phone_number: "0987654321",
        role_id: roles[0],
        is_active: true
    },
    {
        id: 3,
        first_name: "Alice",
        last_name: "Johnson",
        phone_number: "1234567890",
        role_id: roles[0],
        is_active: true
    },
    {
        id: 4,
        first_name: "Bob",
        last_name: "Brown",
        phone_number: "9876543210",
        role_id: roles[1],
        is_active: true
    },
    {
        id: 5,
        first_name: "Charlie",
        last_name: "Davis",
        phone_number: "5555555555",
        role_id: roles[2],
        is_active: true
    }
];




export const menuCategories: MenuCategory[] = [
    {
        id: 1,
        name: "Coffee"
    },
    {
        id: 2,
        name: "Tea"
    },
    {
        id: 3,
        name: "Smoothie"
    }
]

export const menuItems: MenuItem[] = [
    // Coffee
    {
        id: 1,
        name: "Espresso",
        description: "Rich and bold espresso shot",
        base_price: 50,
        category_id: 1,
        image_url: "/images/espresso.png",
        is_available: true
    },
    {
        id: 2,
        name: "Latte",
        description: "Smooth latte with steamed milk",
        base_price: 70,
        category_id: 1,
        image_url: "/images/latte.png",
        is_available: true
    },
    {
        id: 3,
        name: "Cappuccino",
        description: "Classic cappuccino with frothy milk",
        base_price: 75,
        category_id: 1,
        image_url: "/images/cappuccino.png",
        is_available: true
    },
    {
        id: 4,
        name: "Americano",
        description: "Espresso with hot water",
        base_price: 60,
        category_id: 1,
        image_url: "/images/americano.png",
        is_available: true
    },
    {
        id: 5,
        name: "Mocha",
        description: "Chocolatey mocha with espresso",
        base_price: 80,
        category_id: 1,
        image_url: "/images/mocha.png",
        is_available: true
    },

    // Tea
    {
        id: 6,
        name: "Green Tea",
        description: "Refreshing green tea",
        base_price: 40,
        category_id: 2,
        image_url: "/images/green-tea.png",
        is_available: true
    },
    {
        id: 7,
        name: "Black Tea",
        description: "Strong black tea",
        base_price: 45,
        category_id: 2,
        image_url: "/images/black-tea.png",
        is_available: true
    },
    {
        id: 8,
        name: "Chai Latte",
        description: "Spiced chai latte with milk",
        base_price: 65,
        category_id: 2,
        image_url: "/images/chai-latte.png",
        is_available: true
    },
    {
        id: 9,
        name: "Thai Tea",
        description: "Sweet and creamy Thai iced tea",
        base_price: 55,
        category_id: 2,
        image_url: "/images/thai-tea.png",
        is_available: true
    },

    // Smoothie
    {
        id: 10,
        name: "Mango Smoothie",
        description: "Creamy mango smoothie",
        base_price: 90,
        category_id: 3,
        image_url: "/images/mango-smoothie.png",
        is_available: true
    },
    {
        id: 11,
        name: "Berry Blast Smoothie",
        description: "Mixed berry smoothie",
        base_price: 95,
        category_id: 3,
        image_url: "/images/berry-smoothie.png",
        is_available: true
    },
    {
        id: 12,
        name: "Banana Smoothie",
        description: "Banana and yogurt smoothie",
        base_price: 85,
        category_id: 3,
        image_url: "/images/banana-smoothie.png",
        is_available: true
    },
    {
        id: 13,
        name: "Pineapple Smoothie",
        description: "Tropical pineapple smoothie",
        base_price: 90,
        category_id: 3,
        image_url: "/images/pineapple-smoothie.png",
        is_available: true
    }
]

export const toppings: Topping[] = [
    {
        id: 1,
        name: "Extra Shot",
        price: 20,
        is_available: true
    },
    {
        id: 2,
        name: "Soy Milk",
        price: 15,
        is_available: true
    },
    {
        id: 3,
        name: "Almond Milk",
        price: 20,
        is_available: true
    },
    {
        id: 4,
        name: "Whipped Cream",
        price: 10,
        is_available: true
    },
    {
        id: 5,
        name: "Chocolate Syrup",
        price: 10,
        is_available: true
    },
    {
        id: 6,
        name: "Caramel Syrup",
        price: 10,
        is_available: true
    }
];

const now = new Date();

export const sampleOrders: Order[] = [
    {
        //  2 COMPLETED order
        id: "GOGO-240115-001",
        User: users[0],
        total_amount: 150,
        order_status: "COMPLETED",
        payment_method: "CREDIT_CARD",
        payment_status: "COMPLETED",    
        order_time: new Date("2024-01-15T10:00:00Z"),
        completed_time: new Date("2024-01-15T10:05:00Z"),
        notes: "ขอเข้ม ๆ",
        items: [
            {
                id: 1,
                menu_item: menuItems[0], // Espresso
                toppings: [toppings[0]], // Extra Shot
                quantity: 2,
                total_price: 100
            },
            {
                id: 2,
                menu_item: menuItems[1], // Latte
                toppings: [],
                quantity: 1,
                total_price: 70
            }
        ]
    },
    {
        id: "GOGO-240115-002",
        User: users[0],
        total_amount: 180,
        order_status: "COMPLETED",
        payment_method: "CASH",
        payment_status: "COMPLETED",    
        order_time: new Date("2024-01-15T11:00:00Z"),
        completed_time: new Date("2024-01-15T11:20:00Z"),
        notes: "ไม่ใส่ฟองนม",
        items: [
            {
                id: 3,
                menu_item: menuItems[2], // Cappuccino
                toppings: [toppings[1],toppings[2]], // Soy Milk, Almond Milk
                quantity: 1,
                total_price: 75
            },
            {
                id: 4,
                menu_item: menuItems[3], // Americano
                toppings: [],
                quantity: 2,
                total_price: 120
            }

        ]
    },

    // READY
    {
        id: "GOGO-240115-003",
        User: users[1],
        total_amount: 200,
        order_status: "READY",
        payment_method: "ONLINE_BANKING",
        payment_status: "PENDING",    
        order_time: new Date("2024-01-15T12:00:00Z"),
        notes: "หวานน้อย 50%",
        items: [
            {
                id: 5,
                menu_item: menuItems[4], // Mocha
                toppings: [toppings[3]], // Whipped Cream
                quantity: 1,
                total_price: 80
            },
            {
                id: 6,
                menu_item: menuItems[5], // Green Tea
                toppings: [],
                quantity: 2,
                total_price: 80
            }
        ]
    },

    // 2 IN_PROGRESS
    {
        id: "GOGO-240115-004",
        User: users[2],
        total_amount: 250,
        order_status: "IN_PROGRESS",
        payment_method: "QR_CODE",
        payment_status: "PENDING",    
        order_time: new Date("2024-01-15T13:00:00Z"),
        items: [
            {
                id: 7,
                menu_item: menuItems[6], // Black Tea
                toppings: [toppings[4]], // Chocolate Syrup
                quantity: 1,
                total_price: 45
            },
            {
                id: 8,
                menu_item: menuItems[7], // Chai Latte
                toppings: [],
                quantity: 1,
                total_price: 65
            },
            {
                id: 9,
                menu_item: menuItems[8], // Thai Tea
                toppings: [toppings[5]], // Caramel Syrup
                quantity: 1,
                total_price: 55
            }
        ]
    },
    {
        id: "GOGO-240115-005",
        User: users[3],
        total_amount: 300,
        order_status: "IN_PROGRESS",
        payment_method: "DEBIT_CARD",
        payment_status: "PENDING",    
        order_time: new Date("2024-01-15T14:00:00Z"),
        items: [
            {
                id: 10,
                menu_item: menuItems[9], // Mango Smoothie
                toppings: [],
                quantity: 1,
                total_price: 90
            },
            {
                id: 11,
                menu_item: menuItems[10], // Berry Blast Smoothie
                toppings: [toppings[0]], // Extra Shot
                quantity: 1,
                total_price: 95
            },
            {
                id: 12,
                menu_item: menuItems[11], // Banana Smoothie
                toppings: [],
                quantity: 1,
                total_price: 85
            },
            {
                id: 13,
                menu_item: menuItems[12], // Pineapple Smoothie
                toppings: [],
                quantity: 1,
                total_price: 90
            }
        ]
    },

    // PAID
    {
        id: "GOGO-240115-006",
        User: users[4],
        total_amount: 400,
        order_status: "PENDING",
        payment_method: "CREDIT_CARD",
        payment_status: "COMPLETED",    
        order_time: new Date("2024-01-15T15:00:00Z"),
        notes: "แยกน้ำแข็ง",
        items: [
            {
                id: 14,
                menu_item: menuItems[0], // Espresso
                toppings: [toppings[1]], // Soy Milk
                quantity: 2,
                total_price: 100
            },
            {
                id: 15,
                menu_item: menuItems[1], // Latte
                toppings: [toppings[2]], // Almond Milk
                quantity: 1,
                total_price: 70
            },
            {
                id: 16,
                menu_item: menuItems[2], // Cappuccino
                toppings: [toppings[3]], // Whipped Cream
                quantity: 1,
                total_price: 75
            },
            {
                id: 17,
                menu_item: menuItems[3], // Americano
                toppings: [],
                quantity: 2,
                total_price: 120
            }
        ]
    },
    // NEW: Additional active orders with notes
    {
        id: "GOGO-240115-007",
        User: users[2],
        total_amount: 120,
        order_status: "PENDING",
        payment_method: "CASH",
        payment_status: "PENDING",
        order_time: new Date("2025-01-15T15:10:00Z"),
        notes: "ไม่ใส่น้ำตาล",
        items: [
            {
                id: 18,
                menu_item: menuItems[0],
                toppings: [],
                quantity: 1,
                total_price: 50
            },
            {
                id: 19,
                menu_item: menuItems[6],
                toppings: [],
                quantity: 1,
                total_price: 45
            }
        ]
    },
    {
        id: "GOGO-240115-008",
        User: users[3],
        total_amount: 90,
        order_status: "READY",
        payment_method: "QR_CODE",
        payment_status: "COMPLETED",
        order_time: new Date("2024-01-15T15:20:00Z"),
        notes: "เพิ่มไซรัปวนิลา",
        items: [
            {
                id: 20,
                menu_item: menuItems[3],
                toppings: [toppings[5]],
                quantity: 1,
                total_price: 60
            }
        ]
    },
    // Hidden from normal barista tabs (UN_PAYMENT & CANCELED)
    {
        id: "GOGO-240115-009",
        User: users[1],
        total_amount: 75,
        order_status: "UN_PAYMENT",
        payment_method: "CASH",
        payment_status: "PENDING",
        order_time: new Date("2024-01-15T15:30:00Z"),
        notes: "ลูกค้าจะจ่ายหน้าร้าน",
        items: [
            {
                id: 21,
                menu_item: menuItems[2],
                toppings: [],
                quantity: 1,
                total_price: 75
            }
        ]
    },
    {
        id: "GOGO-240115-010",
        User: users[0],
        total_amount: 55,
        order_status: "CANCELED",
        payment_method: "CASH",
        payment_status: "FAILED",
        order_time: new Date("2024-01-15T15:40:00Z"),
        notes: "ลูกค้ายกเลิกเพราะรอนาน",
        items: [
            {
                id: 22,
                menu_item: menuItems[8],
                toppings: [],
                quantity: 1,
                total_price: 55
            }
        ]
    },

    // BADGE DEMO ORDERS

    {
        id: "GOGO-240115-011",
        User: users[2],
        total_amount: 60,
        order_status: "PENDING",
        payment_method: "CASH",
        payment_status: "PENDING",
        order_time: new Date(now.getTime() - 16 * 60 * 1000), // 16 minutes ago
        items: [
            { id: 102, menu_item: menuItems[2], toppings: [], quantity: 1, total_price: 60 }
        ]
    },
    {
        id: "GOGO-240115-012",
        User: users[1],
        total_amount: 45,
        order_status: "PENDING",
        payment_method: "CASH",
        payment_status: "PENDING",
        order_time: new Date(now.getTime() - 4 * 60 * 1000), // 4 minutes ago
        items: [
            { id: 101, menu_item: menuItems[1], toppings: [], quantity: 1, total_price: 45 }
        ]
    },
    {
        id: "GOGO-240115-013",
        User: users[0],
        total_amount: 50,
        order_status: "PENDING",
        payment_method: "CASH",
        payment_status: "PENDING",
        order_time: new Date(now.getTime() - 30 * 1000), // 30 seconds ago
        items: [
            { id: 100, menu_item: menuItems[0], toppings: [], quantity: 1, total_price: 50 }
        ]
    },
];


// Helper function
export function getMenuItemById(id: number): MenuItem | undefined {
    return menuItems.find(item => item.id === id);
}

export function getToppingById(id: number): Topping | undefined {
    return toppings.find(topping => topping.id === id);
}

export function getOrdersByStatus(status: "COMPLETED" | "IN_PROGRESS" | "READY" | "PAID"): Order[] {
    return sampleOrders.filter(order => order.order_status === status);
}
