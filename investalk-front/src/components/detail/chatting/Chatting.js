import { React, useEffect, useRef, useState } from "react";
import styles from "./Chatting.module.css"; // CSS 모듈 import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import CustomerMessage from "./CustomerMessage"; // 고객 메시지 컴포넌트 import
import GptMessage from "./GptMessage"; // GPT 메시지 컴포넌트 import
import ChatInput from "./ChatInput"; // ChatInput 컴포넌트 import
import axios from "axios";

const Chatting = () => {
  const chatContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false); // 화살표 상태 관리
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState([]); // 메시지 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // 스크롤을 맨 아래로 이동
    }
  };

  const sendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "customer", message, time: new Date().toLocaleTimeString() },
    ]);
  
    setIsLoading(true); // 로딩 상태 활성화
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat`, 
        {
          params: {
            message: message, // 쿼리 파라미터에 메시지 추가
          },
        }
      );
  
      if (response.status === 200 && response.data) {
        // GPT 응답 데이터에서 "출력" 부분만 추출
        const output = response.data.generated_text?.split("출력:")[1]?.trim() || "응답을 가져오는 데 실패했습니다.";
  
        setIsLoading(false); // 로딩 상태 비활성화 (타이핑 시작 전에 종료)
        await simulateTyping(output);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "gpt",
          message: "GPT 서버와의 연결에 실패했습니다.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };
  
  // 타이핑 효과 구현
  const simulateTyping = async (output) => {
    const words = output.split(" "); // 띄어쓰기로 단어 분리
    let displayedMessage = ""; // 표시할 메시지 초기화
  
    for (let i = 0; i < words.length; i++) {
      displayedMessage += (i === 0 ? "" : " ") + words[i]; // 단어 추가
      setMessages((prevMessages) => {
        // 마지막 GPT 메시지를 업데이트
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.findIndex((msg) => msg.type === "gpt" && !msg.completed);
  
        if (lastMessageIndex !== -1) {
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            message: displayedMessage,
          };
        } else {
          updatedMessages.push({
            type: "gpt",
            message: displayedMessage,
            time: new Date().toLocaleTimeString(),
            completed: false,
          });
        }
  
        return updatedMessages;
      });
  
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms 대기
    }
  
    // 메시지 완료 표시
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessageIndex = updatedMessages.findIndex((msg) => msg.type === "gpt" && !msg.completed);
  
      if (lastMessageIndex !== -1) {
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          completed: true, // 메시지 완료 상태
        };
      }
  
      return updatedMessages;
    });
  };
  
  

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        // 스크롤이 위쪽으로 올라갔을 때만 화살표 표시
        const isScrolledUp =
          chatContainerRef.current.scrollTop <
          chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight - 100;
        setShowScrollToBottom(isScrolledUp);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapGroupWrapper}>
        <div className={styles.overlap4}>
          <div className={styles.textWrapper18}>Assistalk</div>
          <div className={styles.group3} ref={chatContainerRef}>
            {/* 메시지 상태를 순회하며 렌더링 */}
            {messages.map((msg, index) =>
              msg.type === "customer" ? (
                <CustomerMessage
                  key={index}
                  message={msg.message}
                  time={msg.time}
                />
              ) : (
                <GptMessage key={index} message={msg.message} time={msg.time} />
              )
            )}
            {isLoading && (
              <GptMessage message="" time="" isLoading={true} />
            )}
          </div>
          <div className={styles.rectangle7}></div>
          {/* 하단 채팅 입력창 컴포넌트 */}
          <ChatInput
            scrollToBottom={scrollToBottom}
            showScrollToBottom={showScrollToBottom}
            chatText={chatText}
            setChatText={setChatText}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatting;
