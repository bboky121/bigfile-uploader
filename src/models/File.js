const sqlite3 = require('sqlite3').verbose();

class File {
    static db = new sqlite3.Database("db/upload.sqlite");

    static init() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS files (
                id INTEGER PRIMARY KEY,
                original_name TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                upload_date DATETIME DEFAULT (datetime('now'))
            )
        `);
    }

    static async create(fileData) {
        return new Promise((resolve, reject) => {
            const { originalName, fileName, filePath, fileSize } = fileData;
            this.db.run(
                `INSERT INTO files (original_name, file_name, file_path, file_size, upload_date)
                 VALUES (?, ?, ?, ?, datetime('now'))`,
                [originalName, fileName, filePath, fileSize],
                function (err) {
                    if (err) reject(err);
                    resolve({
                        id: this.lastID,
                        original_name: originalName,
                        file_name: fileName,
                        file_path: filePath,
                        file_size: fileSize,
                        upload_date: new Date().toLocaleString()
                    });
                }
            );
        });
    }

    static async getFileById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    static async getList(page = 1, limit = 10, search = '') {
        const offset = (page - 1) * limit;
        let query = `SELECT 
            id, 
            original_name, 
            file_name, 
            file_path, 
            file_size, 
            datetime(upload_date, 'localtime') as upload_date 
            FROM files`;

        if (search) {
            query += ` WHERE original_name LIKE ?`;
        }

        query += ` ORDER BY upload_date DESC LIMIT ? OFFSET ?`;

        const params = search ? [`%${search}%`, limit, offset] : [limit, offset];

        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static async count(search) {
        let query = `SELECT COUNT(*) as count FROM files`;
        let params = [];

        if (search) {
            query += ` WHERE original_name LIKE ?`;
            params = [`%${search}%`];
        }

        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) reject(err);
                resolve(row.count);
            });
        });
    }

    static async deleteFile(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM files WHERE id = ?`, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = File; 