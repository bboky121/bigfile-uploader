const fs = require('fs');
const path = require('path');
const FileUtils = require('../utils/fileUtils');
const logger = require('../middleware/logger');

class FileService {
  constructor() {
    this.UPLOAD_DIR = process.env.UPLOAD_DIR;
    this.CHUNK_DIR = process.env.CHUNK_DIR;
    [this.UPLOAD_DIR, this.CHUNK_DIR].forEach(dir => FileUtils.makeDir(dir));
  }

  async mergeChunks(originalFileName, totalChunks) {
    const timestamp = Date.now().toString();
    const sha256FileName = FileUtils.getSha256(`${originalFileName}-${timestamp}`);
    const hashedPath = FileUtils.getHashedPath(sha256FileName);
    const mergedFilePath = path.join(this.UPLOAD_DIR, hashedPath);

    FileUtils.makeDir(mergedFilePath);

    const mergedFileStream = fs.createWriteStream(
      path.join(mergedFilePath, sha256FileName)
    );

    try {
      await this._processChunks(originalFileName, totalChunks, mergedFileStream);
      await FileUtils.deleteChunks(this.CHUNK_DIR, originalFileName);

      return {
        success: true,
        file_url: `/uploads/${hashedPath}/${sha256FileName}`
      };
    } catch (error) {
      throw new Error(`파일 병합 실패: ${error.message}`);
    }
  }

  async _processChunks(originalFileName, totalChunks, writeStream) {
    return new Promise((resolve, reject) => {
      let currentChunk = 1;

      const processNextChunk = async () => {
        if (currentChunk > totalChunks) {
          writeStream.end();
          return resolve();
        }

        const chunkPath = path.join(
          this.CHUNK_DIR,
          `${originalFileName}.part${currentChunk}`
        );

        try {
          logger.info(`${chunkPath} 파일 병합 중... ${currentChunk} / ${totalChunks}`);
          if (fs.existsSync(chunkPath)) {
            const chunkBuffer = await fs.promises.readFile(chunkPath);
            writeStream.write(chunkBuffer);

            logger.info(`${originalFileName} 파일 병합 중... ${currentChunk} / ${totalChunks}`);

            currentChunk++;
            processNextChunk();
          } else {
            logger.error(`${originalFileName} 파일 병합 중... ${currentChunk} / ${totalChunks} 청크 없음`);
            throw new Error(`${originalFileName} 파일 병합 중... ${currentChunk} / ${totalChunks} 청크 없음`);
          }
        } catch (error) {
          reject(error);
        }
      };
      processNextChunk();
    });
  }

  async getUploadStatus(fileName) {
    const count = await FileUtils.getChunkCount(fileName);
    return {
      count
    };
  }
}

module.exports = FileService; 