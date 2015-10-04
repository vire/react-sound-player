// see http://stackoverflow.com/questions/22073716/create-a-waveform-of-the-full-track-with-web-audio-api
export const downsample = (buffer, targetCount) => {
  console.log('downsample');
  const BUCKET_SIZE = 6;
  const channel = buffer.getChannelData(0); // left 0, right 1
  const resampledBuffer = new Float64Array(targetCount * BUCKET_SIZE)

  let minValue = 1e3;
  let maxValue = -1e3;
  let i = 0;
  let j = 0;

  for(i = 0; i < channel.length; i++) {
    const currentValue = channel[i];
    const bucketIndex = (0 | (targetCount * i / channel.length)) * BUCKET_SIZE;

    if (currentValue > 0) {
      resampledBuffer[bucketIndex] += currentValue;
      resampledBuffer[bucketIndex + 1] += 1;
    } else if (currentValue < 0 ) {
      resampledBuffer[bucketIndex + 3] += currentValue;
      resampledBuffer[bucketIndex + 4] += 1;
    }

    if (currentValue < minValue) {
      minValue = currentValue;
    }

    if (currentValue > maxValue) {
      maxValue = currentValue;
    }
  }

  for (i = 0, j = 0; i < targetCount; i++, j += 6) {
    if (resampledBuffer[j + 1] !== 0) {
      resampledBuffer[j] /= resampledBuffer[j + 1]
    }

    if (resampledBuffer[j + 4] !== 0) {
      resampledBuffer[j + 3] /= resampledBuffer[j + 4]
    }
  }

  for (i = 0; i < channel.length; i++) {
    const currentValue = channel[i];
    const bucketIndex = (0 | (targetCount * i / channel.length)) * BUCKET_SIZE;

    if (currentValue > 0) {
      resampledBuffer[bucketIndex + 2] += Math.abs(resampledBuffer[bucketIndex] - currentValue);
    } else if (currentValue < 0) {
      resampledBuffer[bucketIndex + 5] += Math.abs(resampledBuffer[bucketIndex + 3] - currentValue);
    }
  }

  for(i = 0, j = 0; i < targetCount; i++, j += 6) {
    if (resampledBuffer[j + 1]) {
      resampledBuffer[j + 2] /= resampledBuffer[j + 1];
    }

    if (resampledBuffer[j + 4]) {
      resampledBuffer[j + 5]  /= resampledBuffer[j + 4]
    }
  }

  return resampledBuffer;
}
