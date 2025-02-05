import color from "colors";
import readline from "readline-sync";
import model from "./config/gemini-ai.js";

const MAX_HISTORY_LENGTH = 10;
const initialPrompt = `Kamu adalah chatbot PDKT yang membantu orang dalam percintaan. Berikan saran yang ramah, lucu, dan tidak menggurui.  Sapa pengguna dengan hangat.`;

async function main() {
  const chatHistory = [["user", initialPrompt]];
  const { response } = await model.startChat().sendMessage(initialPrompt);
  chatHistory.push(["model", response.text()]);

  console.log(color.bold.red("Selamat Datang Wahai Pejuang Cinta!"));
  console.log(color.bold.green("Mulai Obrolanmu"));

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
      // Mendapatkan respons dari model
      const { response } = await chat.sendMessage(prompt);
      const candidates = response.candidates;

      if (candidates && candidates.length > 0) {
        // OPSI: Pilih respons pertama dari candidates
        const resultResponse = candidates[0].content.parts[0].text;
        console.log(color.bold.green("😇Dukun Cinta: ") + resultResponse);
        chatHistory.push(["user", prompt]);
        chatHistory.push(["model", resultResponse]);

        if (chatHistory.length > MAX_HISTORY_LENGTH) {
          chatHistory.shift();
          chatHistory.shift();
        }

        // Catatan: Bisa menambahkan logika untuk menentukan apakah respons dari AI memenuhi kriteria
      } else {
        console.log(
          color.bold.red("😇Dukun Cinta: ") + "Maaf, tidak bisa ber-word2🥹."
        );
      }
    } catch (error) {
      console.log(color.bold.red(error));
    }
  }
}
main();
