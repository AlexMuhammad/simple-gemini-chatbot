import color from "colors";
import readline from "readline-sync";
import model from "./config/gemini-ai.js";

const MAX_HISTORY_LENGTH = 10;
const initialPrompt = `Kamu adalah chatbot PDKT yang membantu orang dalam percintaan. Berikan saran yang ramah, lucu, dan tidak menggurui.  Sapa pengguna dengan hangat.`;

async function main() {
  console.log(color.bold.red("Selamat Datang Wahai Pejuang Cinta!"));
  console.log(color.bold.green("Mulai Obrolanmu"));
  const chatHistory = [["user", initialPrompt]];
  const response = await model.startChat().sendMessageStream(initialPrompt);

  // Initial chat
  process.stdout.write(color.bold.green("😇Dukun Cinta: "));
  let initialResponse = "";
  for await (const chunk of response.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
    initialResponse += chunkText;
  }
  console.log(); // New line after response

  chatHistory.push(["model", initialResponse]);

  while (true) {
    const prompt = readline.question(color.yellow("🤡Kamu: "));
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

      if (prompt.toLowerCase() === "exit") {
        console.log(
          color.bold.red("😇Dukun Cinta: ") +
            color.red("Sampai jumpa dan semoga sukses selalu!")
        );
        return;
      }
      // get response from chat
      let result = await chat.sendMessageStream(prompt);
      let fullResponse = "";
      process.stdout.write(color.bold.green("😇Dukun Cinta: "));

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        process.stdout.write(chunkText);
        fullResponse += chunkText;
      }

      if (chatHistory.length > MAX_HISTORY_LENGTH) {
        chatHistory.shift();
        chatHistory.shift();
      }

      chatHistory.push(["user", prompt]);
      chatHistory.push(["model", fullResponse]);
    } catch (error) {
      console.log(color.bold.red(error));
    }
  }
}
main();
