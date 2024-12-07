import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Award, BookOpen, Code, Cpu, CheckCircle, XCircle } from 'lucide-react';

const RoboticsLearning = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  const phases = {
    1: {
      title: "Introduction to Electronics",
      description: "Learn the basics of electronics and circuits",
      lessons: [
        {
          title: "Basic Electronics Components",
          content: `
            Let's start with the fundamental components you'll need in robotics:
            
            1. Resistors - Control current flow
            2. Capacitors - Store electrical charge
            3. LEDs - Light-emitting diodes
            4. Switches - Control circuit completion
            
            Practice Task: Build a simple LED circuit on Wokwi with a resistor and switch.
          `
        },
        {
          title: "Understanding Voltage, Current, and Resistance",
          content: `
            Key concepts:
            - Voltage (V): Electrical pressure
            - Current (I): Flow of electricity
            - Resistance (Ω): Opposition to current flow
            
            Ohm's Law: V = I × R
            
            Practice: Calculate current in different circuit scenarios.
          `
        }
      ],
      quiz: [
        {
          question: "What is the purpose of a resistor in an LED circuit?",
          options: [
            "To make the circuit look complex",
            "To limit current and protect the LED",
            "To increase the voltage",
            "To store energy"
          ],
          correct: 1
        },
        {
          question: "Using Ohm's Law, if voltage is 5V and resistance is 250Ω, what is the current?",
          options: [
            "0.02A (20mA)",
            "1.25A",
            "125mA",
            "0.5A"
          ],
          correct: 0
        }
      ]
    },
    2: {
      title: "Introduction to Arduino",
      description: "Getting started with Arduino programming",
      lessons: [
        {
          title: "Arduino Basics and Setup",
          content: `
            Arduino is a microcontroller platform perfect for robotics:
            
            1. Download Arduino IDE
            2. Understanding digital vs analog pins
            3. Basic structure: setup() and loop()
            4. Your first program: Blinking LED
            
            Practice: Create a blinking LED program on Wokwi.
          `
        },
        {
          title: "Digital Input/Output",
          content: `
            Learn to:
            1. Read button states
            2. Control multiple LEDs
            3. Use pinMode() and digitalRead()/digitalWrite()
            
            Project: Create a traffic light system with buttons.
          `
        }
      ],
      quiz: [
        {
          question: "Which function runs repeatedly in an Arduino program?",
          options: [
            "setup()",
            "loop()",
            "main()",
            "repeat()"
          ],
          correct: 1
        },
        {
          question: "What is the correct way to configure a pin as an input?",
          options: [
            "pinMode(pin, INPUT);",
            "setMode(pin, INPUT);",
            "pinInput(pin);",
            "digitalInput(pin);"
          ],
          correct: 0
        }
      ]
    }
  };

  const handleSectionClick = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setCurrentQuiz(null);
  };

  const handleQuizStart = (phaseId) => {
    setCurrentQuiz(phaseId);
    setQuizAnswers({});
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex
    });
  };

  const calculateQuizScore = (phaseId) => {
    const phase = phases[phaseId];
    let correct = 0;
    phase.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });
    return (correct / phase.quiz.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            Interactive Robotics Learning Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Master robotics through hands-on learning and interactive content. Complete each phase to progress your skills from beginner to intermediate level.
          </p>
        </CardContent>
      </Card>

      {Object.entries(phases).map(([phaseId, phase]) => (
        <Card key={phaseId} className="border-l-4 border-l-blue-500">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleSectionClick(parseInt(phaseId))}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">Phase {phaseId}:</span>
                {phase.title}
                {completedLessons[phaseId] && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
              </div>
              {expandedSection === parseInt(phaseId) ? 
                <ChevronDown className="w-5 h-5" /> : 
                <ChevronRight className="w-5 h-5" />
              }
            </CardTitle>
            <p className="text-gray-600">{phase.description}</p>
          </CardHeader>

          {expandedSection === parseInt(phaseId) && (
            <CardContent className="space-y-4">
              {phase.lessons.map((lesson, idx) => (
                <div key={idx} className="border-l-2 border-gray-200 pl-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {lesson.title}
                  </h3>
                  <div className="whitespace-pre-line text-gray-600">
                    {lesson.content}
                  </div>
                </div>
              ))}

              {currentQuiz === parseInt(phaseId) ? (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-lg">Phase {phaseId} Quiz</h3>
                  {phase.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="border rounded-lg p-4">
                      <p className="font-medium mb-2">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option, oIdx) => (
                          <Button
                            key={oIdx}
                            variant={quizAnswers[qIdx] === oIdx ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => handleAnswerSelect(qIdx, oIdx)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(quizAnswers).length === phase.quiz.length && (
                    <div className="mt-4">
                      <p className="text-lg font-semibold">
                        Score: {calculateQuizScore(parseInt(phaseId))}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  className="mt-4"
                  onClick={() => handleQuizStart(parseInt(phaseId))}
                >
                  <Award className="w-5 h-5 mr-2" />
                  Take Quiz
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default RoboticsLearning;