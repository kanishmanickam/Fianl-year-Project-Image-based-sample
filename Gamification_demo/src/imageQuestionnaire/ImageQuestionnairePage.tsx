import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMAGE_QUESTIONS } from './imageQuestions';
import { useImageQuestionnaireStore } from './ImageQuestionnaireStore';
import ImageQuestionCard from './ImageQuestionCard';

// ─── Thank You Screen ─────────────────────────────────────────────────────────
const ThankYouScreen: React.FC = () => {
    const { restart } = useImageQuestionnaireStore();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 px-4"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.15 }}
                className="text-7xl mb-6"
            >
                ✅
            </motion.div>
            <h2 className="font-display font-black text-2xl text-white mb-3 tracking-wide">
                Thank You!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
                Your responses have been recorded successfully.
            </p>
            <p className="text-slate-500 text-xs mb-8">
                Image-Based Questionnaire · 12 of 12 completed
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={restart}
                    className="px-8 py-3 rounded-xl font-bold text-sm bg-[#00f0ff] text-black hover:opacity-90 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                    ↺ &nbsp;Restart Questionnaire
                </button>
            </div>
        </motion.div>
    );
};

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
const QuizScreen: React.FC = () => {
    const navigate = useNavigate();
    const {
        currentIndex,
        answers,
        selectOption,
        nextQuestion,
        prevQuestion,
        submit,
        currentAnswer,
        allAnswered,
    } = useImageQuestionnaireStore();

    const q = IMAGE_QUESTIONS[currentIndex];
    const total = IMAGE_QUESTIONS.length;
    const progress = ((currentIndex + 1) / total) * 100;
    const selected = currentAnswer();
    const isLast = currentIndex === total - 1;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
            >
                {/* ── Top bar ── */}
                <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-black text-[#00f0ff] uppercase tracking-widest bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20 w-fit">
                        Image-Based Questionnaire
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3 mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <span>Question {currentIndex + 1} of {total}</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-5">
                    <motion.div
                        className="h-full rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff88]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                </div>

                {/* Trait label */}
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ff00ff] mb-2">
                    {q.trait}
                </p>

                {/* ── Scenario panel (if available) ── */}
                {q.scenario && (
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 mb-4">
                        <p className="text-slate-300 font-medium text-sm leading-relaxed">
                            {q.scenario}
                        </p>
                    </div>
                )}

                {/* ── Question text ── */}
                <h2 className="font-display font-bold text-lg md:text-xl text-white leading-snug mb-5 glow-text-cyan">
                    {q.question}
                </h2>

                {/* Caption prompt */}
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">
                    Select the image that best represents you:
                </p>

                {/* ── Image cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {q.options.map((opt) => (
                        <ImageQuestionCard
                            key={opt.id}
                            option={opt}
                            isSelected={answers[q.id] === opt.id}
                            onSelect={() => selectOption(q.id, opt.id)}
                        />
                    ))}
                </div>

                {/* ── Navigation ── */}
                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    >
                        ← Previous
                    </button>

                    {!isLast ? (
                        <button
                            onClick={nextQuestion}
                            disabled={!selected}
                            className="px-7 py-2.5 rounded-xl text-sm font-black bg-[#00f0ff] text-black hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-[0_0_14px_rgba(0,240,255,0.3)]"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={submit}
                            disabled={!allAnswered()}
                            className="px-7 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-black hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-[0_0_14px_rgba(0,240,255,0.3)]"
                        >
                            Submit Responses
                        </button>
                    )}
                </div>

                {isLast && !allAnswered() && (
                    <p className="text-amber-400/70 text-xs text-center mt-3">
                        Please answer all {total} questions before submitting.
                    </p>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

// ─── Page root ────────────────────────────────────────────────────────────────
const ImageQuestionnairePage: React.FC = () => {
    const { phase } = useImageQuestionnaireStore();

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#05030f]/95 backdrop-blur-md p-4 overflow-y-auto">
            {/* Ambient glow blobs */}
            <div className="fixed top-1/4 left-1/4 w-80 h-80 bg-[#00f0ff]/6 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-[#ff00ff]/6 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 32 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="relative w-full max-w-2xl my-8"
            >
                {/* Glass card — same style as CyberAssessmentOverlay */}
                <div className="
          relative rounded-2xl overflow-hidden
          bg-black/95 border border-[#00f0ff]/35
          shadow-[0_0_50px_rgba(0,240,255,0.18)]
          p-6 md:p-8
        ">
                    {/* Corner glow accents */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ff00ff]/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        {phase === 'quiz' && <QuizScreen />}
                        {phase === 'thankyou' && <ThankYouScreen />}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-700 mt-4">
                    CyberRisk · Image-Based Questionnaire · Academic Prototype
                </p>
            </motion.div>
        </div>
    );
};

export default ImageQuestionnairePage;
