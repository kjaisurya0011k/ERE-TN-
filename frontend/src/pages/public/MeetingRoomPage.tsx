import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff,
  MessageSquare, Users, Shield, Send, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { meetingsApi } from '../../services/api';

export const MeetingRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isHost?: boolean }>>([
    {
      sender: 'Dr. S. Karthikeyan',
      text: 'Welcome everyone! We will be discussing AI systems and answering career roadmap questions.',
      time: '18:00',
      isHost: true
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [streamError, setStreamError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchRoom();
    initLocalMedia();

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopMediaTracks();
    };
  }, [roomId]);

  const fetchRoom = async () => {
    if (!roomId) return;
    try {
      const data = await meetingsApi.getRoomDetails(roomId);
      setRoomInfo(data);
    } catch {
      setRoomInfo({
        meetingId: roomId,
        title: 'AI & Agentic Systems in 2026: Live Student Masterclass',
        topic: 'Artificial Intelligence & Cloud',
        roomCode: roomId,
        mentorName: 'Dr. S. Karthikeyan',
        currentUserName: user?.fullName || 'Student Participant',
        currentUserRole: user?.role || 'STUDENT',
        isHost: user?.role === 'MENTOR'
      });
    }
  };

  const initLocalMedia = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err: any) {
      console.warn('Camera/Mic permission not granted or not available:', err);
      setStreamError('Media device preview simulated (Camera or Mic not detected / permission denied).');
      setIsCamOn(false);
      setIsMicOn(false);
    }
  };

  const stopMediaTracks = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !isMicOn));
    }
    setIsMicOn(!isMicOn);
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !isCamOn));
    }
    setIsCamOn(!isCamOn);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = screenStream;
          setIsScreenSharing(true);
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        }
      } catch (err) {
        console.warn('Screen sharing cancelled:', err);
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      setIsScreenSharing(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMessages((prev) => [
      ...prev,
      {
        sender: user?.fullName || 'You',
        text: inputText.trim(),
        time: timeString,
        isHost: user?.role === 'MENTOR'
      }
    ]);
    setInputText('');
  };

  const handleLeaveRoom = () => {
    stopMediaTracks();
    navigate('/meetings');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans">
      {/* Top Session Bar */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 truncate max-w-md">
              {roomInfo?.title || 'ERE-TN Live Career Session'}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-blue-400 font-semibold">{roomInfo?.mentorName || 'Lead Mentor'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatTimer(elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'participants' ? 'chat' : 'participants')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'participants'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">14 Participants</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </header>

      {/* Main Room Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Canvas Stage */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex flex-col justify-between relative overflow-y-auto">
          {streamError && (
            <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{streamError}</span>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-center">
            {/* Host Video Stage */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
              {roomInfo?.isHost ? (
                isCamOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-400 mb-3">
                      {user?.fullName ? user.fullName[0] : 'M'}
                    </div>
                    <p className="text-sm font-semibold text-slate-300">{user?.fullName || 'Lead Mentor (Host)'}</p>
                    <span className="text-xs text-slate-500">Camera turned off</span>
                  </div>
                )
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                    alt="Mentor Feed"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg text-[11px] text-emerald-400 font-semibold border border-slate-700/40">
                    <Mic className="w-3.5 h-3.5" />
                    Live Presenter
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-white">{roomInfo?.mentorName || 'Lead Mentor'}</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-extrabold px-1.5 py-0.5 rounded">HOST</span>
              </div>
            </div>

            {/* Participant Video Stage */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
              {!roomInfo?.isHost ? (
                isCamOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-400 mb-3">
                      {user?.fullName ? user.fullName[0] : 'S'}
                    </div>
                    <p className="text-sm font-semibold text-slate-300">{user?.fullName || 'Student (You)'}</p>
                    <span className="text-xs text-slate-500">Camera turned off</span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-400 mb-3">
                    <Users className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Student Participants Connected</p>
                  <span className="text-xs text-slate-500">Interactive Q&A Session Active</span>
                </div>
              )}

              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
                <span className="text-xs font-bold text-white">{!roomInfo?.isHost ? (user?.fullName || 'You') : 'Student Room'}</span>
                <span className="text-[10px] bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                  {!roomInfo?.isHost ? (user?.role || 'STUDENT') : 'PARTICIPANT'}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg text-[11px] border border-slate-700/40">
                {isMicOn ? (
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Floating Controls Bar */}
          <div className="mt-4 py-3 px-6 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 flex items-center justify-center gap-3 sm:gap-6 shadow-2xl mx-auto w-fit">
            <button
              onClick={toggleMic}
              title={isMicOn ? t('videoRoom.micOn') : t('videoRoom.micOff')}
              className={`p-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                isMicOn
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleCam}
              title={isCamOn ? t('videoRoom.camOn') : t('videoRoom.camOff')}
              className={`p-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                isCamOn
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleScreenShare}
              title={isScreenSharing ? t('videoRoom.stopShare') : t('videoRoom.shareScreen')}
              className={`p-3.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                isScreenSharing
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            <button
              onClick={handleLeaveRoom}
              title={t('videoRoom.leaveRoom')}
              className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">{t('videoRoom.leaveRoom')}</span>
            </button>
          </div>
        </div>

        {/* Right Drawer (Chat / Participants) */}
        <aside className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  {t('videoRoom.chatTitle')}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Real-time</span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">{m.sender}</span>
                        {m.isHost && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 font-extrabold px-1 rounded">
                            HOST
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed break-words">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Send Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('videoRoom.chatPlaceholder')}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-40 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Session Participants (14)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Host"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                        {roomInfo?.mentorName || 'Lead Mentor'}
                        <Shield className="w-3 h-3 text-blue-400" />
                      </div>
                      <div className="text-[10px] text-blue-400 font-semibold">Host / Mentor</div>
                    </div>
                  </div>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {user?.fullName ? user.fullName[0] : 'Y'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{user?.fullName || 'You'} (Me)</div>
                      <div className="text-[10px] text-slate-400">{user?.role || 'Student'}</div>
                    </div>
                  </div>
                  {isMicOn ? (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
export default MeetingRoomPage;
