import color from "colors";
import readline from "readline-sync";
import model from "./config/gemini-ai.js";

async function main() {
  const chatHistory = [];
  console.log(color.bold.red("Welcome to the AI chatbot"));
  console.log(color.bold.green("You can start chatting with the AI"));
  while (true) {
    const prompt = readline.question(color.yellow("You: "));
    try {
      const messages = chatHistory.map(([role, content]) => ({
        role,
        parts: [{ text: content }],
      }));
      messages.push({ role: "user", parts: [{ text: prompt }] });
      const chat = model.startChat({
        history: chatHistory.map(([role, content]) => ({
          role,
          parts: [{ text: content }],
        })),
      });

      const { response } = await chat.sendMessage(prompt);

      if (prompt === "exit") {
        console.log(color.bold.red("AI: ") + color.red(prompt));
        return;
      }
      // get the response from the AI
      const resultResponse = response.text();
      console.log(color.bold.green("AI: ") + resultResponse);

      // add the response to the chat history
      chatHistory.push(["user", prompt]);
      chatHistory.push(["model", resultResponse]);
    } catch (error) {
      console.log(color.bold.red(error));
    }
  }
}
main();
