const fs = require('fs');
const path = require('path');
const fileUtils = require('../utils/fileUtils');
const logger = require('../middleware/logger');
const File = require('../models/File');

class FileService {
  constructor() {
    this.UPLOAD_DIR = process.env.UPLOAD_DIR;
    this.CHUNK_DIR = process.env.CHUNK_DIR;
    [this.UPLOAD_DIR, this.CHUNK_DIR].forEach(dir => fileUtils.makeDir(dir));
    File.init(); // SQLite DB 초기화
  }

  fileSizeFormat(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  async mergeChunks(originalFileName, totalChunks) {
    const timestamp = Date.now().toString();
    const sha256FileName = fileUtils.getSha256(`${originalFileName}-${timestamp}`);
    const hashedPath = fileUtils.getHashedPath(sha256FileName);
    const mergedFilePath = path.join(this.UPLOAD_DIR, hashedPath);

    fileUtils.makeDir(mergedFilePath);

    const mergedFileStream = fs.createWriteStream(
      path.join(mergedFilePath, sha256FileName)
    );

    try {
      await this._processChunks(originalFileName, totalChunks, mergedFileStream);
      await fileUtils.deleteChunks(this.CHUNK_DIR, originalFileName);

      // 파일 병합 완료 후 DB에 메타데이터 저장
      const finalFilePath = path.join(mergedFilePath, sha256FileName);
      const stats = await fs.promises.stat(finalFilePath);

      const fileMetadata = await File.create({
        originalName: originalFileName,
        fileName: sha256FileName,
        filePath: hashedPath,
        fileSize: stats.size
      });

      return {
        success: true,
        file_url: `/uploads/${hashedPath}/${sha256FileName}`,
        fileId: fileMetadata.id
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
    const count = await fileUtils.getChunkCount(fileName);
    return {
      count
    };
  }

  async getFiles(page, limit, search) {
    const files = await File.getList(page, limit, search);
    const total = await File.count(search);
    return { files, total };
  }

  async deleteFile(fileId) {
    const file = await File.getFileById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    await File.deleteFile(fileId);
  }

  async getFileById(fileId) {
    const file = await File.getFileById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.UPLOAD_DIR, file.file_path, file.file_name);
    return {
      file,
      filePath
    };
  }
}

module.exports = FileService; 