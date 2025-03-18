async function uploadFile(file, progressBar) {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  const status = await fetch(`/api/upload/status/${file.name}`);
  const statusRes = await status.json();
  let currentChunk = statusRes.count;

  while (currentChunk < totalChunks) {
    const nextChunk = currentChunk + 1;
    const start = (currentChunk - 1) * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk, `${file.name}.part${nextChunk}`);
    formData.append('originalname', file.name);
    formData.append('chunkNumber', nextChunk);

    try {
      const uploadChunk = await fetch(`/api/upload/chunk`, {
        method: 'POST',
        body: formData,
      });
      const chunkRes = await uploadChunk.json();
      // upload progressbar 업데이트
      progressBar.value = chunkRes.chunkNumber;
      progressBar.max = totalChunks;

      currentChunk = chunkRes.chunkNumber;
    } catch (error) {
      console.error('업로드 실패:', error);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 재시도 전 대기
      continue;
    }
  }

  if (currentChunk === totalChunks) {
    try {
      const completeResult = await requestMergeChunks(file.name, totalChunks);
      console.log('completeResult', completeResult);
    } catch (error) {
      console.error('청크 병합 요청 중 오류 발생:', error);
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }
}

async function requestMergeChunks(fileName, totalChunks) {
  try {
    const completeResult = await fetch('/api/upload/complete', {
      method: 'POST',
      body: JSON.stringify({ fileName, totalChunks }),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await completeResult.json();
    console.log('completeResult', result);
    return result;
  } catch (error) {
    console.error('청크 병합 요청 중 오류 발생:', error);
    throw error;
  }
}