const mongoose = require("mongoose");
const Category = require("../models/category");
const Dish = require("../models/dish");

// 📌 Lấy danh sách categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy category theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Tạo category mới
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body; // Chỉ cần name

        // Kiểm tra name có hợp lệ không
        if (!name) {
            return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
        }

        // Tạo mới danh mục chỉ với tên
        const newCategory = new Category({
            name,
            created_at: new Date(),  // Chỉ sử dụng created_at và updated_at cho thời gian
            updated_at: new Date(),
        });

        await newCategory.save();
        res.status(201).json(newCategory); // Trả về danh mục vừa tạo
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 📌 Cập nhật category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;  // Chỉ cần lấy name từ body

        // Kiểm tra xem id có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Kiểm tra xem name có hợp lệ không
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Cập nhật danh mục chỉ với tên mới
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name }, // Chỉ cập nhật name
            { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(updatedCategory); // Trả về danh mục đã được cập nhật
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Xóa category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy danh sách món ăn theo category
exports.getDishesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // ✅ Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const dishes = await Dish.find({ category_id: categoryId });
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy tất cả món ăn
exports.getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDishById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid dish ID format" });
        }

        const dish = await Dish.findById(id);
        if (!dish) return res.status(404).json({ message: "Dish not found" });

        res.status(200).json(dish);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Tạo món ăn mới
exports.createDish = async (req, res) => {
    try {
        const { name, category_id, description, size, price, img, quantity } = req.body;

        // Kiểm tra category_id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Tạo mới món ăn
        const newDish = new Dish({
            name,
            category_id,
            description,
            optional: { size, price },
            img,
            quantity,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await newDish.save();
        res.status(201).json(newDish);  // Trả về món ăn vừa tạo
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 📌 Cập nhật món ăn
exports.updateDish = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, size, price, updated_by, img, quantity, category_id } = req.body; // Thêm category_id vào yêu cầu
  
      // Kiểm tra định dạng ID món ăn có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid dish ID format" });
      }
  
      // Cập nhật món ăn và truyền category_id vào
      const updatedDish = await Dish.findByIdAndUpdate(
        id,
        {
          name,
          description,
          optional: { size, price },
          updated_by,
          img,
          quantity,
          category_id, // Thêm category_id vào phần cập nhật
          updated_at: new Date(),
        },
        { new: true } // Đảm bảo trả về món ăn mới đã cập nhật
      );
  
      // Nếu không tìm thấy món ăn, trả về lỗi
      if (!updatedDish) {
        return res.status(404).json({ message: "Dish not found" });
      }
  
      // Trả về món ăn đã được cập nhật
      res.status(200).json(updatedDish);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// 📌 Xóa món ăn
exports.deleteDish = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid dish ID format" });
        }

        const dish = await Dish.findByIdAndDelete(id);
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }

        res.status(200).json({ message: "Dish deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
