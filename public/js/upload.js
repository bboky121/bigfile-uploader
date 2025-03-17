async function uploadFile(file, progressBar) {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
    const start = (chunkNumber - 1) * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk, `${file.name}.part${chunkNumber}`);
    formData.append('originalname', file.name);
    formData.append('chunkNumber', chunkNumber);

    try {
      const uploadChunk = await fetch(`/api/upload/chunk`, {
        method: 'POST',
        body: formData,
      });
      const chunkRes = await uploadChunk.json();

      // upload progressbar 업데이트
      progressBar.value = chunkRes.chunkNumber;
      progressBar.max = totalChunks;

      if (chunkRes.chunkNumber === totalChunks) {
        const completeResult = await fetch('/api/upload/complete', {
          method: 'POST',
          body: JSON.stringify({ fileName: file.name, totalChunks: totalChunks }),
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('completeResult', await completeResult.json());
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      break;
    }
  }
}
