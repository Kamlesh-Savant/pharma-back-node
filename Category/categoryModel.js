const pool = require('../db');

class CategoryModel {
    async createCategory(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { category } = data;
                if (category) {
                    const sqlInsertQuery = "INSERT INTO tblcategory (category_name) VALUES (?)";
                    const [result] = await pool.query(sqlInsertQuery, [category]);

                    const lastInsertedId = result.insertId;

                    const sqlSelectQuery = "SELECT * FROM tblcategory WHERE ID = ?";
                    const [newCategory] = await pool.query(sqlSelectQuery, [lastInsertedId]);

                    return {
                        status: 201,
                        response: {
                            success: true,
                            message: 'Category added successfully!',
                            category: newCategory[0],
                        },
                    };
                } else {
                    return { status: 400, response: { success: false, message: "Invalid input" } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to add this category' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async updateCategory(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { category, cat_id } = data;
                if (category) {
                    const now = new Date();
                    const sqlQuery = "UPDATE tblcategory SET category_name = ?, modified_date = ? WHERE ID = ?";
                    const [result] = await pool.query(sqlQuery, [category, now, cat_id]);

                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Category updated successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Category not found or update failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to update this category' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async deleteCategory(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { cat_id } = data;
                if (cat_id) {
                    const sqlQuery = "DELETE FROM tblcategory WHERE ID = ?";
                    const [result] = await pool.query(sqlQuery, [cat_id]);

                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Category deleted successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Category not found or deletion failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to delete this category' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getCategoryDetail() {
        try {
            const [categories] = await pool.query("SELECT * FROM tblcategory");
            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', categories } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getCategoryById(data) {
        try {
            const { cat_id } = data;
            if (cat_id) {
                const [category] = await pool.query("SELECT * FROM tblcategory WHERE ID = ?", [cat_id]);

                if (category.length > 0) {
                    return { status: 200, response: { success: true, category: category[0] } };
                } else {
                    return { status: 404, response: { success: false, message: 'Category not found!' } };
                }
            } else {
                return { status: 400, response: { success: false, message: 'Invalid input' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async searchCategory(data) {
        try {
            const { search } = data;
            const [categories] = await pool.query("SELECT * FROM tblcategory WHERE category_name LIKE ?", [`%${search}%`]);

            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', categories } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }
}

module.exports = new CategoryModel();
