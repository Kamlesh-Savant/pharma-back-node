const pool = require('../db');

class ProductModel {
    async createProduct(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const {
                    product_name,
                    category_id,
                    category_name,
                    division_id,
                    division_name,
                    product_status,
                    pkg,
                    price,
                    contains,
                    notes
                } = data;

                if (product_name) {
                    // Convert string IDs to integers
                    const categoryId = parseInt(category_id, 10);
                    const divisionId = parseInt(division_id, 10);
                    
                    // Convert price to decimal if it's a string
                    const productPrice = parseFloat(price);
                    console.log(data)
                    // Validate price
                    if (isNaN(productPrice)) {
                        return { status: 400, response: { success: false, message: "Invalid price value" } };
                    }

                    const sqlInsertQuery = `
                    INSERT INTO tblproduct (product_name, category_id, category_name, division_id, division_name, product_status, pkg, price, contains, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    
                    const [result] = await pool.query(sqlInsertQuery, [
                        product_name,
                        categoryId,        // Use converted category_id
                        category_name,
                        divisionId,        // Use converted division_id
                        division_name,
                        product_status,
                        pkg,
                        productPrice,     // Use converted price
                        contains,
                        notes
                    ]);
                    const lastInsertedId = result.insertId;

                    const sqlSelectQuery = "SELECT * FROM tblproduct WHERE ID = ?";
                    const [newProduct] = await pool.query(sqlSelectQuery, [lastInsertedId]);

                    return {
                        status: 201,
                        response: {
                            success: true,
                            message: 'Product added successfully!',
                            product: newProduct[0],
                        },
                    };
                } else {
                    return { status: 400, response: { success: false, message: "Invalid input" } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to add this product' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }





    async updateProduct(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { 
                    product_id, 
                    product_name, 
                    category_id, 
                    category_name, 
                    division_id, 
                    division_name, 
                    product_status, 
                    pkg, 
                    price, 
                    contains, 
                    notes 
                } = data;
    
                // Validate required fields
                if (
                    product_id && 
                    product_name && 
                    category_id && 
                    category_name && 
                    division_id && 
                    division_name && 
                    product_status !== undefined && // Allowing 0 as valid status
                    pkg && 
                    price !== undefined && // Allowing 0 as valid price
                    contains
                ) {
                    const now = new Date();
                    const sqlQuery = `
                        UPDATE tblproduct
                        SET 
                            product_name = ?, 
                            category_id = ?, 
                            category_name = ?, 
                            division_id = ?, 
                            division_name = ?, 
                            product_status = ?, 
                            pkg = ?, 
                            price = ?, 
                            contains = ?, 
                            notes = ?, 
                            modified_date = ?
                        WHERE ID = ?
                    `;
                    const [result] = await pool.query(sqlQuery, [
                        product_name, 
                        category_id, 
                        category_name, 
                        division_id, 
                        division_name, 
                        product_status, 
                        pkg, 
                        parseFloat(price), // Ensure price is handled as a decimal
                        contains, 
                        notes || null, // Set to null if notes are not provided
                        now, 
                        parseInt(product_id) // Ensure product_id is handled as an integer
                    ]);
    
                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Product updated successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Product not found or update failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to update this product' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }
    

    async deleteProduct(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { product_id } = data;
                if (product_id) {
                    const sqlQuery = "DELETE FROM tblproduct WHERE ID = ?";
                    const [result] = await pool.query(sqlQuery, [product_id]);

                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Product deleted successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Product not found or deletion failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to delete this product' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getProductDetail() {
        try {
            const [products] = await pool.query("SELECT * FROM tblproduct");
            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', products } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getProductById(data) {
        try {
            const { product_id } = data;
            if (product_id) {
                const [product] = await pool.query("SELECT * FROM tblproduct WHERE ID = ?", [product_id]);

                if (product.length > 0) {
                    return { status: 200, response: { success: true, product: product[0] } };
                } else {
                    return { status: 404, response: { success: false, message: 'Product not found!' } };
                }
            } else {
                return { status: 400, response: { success: false, message: 'Invalid input' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async searchProduct(data) {
        try {
            const { search } = data;
            const [products] = await pool.query("SELECT * FROM tblproduct WHERE product_name LIKE ?", [`%${search}%`]);

            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', products } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }
}

module.exports = new ProductModel();
