"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import {
  PERSONALITY_QUESTIONS,
  validateAnswers,
  generateAssessment,
} from "@/lib/personality";
import type { PersonalityAnswer } from "@/lib/personality";

interface UserForm {
  name: string;
  email: string;
  age: string;
  experience: string;
}

export default function TestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "user-info" | "test" | "processing"
  >("user-info");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalityAnswer[]>([]);
  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    age: "",
    experience: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load previous progress if exists
  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    const savedAnswers = localStorage.getItem("personalityAnswers");

    if (savedUserData) {
      setUserForm(JSON.parse(savedUserData));
    }

    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);
      if (parsedAnswers.length > 0) {
        setCurrentStep("test");
        setCurrentQuestion(parsedAnswers.length);
      }
    }
  }, []);

  const validateUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!userForm.name.trim()) {
      errors.name = "Ism majburiy";
    } else if (userForm.name.trim().length < 2) {
      errors.name = "Ism kamida 2 ta harf bo'lishi kerak";
    }

    if (!userForm.email.trim()) {
      errors.email = "Email majburiy";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = "Noto'g'ri email format";
    }

    if (!userForm.age) {
      errors.age = "Yosh majburiy";
    } else if (parseInt(userForm.age) < 14 || parseInt(userForm.age) > 65) {
      errors.age = "Yosh 14-65 oralig'ida bo'lishi kerak";
    }

    if (!userForm.experience) {
      errors.experience = "Tajriba darajasini tanlang";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateUserForm()) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...userForm,
          testDate: new Date().toISOString(),
        })
      );
      setCurrentStep("test");
    }
  };

  const handleAnswerSelect = (value: number) => {
    const questionId = PERSONALITY_QUESTIONS[currentQuestion].id;
    const newAnswer: PersonalityAnswer = {
      questionId,
      value,
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingIndex !== -1) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);
    localStorage.setItem("personalityAnswers", JSON.stringify(updatedAnswers));

    // Auto advance to next question
    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Test completed
      handleTestComplete(updatedAnswers);
    }
  };

  const handleTestComplete = async (finalAnswers: PersonalityAnswer[]) => {
    try {
      setCurrentStep("processing");
      setIsSubmitting(true);

      // Validate answers
      const validation = validateAnswers(finalAnswers);
      if (!validation.isValid) {
        alert("Test yakunlanmadi: " + validation.errors.join(", "));
        return;
      }

      // Generate assessment
      const assessment = generateAssessment(finalAnswers);

      // Save to localStorage
      localStorage.setItem("personalityAssessment", JSON.stringify(assessment));
      localStorage.setItem("testCompleted", "true");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Navigate to results
      router.push("/results");
    } catch (error) {
      console.error("Error completing test:", error);
      alert("Testni yakunlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      setCurrentStep("test");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100;
  const currentAnswer = answers.find(
    (a) => a.questionId === PERSONALITY_QUESTIONS[currentQuestion]?.id
  );

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-6">
            Natijalaringiz tayyorlanmoqda...
          </h2>
          <p className="text-gray-600 mt-2">
            Shaxsiyat tahlili va karyera tavsiyalari yaratilmoqda
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Iltimos kuting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "user-info" && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Shaxsiyat Testi</h1>
              <p className="text-lg text-gray-600">
                Karyera yo'nalishingizni aniqlash uchun qisqa ma'lumot bering
              </p>
            </div>

            <form
              onSubmit={handleUserFormSubmit}
              className="max-w-md mx-auto space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  To'liq ismingiz *
                </label>
                <input
                  type="text"
                  id="name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Misol: Ali Valiyev"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email manzilingiz *
                </label>
                <input
                  type="email"
                  id="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ali@example.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Yoshingiz *
                </label>
                <select
                  id="age"
                  value={userForm.age}
                  onChange={(e) =>
                    setUserForm({ ...userForm, age: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.age ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Yoshni tanlang</option>
                  {Array.from({ length: 52 }, (_, i) => i + 14).map((age) => (
                    <option key={age} value={age}>
                      {age} yosh
                    </option>
                  ))}
                </select>
                {formErrors.age && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ish tajribangiz *
                </label>
                <select
                  id="experience"
                  value={userForm.experience}
                  onChange={(e) =>
                    setUserForm({ ...userForm, experience: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.experience ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Tajriba darajasini tanlang</option>
                  <option value="student">Talaba / Ishsiz</option>
                  <option value="entry">0-1 yil tajriba</option>
                  <option value="junior">1-3 yil tajriba</option>
                  <option value="mid">3-5 yil tajriba</option>
                  <option value="senior">5+ yil tajriba</option>
                </select>
                {formErrors.experience && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.experience}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Testni boshlash
              </button>
            </form>
          </div>
        )}

        {currentStep === "test" && PERSONALITY_QUESTIONS[currentQuestion] && (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Savol {currentQuestion + 1} /{" "}
                  {PERSONALITY_QUESTIONS.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% tugallandi
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {PERSONALITY_QUESTIONS[currentQuestion].text}
              </h2>
              <p className="text-gray-600">
                Quyidagi shkalada o'zingizga mos javobni tanlang
              </p>
            </div>

            {/* Answer options */}
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswerSelect(value)}
                    className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
                      currentAnswer?.value === value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-2">{value}</div>
                    <div className="text-xs text-gray-600">
                      {value === 1 && "Umuman mos kelmaydi"}
                      {value === 2 && "Mos kelmaydi"}
                      {value === 3 && "Neytral"}
                      {value === 4 && "Mos keladi"}
                      {value === 5 && "To'liq mos keladi"}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Oldingi savol
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestion >= PERSONALITY_QUESTIONS.length - 1 ||
                    !currentAnswer
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                  {currentQuestion >= PERSONALITY_QUESTIONS.length - 1
                    ? "Testni yakunlash"
                    : "Keyingi savol"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
