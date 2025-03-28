const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 상수 정의
const CONSTANTS = {
    HASH_LENGTH: 2
};

class fileUtils {
  static makeDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  static getSha256(fileName) {
    return crypto.createHash('sha256')
      .update(fileName)
      .digest('hex');
  }

  static getHashedPath(sha256Hash) {
    const dirs = [];
    for (let i = 0; i < CONSTANTS.HASH_LENGTH; i++) {
      dirs.push(sha256Hash.substring(i * 2, (i + 1) * 2));
    }
    return dirs.join('/');
  }

  static async deleteChunks(chunkDir, filePattern) {
    const files = fs.readdirSync(chunkDir)
      .filter(file => file.startsWith(filePattern));

    return Promise.all(
      files.map(fileName => {
        const filePath = path.join(chunkDir, fileName);
        return fs.existsSync(filePath)
          ? fs.promises.unlink(filePath)
          : Promise.resolve();
      })
    );
  }

  static async getChunkCount(fileName) {
    const chunkDir = process.env.CHUNK_DIR;
    const files = fs.readdirSync(chunkDir)
      .filter(file => file.startsWith(fileName));

    return files.length;
  }
}

module.exports = fileUtils;