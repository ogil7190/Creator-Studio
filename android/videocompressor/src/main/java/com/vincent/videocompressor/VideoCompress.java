package com.vincent.videocompressor;

import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;

import java.io.File;

/**
 * Created by Vincent Woo
 * Date: 2017/8/16
 * Time: 15:15
 */

public class VideoCompress {
    private static final String TAG = VideoCompress.class.getSimpleName();

    public static VideoCompressTask compressVideoHigh(String srcPath, String destPath, CompressListener listener) {
        VideoCompressTask task = new VideoCompressTask(listener, VideoController.COMPRESS_QUALITY_HIGH);
        task.execute(srcPath, destPath);
        return task;
    }

    public static VideoCompressTask compressVideoMedium(String srcPath, String destPath, CompressListener listener) {
        VideoCompressTask task = new VideoCompressTask(listener, VideoController.COMPRESS_QUALITY_MEDIUM);
        task.execute(srcPath, destPath);
        return task;
    }

    public static VideoCompressTask compressVideoLow(String srcPath, String destPath, CompressListener listener) {
        VideoCompressTask task =  new VideoCompressTask(listener, VideoController.COMPRESS_QUALITY_LOW);
        task.execute(srcPath, destPath);
        return task;
    }

    public static VideoCompressTask compressVideoAuto(String srcPath, String destPath, Double start, Double end, CompressListener listener) {
        VideoCompressTask task =  new VideoCompressTask(listener, VideoController.COMPRESS_QUALITY_LOW, start, end);
        task.execute(srcPath, destPath);
        return task;
    }

    private static class VideoCompressTask extends AsyncTask<String, Float, Boolean> {
        private CompressListener mListener;
        private int mQuality;
        private double mStart = 0.0, mEnd  = 0.0;

        public VideoCompressTask(CompressListener listener, int quality) {
            mListener = listener;
            mQuality = quality;
        }

        public VideoCompressTask(CompressListener listener, int quality, double start, double end) {
            mListener = listener;
            mQuality = quality;
            mStart = start;
            mEnd = end;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            if (mListener != null) {
                mListener.onStart();
            }
        }

        @Override
        protected Boolean doInBackground(String... paths) {
            if(mEnd == 0.0) {
                return VideoController.getInstance().convertVideo(paths[0], paths[1], mQuality, new VideoController.CompressProgressListener() {
                    @Override
                    public void onProgress(float percent) {
                        publishProgress(percent);
                    }
                });
            } else {
                return VideoController.getInstance().convertVideo(paths[0], paths[1], mStart, mEnd, mQuality, new VideoController.CompressProgressListener() {
                    @Override
                    public void onProgress(float percent) {
                        publishProgress(percent);
                    }
                });
            }
        }

        @Override
        protected void onProgressUpdate(Float... percent) {
            super.onProgressUpdate(percent);
            if (mListener != null) {
                mListener.onProgress(percent[0]);
            }
        }

        @Override
        protected void onPostExecute(Boolean result) {
            super.onPostExecute(result);
            if (mListener != null) {
                if (result) {
                    mListener.onSuccess();
                } else {
                    mListener.onFail();
                }
            }
        }
    }

    public interface CompressListener {
        void onStart();
        void onSuccess();
        void onFail();
        void onProgress(float percent);
    }
}
