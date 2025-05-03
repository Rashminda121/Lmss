// components/ask-question.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsStars } from "react-icons/bs";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { BiUser } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { createDeepSeekStream } from "@/lib/deepSeeklLib";
import { FaSpinner } from "react-icons/fa";

interface Question {
  _id: string;
  userId: string;
  uname: string;
  courseId: string;
  chapterId: string;
  text: string;
  createdAt: Date;
  answers: Answer[];
}

interface Answer {
  _id: string;
  userId: string;
  uname: string;
  text: string;
  createdAt: Date;
}

interface AskQuestionProps {
  chapterId: string;
  courseId: string;
  userId: string;
  courseDetails: any;
  chapterDetails: any;
}

interface UserProfileData {
  name?: string;
  email?: string;
  role?: string;
}

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const AskQuestion = ({
  chapterId,
  courseId,
  userId,
  courseDetails,
  chapterDetails,
}: AskQuestionProps) => {
  const { user, isLoaded } = useUser();
  const [question, setQuestion] = useState("");
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiSubmitting, setIsAISubmitting] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const hasFetchedData = useRef(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    if (!user) return;

    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return;
    }

    const uid = encodeURIComponent(user.id ?? "");
    const email = encodeURIComponent(
      user.primaryEmailAddress?.emailAddress ?? ""
    );

    try {
      const response = await fetch(
        `${backendUrl}/user/userProfile?uid=${uid}&email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data === "object") {
        setUserProfile(data);
      } else {
        console.error("Invalid user profile data:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      getUser();
    }
  }, [isLoaded, user]);

  const role = userProfile?.role;
  const userRole = role === "lecturer" || role === "admin" ? role : "student";

  const getQuestionData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/viewCourseQuestions",
        { courseId, chapterId }
      );
      // Ensure questions is always an array

      console.log(response.data.questions);
      setQuestions(response.data ? response.data.questions : []);
    } catch (error: any) {
      console.log("No questions available");
      setQuestions([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    if (isLoaded && !hasFetchedData.current) {
      getQuestionData();
      hasFetchedData.current = true;
    }
  }, [isLoaded]);

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      Swal.fire("Error", "Question cannot be empty", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://localhost:4000/user/addCourseQuestion",
        {
          userId: userId,
          courseId: courseId,
          chapterId: chapterId,
          text: question,
          uname: user?.fullName || "Anonymous",
        }
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Question added successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });

      setQuestion("");
      getQuestionData();
    } catch (error) {
      console.error("Failed to post question:", error);
      Swal.fire("Error", "Failed to post question. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const answer = answerText[questionId]?.trim();
    if (!answer) {
      Swal.fire("Error", "Answer cannot be empty", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://localhost:4000/user/addAnswerToCourseQuestion",
        {
          questionId: questionId,
          userId: userId,
          text: answer,
          uname: user?.fullName || "Anonymous",
        }
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Answer added successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
      getQuestionData();
    } catch (error) {
      console.error("Failed to post answer:", error);
      Swal.fire("Error", "Failed to post answer. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete("http://localhost:4000/user/deleteCourseQuestion", {
          data: { _id: questionId },
        });

        Swal.fire("Deleted!", "Your question has been deleted.", "success");
        getQuestionData();
      }
    } catch (error: any) {
      console.error("Failed to delete question:", error);
      Swal.fire(
        "Error",
        "Failed to delete question. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          "http://localhost:4000/user/deleteCourseQuestionAnswer",
          {
            data: { questionId, answerId },
          }
        );

        Swal.fire("Deleted!", "Your answer has been deleted.", "success");
        getQuestionData();
      }
    } catch (error: any) {
      console.error("Failed to delete answer:", error);
      Swal.fire("Error", "Failed to delete answer. Please try again.", "error");
    }
  };

  const startEditingQuestion = (questionId: string, currentText: string) => {
    setEditingQuestionId(questionId);
    setEditQuestionText(currentText);
  };

  const saveEditedQuestion = async (questionId: string) => {
    try {
      await axios.put("http://localhost:4000/user/updateCourseQuestion", {
        _id: questionId,
        text: editQuestionText,
      });

      Swal.fire("Success", "Question updated successfully!", "success");
      setEditingQuestionId(null);
      getQuestionData();
    } catch (error) {
      console.error("Failed to update question:", error);
      Swal.fire(
        "Error",
        "Failed to update question. Please try again.",
        "error"
      );
    }
  };

  const startEditingAnswer = (answerId: string, currentText: string) => {
    setEditingAnswerId(answerId);
    setEditAnswerText(currentText);
  };

  const saveEditedAnswer = async (questionId: string, answerId: string) => {
    try {
      await axios.put("http://localhost:4000/user/updateCourseQuestionAnswer", {
        answerId: answerId,
        questionId: questionId,
        text: editAnswerText,
      });

      Swal.fire("Success", "Answer updated successfully!", "success");
      setEditingAnswerId(null);
      getQuestionData();
    } catch (error) {
      console.error("Failed to update answer:", error);
      Swal.fire("Error", "Failed to update answer. Please try again.", "error");
    }
  };

  const handleAi = async (questionText: string) => {
    try {
      setIsAISubmitting(true);

      const swalInstance = Swal.fire({
        title: "Generating AI answer...",
        html: `
        <div class="flex justify-center items-center py-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      `,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      const messages: DeepSeekMessage[] = [
        {
          role: "system",
          content: `You are a teaching assistant for the course titled "${
            courseDetails?.title || "N/A"
          }", described as: "${
            courseDetails?.description || "No description provided"
          }", and the chapter titled "${
            chapterDetails?.title || "N/A"
          }", described as: "${
            chapterDetails?.description || "No description provided"
          }".

        If course or chapter details are missing, answer based on the question alone. Provide a clear, simple, and factual final answer. Do not speculate—if unsure, respond with: "I cannot confirm." Keep your response concise and within 100 words. This is the final answer with no follow-up.`,
        },
        {
          role: "user",
          content: questionText,
        },
      ];

      // Get the stream from DeepSeek
      const stream = await createDeepSeekStream(messages);
      if (!stream) {
        throw new Error("Failed to get stream from DeepSeek API");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let aiAnswer = "";

      const updatePopup = (content: string) => {
        Swal.update({
          html: `
        <div class="text-left space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">AI Answer</h3>
          <div class="max-h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="prose prose-sm text-xs md:text-sm text-gray-700">
              ${content || '<p class="text-gray-400">Generating answer...</p>'}
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <button 
              id="close-ai-popup" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      `,
          showConfirmButton: false,
        });

        document
          .getElementById("close-ai-popup")
          ?.addEventListener("click", () => {
            Swal.close();
            setIsAISubmitting(false);
          });
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.replace("data:", "").trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || "";
                aiAnswer += content;
                updatePopup(aiAnswer);
              } catch (err) {
                console.error("Error parsing chunk:", err, line);
              }
            }
          }
        }
      } catch (error) {
        console.error("Stream reading error:", error);
        throw error;
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("AI error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to get AI response. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-4">
      {userRole && (
        <div className="p-3 sm:p-4 border rounded-lg bg-white">
          <h3 className="font-medium text-lg mb-3">Ask a Question</h3>

          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask about this chapter?"
            className="min-h-[100px]"
          />

          <div className="flex justify-end items-center mt-2 gap-3 sm:gap-4">
            <button
              onClick={() => handleAi(question)}
              disabled={isAiSubmitting || !question.trim()}
              className="text-gray-500 p-2 hover:text-indigo-600 hover:shadow-md transition-colors border border-blue-600 rounded-full"
              title="Ask From AI"
            >
              {isAiSubmitting ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <BsStars className="w-5 h-5" />
              )}
            </button>
            <Button
              onClick={handleQuestionSubmit}
              disabled={isSubmitting || !question.trim()}
              size="sm"
              className="text-xs sm:text-sm"
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium text-lg px-2 sm:px-0">
          Questions & Answers
        </h3>

        {questions.length === 0 ? (
          <p className="text-muted-foreground px-2 sm:px-0">
            No questions yet. Be the first to ask!
          </p>
        ) : (
          questions.map((q: Question) => (
            <div key={q._id} className="p-3 sm:p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      q.userId === userId ? "bg-blue-100" : "bg-gray-200"
                    }`}
                  >
                    <span className="text-xs">
                      {userRole ? (
                        <BiUser className="text-gray-600 text-2xl" />
                      ) : (
                        <MdAdminPanelSettings className="text-blue-600 text-2xl" />
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {q.uname || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(q.createdAt).toLocaleDateString()} at{" "}
                      {new Date(q.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Question actions dropdown */}
                {(userRole === "admin" || q.userId === userId) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => startEditingQuestion(q._id, q.text)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Question text or edit field */}
              {editingQuestionId === q._id ? (
                <div className="ml-0 sm:ml-10 space-y-2">
                  <Textarea
                    value={editQuestionText}
                    onChange={(e) => setEditQuestionText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuestionId(null)}
                      className="text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveEditedQuestion(q._id)}
                      className="text-xs sm:text-sm"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="ml-0 sm:ml-10 text-sm sm:text-base">{q.text}</p>
              )}

              {/* Answers section */}
              {q.answers && q.answers.length > 0 && (
                <div className="ml-0 sm:ml-10 space-y-3">
                  <div className="border-l-2 pl-2 sm:pl-4 space-y-3">
                    {q.answers.map((a: Answer) => (
                      <div key={a._id} className="pt-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                a.userId === userId
                                  ? "bg-blue-100"
                                  : "bg-gray-200"
                              }`}
                            >
                              <span className="text-xs">
                                {userRole ? (
                                  <BiUser className="text-gray-600 text-2xl" />
                                ) : (
                                  <MdAdminPanelSettings className="text-blue-600 text-2xl" />
                                )}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-medium">
                                {a.uname || "Anonymous"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(a.createdAt).toLocaleDateString()} at{" "}
                                {new Date(a.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Answer actions dropdown */}
                          {(userRole === "admin" || a.userId === userId) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    startEditingAnswer(a._id, a.text)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span className="text-xs sm:text-sm">
                                    Edit
                                  </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteAnswer(q._id, a._id)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span className="text-xs sm:text-sm">
                                    Delete
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        {/* Answer text or edit field */}
                        {editingAnswerId === a._id ? (
                          <div className="ml-0 sm:ml-8 space-y-2">
                            <Textarea
                              value={editAnswerText}
                              onChange={(e) =>
                                setEditAnswerText(e.target.value)
                              }
                              className="min-h-[80px] text-sm"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAnswerId(null)}
                                className="text-xs sm:text-sm"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => saveEditedAnswer(q._id, a._id)}
                                className="text-xs sm:text-sm"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="ml-0 sm:ml-8 text-sm">{a.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Form (only for lecturers and admins) */}
              {(userRole === "admin" || userRole === "lecturer") && (
                <div className="ml-0 sm:ml-10 mt-3">
                  <Textarea
                    value={answerText[q._id] || ""}
                    onChange={(e) =>
                      setAnswerText((prev) => ({
                        ...prev,
                        [q._id]: e.target.value,
                      }))
                    }
                    placeholder="Write your answer here..."
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => handleAnswerSubmit(q._id)}
                      disabled={isSubmitting || !answerText[q._id]?.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      {isSubmitting ? "Posting..." : "Post Answer"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
