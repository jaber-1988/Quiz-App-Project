import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuesIndex, setCurrentQuesIndex] = useState(0);
  const [defaultQuestion, setDefaultQuestion] = useState([]);
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_HOST).then((res) => {
      console.log(res);
      setDefaultQuestion(res.data);
    });
  }, []);


  const nextQuestion = () => {
    setCurrentQuesIndex(currentQuesIndex + 1);
  };

  const previousQuestion = () => {
    setCurrentQuesIndex(currentQuesIndex - 1);
  };

  const onChangeAnswer = (index) => {
    const newQuestionList = [...defaultQuestion];
    newQuestionList[currentQuesIndex].answer = index;
    setDefaultQuestion(newQuestionList);
  };

  const currentQuestion = defaultQuestion[currentQuesIndex];
  if (!currentQuestion) {
    return <p>loading....</p>;
  }

  const isCorrect = currentQuestion.answer === currentQuestion.correct;
  const showResult = () => {
    const result = {
      correctAnswer: 0,
      inCorrectAnswer: 0,
      withoutAnswer: 0,
    };

    defaultQuestion.forEach((Question) => {
      if (Question.answer === undefined) {
        result.withoutAnswer++;
      } else if (Question.answer === Question.correct) {
        result.correctAnswer++;
      } else {
        result.inCorrectAnswer++;
      }
    });

    navigate("/result", {
      state: result,
    });
  };
  
  return (
    <div
      className={`questionBox ${
        currentQuestion.answer !== undefined
          ? isCorrect
            ? "questionCorrect"
            : "questionIncorrect"
          : ""
      }`}
    >
      <h2 className="frage"> {currentQuestion.Frage}</h2>
      <div className="answer-box">
        {currentQuestion.antwort.map((item, index) => {
          return (
            <p className="answers">
              <input
                type="radio"
                name="radio"
                onChange={() => onChangeAnswer(index)}
                checked={currentQuestion.answer === index}
              />
              {item}
            </p>
          );
        })}
      </div>
      <div>
        <button onClick={previousQuestion} disabled={currentQuesIndex === 0}>
          Previous Question
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuesIndex === defaultQuestion.length - 1}
        >
          Next Question
        </button>
        <button onClick={showResult}>See your Score!</button>
      </div>
    </div>
  );
}
