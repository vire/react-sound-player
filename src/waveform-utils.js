// see http://stackoverflow.com/questions/22073716/create-a-waveform-of-the-full-track-with-web-audio-api
export const downsample = (buffer, targetCount) => {
  const BUCKET_SIZE = 6;
  const channel = buffer.getChannelData(0); // left 0, right 1
  const resampledBuffer = new Float64Array(targetCount * BUCKET_SIZE);

  let minValue = 1e3;
  let maxValue = -1e3;
  let iter = 0;
  let itar = 0;

  for (iter = 0; iter < channel.length; iter++) {
    const currentValue = channel[iter];
    const bucketIndex = (0 | (targetCount * iter / channel.length)) * BUCKET_SIZE;

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

  for (iter = 0, itar = 0; iter < targetCount; iter++, itar += 6) {
    if (resampledBuffer[itar + 1] !== 0) {
      resampledBuffer[itar] /= resampledBuffer[itar + 1];
    }

    if (resampledBuffer[itar + 4] !== 0) {
      resampledBuffer[itar + 3] /= resampledBuffer[itar + 4];
    }
  }

  for (iter = 0; iter < channel.length; iter++) {
    const currentValue = channel[iter];
    const bucketIndex = (0 | (targetCount * iter / channel.length)) * BUCKET_SIZE;

    if (currentValue > 0) {
      resampledBuffer[bucketIndex + 2] += Math.abs(resampledBuffer[bucketIndex] - currentValue);
    } else if (currentValue < 0) {
      resampledBuffer[bucketIndex + 5] += Math.abs(resampledBuffer[bucketIndex + 3] - currentValue);
    }
  }

  for (iter = 0, itar = 0; iter < targetCount; iter++, itar += 6) {
    if (resampledBuffer[itar + 1]) {
      resampledBuffer[itar + 2] /= resampledBuffer[itar + 1];
    }

    if (resampledBuffer[itar + 4]) {
      resampledBuffer[itar + 5] /= resampledBuffer[itar + 4];
    }
  }

  return resampledBuffer;
};
