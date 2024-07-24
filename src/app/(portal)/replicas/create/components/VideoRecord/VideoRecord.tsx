import React, { useCallback, useEffect, useRef } from 'react';

import { Mic, StopCircle, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SimpleTooltip } from '@/components/ui/tooltip';

import { formatTime } from '@/utils';

import { StaticOverlay } from '../StaticOverlay';
import { VoiceLevelIndicator } from '../VoiceLevelIndicator';
import { useVideoPreviewAndRecording } from '../../hooks/useVideoPreviewAndRecording.hook';
import { useVoiceLevel } from '../../hooks/useVoiceLevel.hook';

export const VideoRecord = ({
  minimumRecordTime,
  onSubmit,
}: {
  minimumRecordTime: number;
  onSubmit: (blob: Blob) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onStopRecording = useCallback(onSubmit, [onSubmit]);

  const {
    hasVideoAccess,
    hasAudioAccess,
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    selectVideoDevice,
    selectAudioDevice,
    stream,
    isRecording,
    countdownValue,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVideoPreviewAndRecording({ onStopRecording });

  const { voiceLevel } = useVoiceLevel({ stream });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasAccess = hasVideoAccess && hasAudioAccess;

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <div className="relative flex aspect-video size-full max-w-[35.25rem] items-center justify-center overflow-hidden rounded-md border bg-secondary">
        {countdownValue !== null && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[rgba(2,6,23,0.66)] text-2xl font-semibold text-white/90 backdrop-blur-[2px]">
            <span>Get ready!</span>
            <span>Your recording will start in</span>
            <span className="mt-4 text-7xl">{countdownValue}</span>
          </div>
        )}

        {hasAccess && !(countdownValue !== null) && <StaticOverlay />}
        {hasAccess ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="aspect-video object-contain"
          ></video>
        ) : (
          <div className="rounded-md border bg-background px-4 py-2.5 text-sm font-medium text-primary">
            Turn on Camera & Microphone
          </div>
        )}
        {isRecording && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs text-foreground">
            <div className="size-2 rounded-full bg-destructive" />
            {formatTime(recordingTime)}
          </div>
        )}
        {hasAccess && !isRecording && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-white/25 p-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Preview
          </div>
        )}
        {hasAccess && (
          <div className="absolute inset-x-4 bottom-3.5 flex items-center justify-between gap-2">
            <VoiceLevelIndicator voiceLevel={voiceLevel} />
            {!isRecording && (
              <div className="flex items-center justify-center gap-2">
                <Select
                  value={selectedVideoDevice?.deviceId}
                  onValueChange={e => {
                    const device = videoDevices.find(
                      device => device.deviceId === e,
                    );
                    selectVideoDevice(device!);
                  }}
                >
                  <SelectTrigger className="h-8 rounded-md border-none bg-white/25 p-2 text-white backdrop-blur-sm">
                    <span>
                      <Video size={16} className="mr-1.5" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {videoDevices.map(device => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedAudioDevice?.deviceId}
                  onValueChange={e => {
                    const device = audioDevices.find(
                      device => device.deviceId === e,
                    );
                    selectAudioDevice(device!);
                  }}
                >
                  <SelectTrigger className="h-8 rounded-md border-none bg-white/25 p-2 text-white backdrop-blur-sm">
                    <span>
                      <Mic size={16} className="mr-1.5" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {audioDevices.map(device => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-6">
        {!isRecording && countdownValue === null && (
          <Button onClick={startRecording}>Start Recording</Button>
        )}
        {isRecording && (
          <div className="flex gap-4">
            <Button onClick={cancelRecording}>Cancel Recording</Button>
            <SimpleTooltip
              disabled={recordingTime > minimumRecordTime}
              tooltipContent={`Video must be at least ${minimumRecordTime} seconds long to submit`}
            >
              <div>
                <Button
                  onClick={stopRecording}
                  disabled={recordingTime < minimumRecordTime}
                >
                  <StopCircle /> Stop Recording
                </Button>
              </div>
            </SimpleTooltip>
          </div>
        )}
      </div>
    </div>
  );
};
