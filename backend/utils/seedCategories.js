const Category = require("../models/Category");

const predefinedCategories = [
    // Expense Categories
    { name: "Food & Dining", type: "expense", icon: "🍔", color: "#EF4444" },
    { name: "Transportation", type: "expense", icon: "🚗", color: "#F59E0B" },
    { name: "Shopping", type: "expense", icon: "🛍️", color: "#EC4899" },
    { name: "Entertainment", type: "expense", icon: "🎬", color: "#8B5CF6" },
    { name: "Bills & Utilities", type: "expense", icon: "💡", color: "#3B82F6" },
    { name: "Healthcare", type: "expense", icon: "🏥", color: "#10B981" },
    { name: "Travel", type: "expense", icon: "✈️", color: "#14B8A6" },
    { name: "Education", type: "expense", icon: "📚", color: "#6366F1" },
    { name: "Personal Care", type: "expense", icon: "💅", color: "#F97316" },
    { name: "Other", type: "expense", icon: "📁", color: "#6B7280" },
    
    // Income Categories
    { name: "Salary", type: "income", icon: "💰", color: "#10B981" },
    { name: "Freelance", type: "income", icon: "💼", color: "#3B82F6" },
    { name: "Investment", type: "income", icon: "📈", color: "#8B5CF6" },
    { name: "Gift", type: "income", icon: "🎁", color: "#EC4899" },
    { name: "Refund", type: "income", icon: "↩️", color: "#14B8A6" },
    { name: "Other Income", type: "income", icon: "💵", color: "#6B7280" },
];

const seedCategories = async () => {
    try {
        const existingCount = await Category.countDocuments({ isPredefined: true });
        
        if (existingCount === 0) {
            const categories = predefinedCategories.map(cat => ({
                ...cat,
                isPredefined: true,
                userId: null,
            }));
            
            await Category.insertMany(categories);
            console.log("✅ Predefined categories seeded successfully");
        } else {
            console.log("✅ Predefined categories already exist");
        }
    } catch (error) {
        console.error("❌ Error seeding categories:", error.message);
    }
};

module.exports = seedCategories;
