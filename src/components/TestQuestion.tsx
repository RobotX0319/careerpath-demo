import React from 'react';

interface TestQuestionProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
  selectedAnswer?: number;
}

const options = [
  { value: 5, label: "+ To'liq roziman", color: 'from-green-400 to-green-600' },
  { value: 4, label: 'Roziman', color: 'from-lime-400 to-lime-500' },
  { value: 3, label: 'Noaniq', color: 'from-blue-200 to-blue-400' },
  { value: 2, label: 'Rozi emasman', color: 'from-orange-300 to-orange-400' },
  { value: 1, label: 'Umuman rozi emasman', color: 'from-red-400 to-red-600' },
];

export const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
}) => {
  const percent = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-gradient-to-r from-blue-200 to-blue-400 mb-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500">{questionNumber} / {totalQuestions}</div>

      {/* Question Text */}
      <div className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 select-none">
        {question}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`w-full min-h-[44px] rounded-xl shadow-md transition-all duration-300 text-lg font-medium flex items-center justify-center
              bg-gradient-to-r ${opt.color}
              border-2
              ${selectedAnswer === opt.value ? 'border-blue-700 scale-105 ring-2 ring-blue-300' : 'border-transparent'}
              hover:scale-105 hover:ring-2 hover:ring-blue-200
              focus:outline-none focus:ring-2 focus:ring-blue-400
              text-white`}
            style={{
              boxShadow: selectedAnswer === opt.value ? '0 4px 24px 0 rgba(59,130,246,0.15)' : undefined,
            }}
            onClick={() => onAnswer(opt.value)}
            aria-pressed={selectedAnswer === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestQuestion;
