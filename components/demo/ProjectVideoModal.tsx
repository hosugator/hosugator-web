'use client';

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaSrc: string; // 이름을 videoSrc에서 mediaSrc로 범용화
    title: string;
    type: 'video' | 'image'; // 타입 추가
}

export default function ProjectVideoModal({ isOpen, onClose, mediaSrc, title, type }: ProjectVideoModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* 타입에 따른 렌더링 분기 */}
                {type === 'video' ? (
                    <video
                        src={mediaSrc}
                        autoPlay
                        controls
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center p-4">
                        <img
                            src={mediaSrc}
                            alt={title}
                            className="w-full h-full object-contain shadow-sm"
                        />
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <h3 className="text-white text-xl font-black">{title}</h3>
                </div>
            </div>
        </div>,
        document.body
    );
}