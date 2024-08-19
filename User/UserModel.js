// UserModel.js
const pool = require('../db');
const jwt = require('jsonwebtoken');
const config = require('../config');

class UserModel {
    async login(data) {
        try {
            const [rows] = await pool.query("SELECT * FROM tbluser WHERE username = ?", [data.username]);

            if (!rows.length) {
                return { status: 401, response: { message: 'Invalid Credentials' } };
            }

            const user = rows[0];

            if (user.pwd === data.pwd) {
                const token = jwt.sign(
                    { user_id: user.ID },
                    config.SECRET_KEY,
                    { expiresIn: '23h' }
                );

                return {
                    status: 201,
                    response: {
                        success: true,
                        token,
                        UserId: user.ID,
                        UserRole: user.user_role,
                        IsExpired: user.user_status,
                        message: 'Login Successfully !!'
                    }
                };
            } else {
                return { status: 400, response: { success: false, message: 'Incorrect username or password!' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: error.message } };
        }
    }

    async getUser(currentUser) {
        try {
            const isAdmin = currentUser.user_role;

            if (isAdmin === 'admin') {
                const [rows] = await pool.query("SELECT * FROM tbluser WHERE ID = 3");

                if (rows.length > 0) {
                    return { status: 200, response: { success: true, message: 'Data found!', user: rows[0] } };
                } else {
                    return { status: 404, response: { success: false, message: 'Data not found!' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to view this data' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: `An error occurred: ${error.message}` } };
        }
    }

    async updateUser(currentUser, data) {
        try {
            const isAdmin = currentUser.user_role;

            if (isAdmin === 'admin') {
                const { user_id, username, pwd } = data;
                const now = new Date();

                const sqlQuery = `
                    UPDATE tbluser
                    SET username = ?, pwd = ?, modified_date = ?
                    WHERE ID = ?
                `;
                const bindData = [username, pwd, now, user_id];

                const [result] = await pool.query(sqlQuery, bindData);

                if (result.affectedRows > 0) {
                    return { status: 200, response: { success: true, message: 'User updated successfully!' } };
                } else {
                    return { status: 404, response: { success: false, message: 'User not found or update failed!' } };
                }
            } else {
                return { status: 403, response: { success: false, message: 'You are not authorized to update this data' } };
            }
        } catch (error) {
            return { status: 500, response: { success: false, message: `An error occurred: ${error.message}` } };
        }
    }
}

module.exports = new UserModel();
