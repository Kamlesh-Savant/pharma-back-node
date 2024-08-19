const pool = require('../db');

class DivisionModel {
    async createDivision(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { division_name } = data;
                if (division_name) {
                    const sqlInsertQuery = "INSERT INTO tbldivision (division_name) VALUES (?)";
                    const [result] = await pool.query(sqlInsertQuery, [division_name]);

                    const lastInsertedId = result.insertId;

                    const sqlSelectQuery = "SELECT * FROM tbldivision WHERE ID = ?";
                    const [newDivision] = await pool.query(sqlSelectQuery, [lastInsertedId]);

                    return {
                        status: 201,
                        response: {
                            success: true,
                            message: 'Division added successfully!',
                            division: newDivision[0],
                        },
                    };
                } else {
                    return { status: 400, response: { success: false, message: "Invalid input" } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to add this division' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async updateDivision(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { division_name, division_id } = data;
                if (division_name) {
                    const now = new Date();
                    const sqlQuery = "UPDATE tbldivision SET division_name = ?, modified_date = ? WHERE ID = ?";
                    const [result] = await pool.query(sqlQuery, [division_name, now, division_id]);

                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Division updated successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Division not found or update failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to update this division' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async deleteDivision(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;
            if (isAdmin === 'admin') {
                const { division_id } = data;
                if (division_id) {
                    const sqlQuery = "DELETE FROM tbldivision WHERE ID = ?";
                    const [result] = await pool.query(sqlQuery, [division_id]);

                    if (result.affectedRows > 0) {
                        return { status: 200, response: { success: true, message: 'Division deleted successfully!' } };
                    } else {
                        return { status: 404, response: { success: false, message: 'Division not found or deletion failed!' } };
                    }
                } else {
                    return { status: 400, response: { success: false, message: 'Invalid input' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to delete this division' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getDivisionDetail() {
        try {
            const [divisions] = await pool.query("SELECT * FROM tbldivision");
            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', divisions } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getDivisionById(data) {
        try {
            const { div_id } = data;
            if (div_id) {
                const [division] = await pool.query("SELECT * FROM tbldivision WHERE ID = ?", [div_id]);

                if (division.length > 0) {
                    return { status: 200, response: { success: true, division: division[0] } };
                } else {
                    return { status: 404, response: { success: false, message: 'Division not found!' } };
                }
            } else {
                return { status: 400, response: { success: false, message: 'Invalid input' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async searchDivision(data) {
        try {
            const { search } = data;
            const [divisions] = await pool.query("SELECT * FROM tbldivision WHERE division_name LIKE ?", [`%${search}%`]);

            return { status: 200, response: { success: true, message: 'Data retrieved successfully!', divisions } };
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }
}

module.exports = new DivisionModel();
