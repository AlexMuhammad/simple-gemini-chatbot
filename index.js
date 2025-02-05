import color from "colors";
import readline from "readline-sync";
import model  from "./config/gemini-ai.js";

async function main() {
  console.log(color.bold.red("Welcome to the AI chatbot"));
  console.log(color.bold.green("You can start chatting with the AI"));

  while (true) {
    const prompt = readline.question(color.yellow("You: "));
    const { response } = await model.generateContent(prompt);
    try {
      if (prompt === "exit") {
        console.log(color.bold.red("AI: ") + color.red(prompt));
        return;
      }
      // get the response from the AI
      const resultResponse = response.text();
      console.log(color.bold.green("AI: ") + resultResponse)
    } catch (error) {
      console.log(color.bold.red(error));
    }
  }
}
main();
